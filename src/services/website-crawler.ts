import "server-only";

import type { Browser, BrowserContext, Page } from "playwright";
import { CRAWL_CONFIG } from "@/src/lib/crawl-config";
import { launchChromium } from "@/src/lib/playwright-config";
import {
    classifyPageType,
    dedupeStrings,
    extractEmails,
    extractPhoneNumbers,
    extractSocialLinks,
    getUrlPath,
    hasAboutPath,
    hasContactPath,
    hasPrivacyPath,
    hasServicesPath,
    hasTermsPath,
    isBlockedCrawlPath,
    normalizeCrawlUrl,
    truncateVisibleText,
} from "@/src/lib/crawl-utils";
import {
    PublicUrlValidationError,
    validatePublicCrawlUrl,
} from "@/src/lib/validate-public-url";
import { installPlaywrightNetworkGuard } from "@/src/services/playwright-network-guard";
import {
    evaluateDiscoverLinks,
    evaluateExtractPageData,
} from "@/src/services/crawl-browser-evaluate";
import { normalizeWebsiteUrl } from "@/src/lib/normalize-domain";
import type { CrawlPageResult } from "@/src/schemas/crawl-data";
import type { PageType } from "@/src/schemas/enums";

export type CrawlWebsiteInput = {
    websiteId: string;
    requestedUrl: string;
    maxPages?: number;
    maxDepth?: number;
};

export type CrawlWebsiteResult = {
    requestedUrl: string;
    finalUrl: string;
    homepageTitle: string;
    metaDescription: string;
    language: string;
    pagesDiscovered: number;
    pagesCrawled: number;
    internalLinks: string[];
    externalLinks: string[];
    emailsFound: string[];
    phoneNumbersFound: string[];
    socialLinks: string[];
    hasAboutPage: boolean;
    hasContactPage: boolean;
    hasServicesPage: boolean;
    hasPrivacyPolicy: boolean;
    hasTerms: boolean;
    pageResults: CrawlPageResult[];
    crawlDurationMs: number;
    homepageUrl: string;
};

type DiscoveredLink = {
    url: string;
    anchorText?: string;
};

type ExtractedPage = {
    url: string;
    path: string;
    pageType: PageType;
    title: string;
    metaDescription: string;
    language: string;
    headings: Array<{ level: number; text: string }>;
    buttons: Array<{ text: string; href?: string }>;
    forms: Array<{
        action?: string;
        method?: string;
        fields: Array<{
            type?: string;
            name?: string;
            label?: string;
            required: boolean;
        }>;
    }>;
    images: Array<{ src?: string; alt?: string }>;
    visibleText: string;
    internalLinks: string[];
    externalLinks: string[];
    mailtoLinks: string[];
    telLinks: string[];
    statusCode?: number;
    loadDurationMs?: number;
    errorMessage?: string | null;
};

async function extractPageData(
    page: Page,
    pageType: PageType,
    baseDomain: string,
): Promise<ExtractedPage> {
    const url = page.url();
    const path = getUrlPath(url);

    const extracted = await evaluateExtractPageData(page);

    const internalLinks: string[] = [];
    const externalLinks: string[] = [];
    for (const link of extracted.linkUrls) {
        try {
            const normalized = normalizeCrawlUrl(new URL(link), baseDomain);
            if (normalized) internalLinks.push(normalized);
            else externalLinks.push(link);
        } catch {
            // Ignore invalid URLs.
        }
    }

    return {
        url,
        path,
        pageType,
        title: extracted.title,
        metaDescription: extracted.metaDescription,
        language: extracted.language,
        headings: extracted.headings,
        buttons: extracted.buttons,
        forms: extracted.forms,
        images: extracted.images,
        visibleText: truncateVisibleText(
            extracted.visibleText,
            CRAWL_CONFIG.maxVisibleTextCharactersPerPage,
        ),
        internalLinks,
        externalLinks,
        mailtoLinks: extracted.mailtoLinks,
        telLinks: extracted.telLinks,
    };
}

async function navigateSafely(page: Page, targetUrl: string): Promise<number | undefined> {
    let currentUrl = targetUrl;
    let redirectCount = 0;

    while (redirectCount <= CRAWL_CONFIG.maxRedirects) {
        await validatePublicCrawlUrl(currentUrl);
        const response = await page.goto(currentUrl, {
            waitUntil: "domcontentloaded",
            timeout: CRAWL_CONFIG.timeoutMs,
        });

        await page.waitForTimeout(CRAWL_CONFIG.contentSettleMs);

        const finalUrl = page.url();
        await validatePublicCrawlUrl(finalUrl);

        if (finalUrl === currentUrl || redirectCount === CRAWL_CONFIG.maxRedirects) {
            return response?.status();
        }

        currentUrl = finalUrl;
        redirectCount += 1;
    }

    throw new PublicUrlValidationError("Too many redirects.");
}

async function discoverLinks(
    page: Page,
    baseDomain: string,
): Promise<{ internal: DiscoveredLink[]; external: string[] }> {
    const rawLinks = await evaluateDiscoverLinks(page);

    const internal: DiscoveredLink[] = [];
    const external: string[] = [];

    for (const link of rawLinks) {
        if (!link.href || link.href.startsWith("#")) continue;
        if (link.href.startsWith("mailto:") || link.href.startsWith("tel:")) continue;

        try {
            const resolved = new URL(link.href, page.url());
            const normalized = normalizeCrawlUrl(resolved, baseDomain);
            if (!normalized) {
                external.push(resolved.toString());
                continue;
            }
            if (isBlockedCrawlPath(getUrlPath(normalized))) continue;
            internal.push({ url: normalized, anchorText: link.text });
        } catch {
            // Ignore invalid URLs.
        }
    }

    return { internal, external };
}

export async function crawlWebsite(
    input: CrawlWebsiteInput,
): Promise<CrawlWebsiteResult> {
    const startedAt = Date.now();
    const maxPages = input.maxPages ?? CRAWL_CONFIG.maxPages;
    const maxDepth = input.maxDepth ?? CRAWL_CONFIG.maxDepth;
    const { normalizedDomain, normalizedUrl } = normalizeWebsiteUrl(input.requestedUrl);
    const initialUrl = await validatePublicCrawlUrl(normalizedUrl);

    let browser: Browser | null = null;
    let context: BrowserContext | null = null;

    const allInternalLinks = new Set<string>();
    const allExternalLinks = new Set<string>();
    const discoveredLinks: DiscoveredLink[] = [];
    const pageResults: CrawlPageResult[] = [];
    const emails = new Set<string>();
    const phones = new Set<string>();
    const socialLinks = new Set<string>();

    let homepageTitle = "";
    let metaDescription = "";
    let language = "";
    let finalUrl = initialUrl.toString();
    let homepageUrl = initialUrl.toString();

    const queue: Array<{ url: string; depth: number }> = [
        { url: initialUrl.toString(), depth: 0 },
    ];
    const visited = new Set<string>();

    try {
        browser = await launchChromium();
        context = await browser.newContext({
            userAgent: CRAWL_CONFIG.desktopUserAgent,
            viewport: CRAWL_CONFIG.desktopViewport,
            ignoreHTTPSErrors: false,
            serviceWorkers: "block",
        });

        await installPlaywrightNetworkGuard(context);

        while (queue.length > 0 && pageResults.length < maxPages) {
            const current = queue.shift()!;
            if (visited.has(current.url)) {
                continue;
            }
            visited.add(current.url);

            const page = await context.newPage();
            let statusCode: number | undefined;
            let loadDurationMs = 0;
            let errorMessage: string | null = null;
            let extracted: ExtractedPage | null = null;

            try {
                const pageStartedAt = Date.now();
                statusCode = await navigateSafely(page, current.url);
                loadDurationMs = Date.now() - pageStartedAt;

                if (pageResults.length === 0) {
                    finalUrl = page.url();
                    homepageUrl = finalUrl;
                }

                const pageType = classifyPageType({
                    url: page.url(),
                    isHome: page.url() === homepageUrl || current.depth === 0,
                    title: await page.title(),
                });

                extracted = await extractPageData(page, pageType, normalizedDomain);

                if (pageType === "home" || page.url() === homepageUrl) {
                    homepageTitle = extracted.title;
                    metaDescription = extracted.metaDescription;
                    language = extracted.language;
                }

                const pageDiscovery = await discoverLinks(page, normalizedDomain);
                pageDiscovery.internal.forEach((link) => {
                    discoveredLinks.push(link);
                    allInternalLinks.add(link.url);
                });
                pageDiscovery.external.forEach((link) => allExternalLinks.add(link));

                if (current.depth < maxDepth) {
                    for (const link of pageDiscovery.internal) {
                        if (visited.has(link.url)) continue;
                        if (isBlockedCrawlPath(getUrlPath(link.url))) continue;
                        queue.push({ url: link.url, depth: current.depth + 1 });
                    }
                }

                extractEmails(extracted.visibleText, extracted.mailtoLinks).forEach((email) =>
                    emails.add(email),
                );
                extractPhoneNumbers(extracted.visibleText, extracted.telLinks).forEach((phone) =>
                    phones.add(phone),
                );
                extractSocialLinks([
                    ...extracted.internalLinks,
                    ...extracted.externalLinks,
                    extracted.visibleText,
                ]).forEach((link) => socialLinks.add(link));

                pageResults.push({
                    url: extracted.url,
                    path: extracted.path,
                    pageType: extracted.pageType,
                    title: extracted.title,
                    metaDescription: extracted.metaDescription,
                    headings: extracted.headings,
                    buttons: extracted.buttons,
                    forms: extracted.forms,
                    images: extracted.images,
                    visibleText: extracted.visibleText,
                    statusCode,
                    loadDurationMs,
                    errorMessage: null,
                });
            } catch (error) {
                const safeMessage =
                    error instanceof PublicUrlValidationError
                        ? error.message
                        : error instanceof Error
                          ? error.message.slice(0, 500)
                          : "Unable to crawl this page.";

                if (current.depth === 0) {
                    throw error;
                }

                pageResults.push({
                    url: current.url,
                    path: getUrlPath(current.url),
                    pageType: classifyPageType({ url: current.url }),
                    headings: [],
                    buttons: [],
                    forms: [],
                    images: [],
                    statusCode,
                    loadDurationMs,
                    errorMessage: safeMessage,
                });
            } finally {
                await page.close();
            }
        }
    } finally {
        if (context) await context.close();
        if (browser) await browser.close();
    }

    const paths = [
        ...discoveredLinks.map((link) => getUrlPath(link.url)),
        ...pageResults.map((result) => result.path),
    ];

    return {
        requestedUrl: input.requestedUrl,
        finalUrl,
        homepageTitle,
        metaDescription,
        language,
        pagesDiscovered: dedupeStrings([...allInternalLinks]).length,
        pagesCrawled: pageResults.filter((result) => !result.errorMessage).length,
        internalLinks: dedupeStrings([...allInternalLinks]).slice(
            0,
            CRAWL_CONFIG.maxInternalLinksStored,
        ),
        externalLinks: dedupeStrings([...allExternalLinks]).slice(
            0,
            CRAWL_CONFIG.maxExternalLinksStored,
        ),
        emailsFound: [...emails],
        phoneNumbersFound: [...phones],
        socialLinks: [...socialLinks],
        hasAboutPage: paths.some(hasAboutPath),
        hasContactPage: paths.some(hasContactPath),
        hasServicesPage: paths.some(hasServicesPath),
        hasPrivacyPolicy: paths.some(hasPrivacyPath),
        hasTerms: paths.some(hasTermsPath),
        pageResults,
        crawlDurationMs: Date.now() - startedAt,
        homepageUrl,
    };
}
