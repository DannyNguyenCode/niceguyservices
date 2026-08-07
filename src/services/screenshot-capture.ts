import "server-only";

import type { Browser, BrowserContext, Page } from "playwright-core";
import { CRAWL_CONFIG } from "@/src/lib/crawl-config";
import { launchChromium } from "@/src/lib/playwright-config";
import { validatePublicCrawlUrl } from "@/src/lib/validate-public-url";
import { installPlaywrightNetworkGuard } from "@/src/services/playwright-network-guard";
import { screenshotFilenameForTarget } from "@/src/services/screenshot-targets";
import { VISUAL_STABILITY_CONFIG } from "@/src/services/visual-stability/constants";
import type { VisualStabilityResult } from "@/src/services/visual-stability/types";
import {
    prepareLazyLoadedVisualContent,
    waitForVisualStability,
} from "@/src/services/visual-stability/wait-for-visual-stability";

async function navigateForScreenshot(
    page: Page,
    targetUrl: string,
): Promise<void> {
    await validatePublicCrawlUrl(targetUrl);
    await page.goto(targetUrl, {
        waitUntil: "domcontentloaded",
        timeout: CRAWL_CONFIG.timeoutMs,
    });
    await validatePublicCrawlUrl(page.url());
}

/**
 * Legacy short settle used only when visual stability is disabled.
 * Measurement crawl path still uses CRAWL_CONFIG.contentSettleMs separately.
 */
async function legacyContentSettle(page: Page): Promise<void> {
    await page.waitForTimeout(CRAWL_CONFIG.contentSettleMs);
}

async function stabilizeForScreenshot(
    page: Page,
    contextLabel: string,
    maxWaitMs?: number,
): Promise<VisualStabilityResult> {
    if (!VISUAL_STABILITY_CONFIG.enabled) {
        await legacyContentSettle(page);
        return {
            attempted: false,
            stabilized: true,
            timedOut: false,
            reason: "disabled",
            elapsedMs: CRAWL_CONFIG.contentSettleMs,
            samples: 0,
            unfinishedFiniteAnimations: 0,
            infiniteAnimations: 0,
            fontsReady: false,
            visibleImagesPending: 0,
        };
    }

    return waitForVisualStability(page, {
        contextLabel,
        maxWaitMs,
    });
}

export type CapturedScreenshotShot = {
    filename: string;
    type: "desktop-viewport" | "desktop-full" | "mobile-viewport" | "mobile-full";
    buffer: Buffer;
    visualStability: VisualStabilityResult;
};

export type CapturedPageScreenshots = {
    slug: string;
    url: string;
    shots: CapturedScreenshotShot[];
};

async function captureViewportShots(input: {
    page: Page;
    slug: string;
    device: "desktop" | "mobile";
    includeFullPage: boolean;
    contextLabel: string;
}): Promise<CapturedScreenshotShot[]> {
    const shots: CapturedScreenshotShot[] = [];
    const stability = await stabilizeForScreenshot(input.page, `${input.contextLabel}:viewport`);

    const viewportType =
        input.device === "desktop" ? "desktop-viewport" : "mobile-viewport";
    const viewportBuffer = Buffer.from(
        await input.page.screenshot({ type: "png", fullPage: false }),
    );
    console.info("[screenshot] SCREENSHOT_CAPTURED", {
        slug: input.slug,
        type: viewportType,
        stabilized: stability.stabilized,
        reason: stability.reason,
        elapsedMs: stability.elapsedMs,
    });
    shots.push({
        filename: screenshotFilenameForTarget(input.slug, input.device, "viewport"),
        type: viewportType,
        buffer: viewportBuffer,
        visualStability: stability,
    });

    if (input.includeFullPage) {
        await prepareLazyLoadedVisualContent(input.page);
        const fullStability = await stabilizeForScreenshot(
            input.page,
            `${input.contextLabel}:full`,
            VISUAL_STABILITY_CONFIG.postLazyMaxWaitMs,
        );
        const fullType = input.device === "desktop" ? "desktop-full" : "mobile-full";
        const fullBuffer = Buffer.from(
            await input.page.screenshot({ type: "png", fullPage: true }),
        );
        console.info("[screenshot] SCREENSHOT_CAPTURED", {
            slug: input.slug,
            type: fullType,
            stabilized: fullStability.stabilized,
            reason: fullStability.reason,
            elapsedMs: fullStability.elapsedMs,
        });
        shots.push({
            filename: screenshotFilenameForTarget(input.slug, input.device, "full"),
            type: fullType,
            buffer: fullBuffer,
            visualStability: fullStability,
        });
    }

    return shots;
}

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
        await navigateForScreenshot(desktopPage, validatedUrl.toString());
        shots.push(
            ...(await captureViewportShots({
                page: desktopPage,
                slug: input.slug,
                device: "desktop",
                includeFullPage: Boolean(input.includeFullPage),
                contextLabel: `${input.slug}:desktop`,
            })),
        );
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
        await navigateForScreenshot(mobilePage, validatedUrl.toString());
        shots.push(
            ...(await captureViewportShots({
                page: mobilePage,
                slug: input.slug,
                device: "mobile",
                includeFullPage: Boolean(input.includeFullPage),
                contextLabel: `${input.slug}:mobile`,
            })),
        );
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
