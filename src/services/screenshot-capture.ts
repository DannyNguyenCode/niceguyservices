import "server-only";

import type { Browser, BrowserContext } from "playwright-core";
import { CRAWL_CONFIG } from "@/src/lib/crawl-config";
import { launchChromium } from "@/src/lib/playwright-config";
import { validatePublicCrawlUrl } from "@/src/lib/validate-public-url";
import { installPlaywrightNetworkGuard } from "@/src/services/playwright-network-guard";
import { screenshotFilenameForTarget } from "@/src/services/screenshot-targets";

async function navigateSafely(page: import("playwright-core").Page, targetUrl: string): Promise<void> {
    await validatePublicCrawlUrl(targetUrl);
    await page.goto(targetUrl, {
        waitUntil: "domcontentloaded",
        timeout: CRAWL_CONFIG.timeoutMs,
    });
    await page.waitForTimeout(CRAWL_CONFIG.contentSettleMs);
    await validatePublicCrawlUrl(page.url());
}

export type CapturedPageScreenshots = {
    slug: string;
    url: string;
    shots: Array<{
        filename: string;
        type: "desktop-viewport" | "desktop-full" | "mobile-viewport" | "mobile-full";
        buffer: Buffer;
    }>;
};

export async function capturePageScreenshots(input: {
    url: string;
    slug: string;
    includeFullPage?: boolean;
}): Promise<CapturedPageScreenshots> {
    const validatedUrl = await validatePublicCrawlUrl(input.url);
    let browser: Browser | null = null;
    let desktopContext: BrowserContext | null = null;
    let mobileContext: BrowserContext | null = null;

    const shots: CapturedPageScreenshots["shots"] = [];

    try {
        browser = await launchChromium();

        desktopContext = await browser.newContext({
            userAgent: CRAWL_CONFIG.desktopUserAgent,
            viewport: CRAWL_CONFIG.desktopViewport,
            ignoreHTTPSErrors: false,
            serviceWorkers: "block",
        });
        await installPlaywrightNetworkGuard(desktopContext);
        const desktopPage = await desktopContext.newPage();
        desktopPage.setDefaultTimeout(CRAWL_CONFIG.timeoutMs);
        await navigateSafely(desktopPage, validatedUrl.toString());
        shots.push({
            filename: screenshotFilenameForTarget(input.slug, "desktop", "viewport"),
            type: "desktop-viewport",
            buffer: Buffer.from(
                await desktopPage.screenshot({ type: "png", fullPage: false }),
            ),
        });
        if (input.includeFullPage) {
            shots.push({
                filename: screenshotFilenameForTarget(input.slug, "desktop", "full"),
                type: "desktop-full",
                buffer: Buffer.from(
                    await desktopPage.screenshot({ type: "png", fullPage: true }),
                ),
            });
        }
        await desktopPage.close();

        mobileContext = await browser.newContext({
            userAgent: CRAWL_CONFIG.mobileUserAgent,
            viewport: CRAWL_CONFIG.mobileViewport,
            isMobile: true,
            hasTouch: true,
            ignoreHTTPSErrors: false,
            serviceWorkers: "block",
        });
        await installPlaywrightNetworkGuard(mobileContext);
        const mobilePage = await mobileContext.newPage();
        mobilePage.setDefaultTimeout(CRAWL_CONFIG.timeoutMs);
        await navigateSafely(mobilePage, validatedUrl.toString());
        shots.push({
            filename: screenshotFilenameForTarget(input.slug, "mobile", "viewport"),
            type: "mobile-viewport",
            buffer: Buffer.from(
                await mobilePage.screenshot({ type: "png", fullPage: false }),
            ),
        });
        if (input.includeFullPage) {
            shots.push({
                filename: screenshotFilenameForTarget(input.slug, "mobile", "full"),
                type: "mobile-full",
                buffer: Buffer.from(
                    await mobilePage.screenshot({ type: "png", fullPage: true }),
                ),
            });
        }
        await mobilePage.close();

        return { slug: input.slug, url: validatedUrl.toString(), shots };
    } finally {
        if (desktopContext) await desktopContext.close();
        if (mobileContext) await mobileContext.close();
        if (browser) await browser.close();
    }
}

export async function captureHomepageScreenshots(input: {
    homepageUrl: string;
}): Promise<
    Record<
        "desktop-viewport" | "desktop-full" | "mobile-viewport" | "mobile-full",
        Buffer
    >
> {
    const captured = await capturePageScreenshots({
        url: input.homepageUrl,
        slug: "home",
        includeFullPage: true,
    });

    const result = {
        "desktop-viewport": Buffer.alloc(0),
        "desktop-full": Buffer.alloc(0),
        "mobile-viewport": Buffer.alloc(0),
        "mobile-full": Buffer.alloc(0),
    };

    for (const shot of captured.shots) {
        result[shot.type] = Buffer.from(shot.buffer);
    }

    return result;
}
