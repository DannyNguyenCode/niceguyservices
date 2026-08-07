import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableWebsite } from "@/src/data/websites";
import type {
    NiceGuyScoringInput,
    NormalizedPageResult,
    NormalizedPageSpeedEvidence,
} from "@/src/services/niceguy-scoring/types";

function normalizePageResult(page: SerializableCrawl["pageResults"][number]): NormalizedPageResult {
    return {
        url: page.url,
        path: page.path,
        pageType: page.pageType,
        title: page.title ?? null,
        metaDescription: page.metaDescription ?? null,
        headings: page.headings ?? [],
        buttons: page.buttons ?? [],
        forms: page.forms ?? [],
        images: page.images ?? [],
        visibleText: page.visibleText ?? null,
        statusCode: page.statusCode ?? null,
        loadDurationMs: page.loadDurationMs ?? null,
        errorMessage: page.errorMessage ?? null,
    };
}

function normalizePageSpeed(
    metric: SerializableGoogleMetric | null | undefined,
): NormalizedPageSpeedEvidence | null {
    if (!metric || metric.status !== "complete") return null;

    return {
        strategy: metric.strategy,
        status: metric.status,
        scores: metric.scores,
        labMetrics: metric.labMetrics,
        fieldData: metric.fieldData,
        coreWebVitals: metric.coreWebVitals,
    };
}

export function normalizeNiceGuyScoringInput(input: {
    website: SerializableWebsite;
    crawl: SerializableCrawl;
    pagespeed: {
        mobile: SerializableGoogleMetric | null;
        desktop: SerializableGoogleMetric | null;
    };
}): NiceGuyScoringInput {
    return {
        website: {
            id: input.website.id,
            businessName: input.website.businessName || null,
            industry: input.website.industry || null,
            location: input.website.location || null,
            originalUrl: input.website.originalUrl,
        },
        crawl: {
            id: input.crawl.id,
            requestedUrl: input.crawl.requestedUrl,
            finalUrl: input.crawl.finalUrl || null,
            homepageTitle: input.crawl.homepageTitle || null,
            metaDescription: input.crawl.metaDescription || null,
            pagesDiscovered: input.crawl.pagesDiscovered,
            pagesCrawled: input.crawl.pagesCrawled,
            internalLinks: input.crawl.internalLinks,
            externalLinks: input.crawl.externalLinks,
            emailsFound: input.crawl.emailsFound,
            phoneNumbersFound: input.crawl.phoneNumbersFound,
            socialLinks: input.crawl.socialLinks,
            hasAboutPage: input.crawl.hasAboutPage,
            hasContactPage: input.crawl.hasContactPage,
            hasServicesPage: input.crawl.hasServicesPage,
            hasPrivacyPolicy: input.crawl.hasPrivacyPolicy,
            hasTerms: input.crawl.hasTerms,
            pageResults: input.crawl.pageResults.map(normalizePageResult),
        },
        pagespeed: {
            mobile: normalizePageSpeed(input.pagespeed.mobile),
            desktop: normalizePageSpeed(input.pagespeed.desktop),
        },
    };
}

export function getCompleteGoogleMetricsForCrawl(
    metrics: SerializableGoogleMetric[],
): { mobile: SerializableGoogleMetric | null; desktop: SerializableGoogleMetric | null } {
    const mobile =
        metrics.find((metric) => metric.strategy === "mobile" && metric.status === "complete") ??
        null;
    const desktop =
        metrics.find((metric) => metric.strategy === "desktop" && metric.status === "complete") ??
        null;
    return { mobile, desktop };
}

export function hasAtLeastOnePageSpeedResult(input: {
    mobile: SerializableGoogleMetric | null;
    desktop: SerializableGoogleMetric | null;
}): boolean {
    return Boolean(
        (input.mobile && input.mobile.status === "complete") ||
            (input.desktop && input.desktop.status === "complete"),
    );
}
