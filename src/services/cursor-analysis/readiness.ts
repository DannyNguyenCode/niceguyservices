import "server-only";

import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";

export type CursorAnalysisReadiness = {
    ready: boolean;
    missing: string[];
};

function hasDesktopScreenshot(screenshots: SerializableScreenshot[]): boolean {
    return screenshots.some(
        (shot) =>
            shot.status === "complete" &&
            (shot.type === "desktop-viewport" || shot.type === "desktop-full") &&
            Boolean(shot.secureUrl || shot.publicUrl),
    );
}

function hasMobileScreenshot(screenshots: SerializableScreenshot[]): boolean {
    return screenshots.some(
        (shot) =>
            shot.status === "complete" &&
            (shot.type === "mobile-viewport" || shot.type === "mobile-full") &&
            Boolean(shot.secureUrl || shot.publicUrl),
    );
}

function hasExtractedContent(crawl: SerializableCrawl | null): boolean {
    if (!crawl || crawl.status !== "complete") return false;
    const homepage = crawl.pageResults.find((page) => page.pageType === "home");
    if (!homepage || (homepage.statusCode ?? 200) >= 400 || homepage.errorMessage) {
        return false;
    }
    return Boolean(
        homepage.title?.trim() ||
            homepage.metaDescription?.trim() ||
            homepage.visibleText?.trim() ||
            (homepage.headings?.length ?? 0) > 0 ||
            crawl.homepageTitle?.trim() ||
            crawl.metaDescription?.trim(),
    );
}

export function calculateCursorAnalysisReadiness(input: {
    auditId: string | null;
    website: SerializableWebsite;
    crawl: SerializableCrawl | null;
    screenshots: SerializableScreenshot[];
    pageSpeed: {
        mobile: SerializableGoogleMetric | null;
        desktop: SerializableGoogleMetric | null;
    };
    niceGuy: SerializableNiceGuyMetric | null;
}): CursorAnalysisReadiness {
    const missing: string[] = [];

    if (!input.auditId) {
        missing.push("auditId");
    }

    if (!input.crawl || input.crawl.status !== "complete") {
        missing.push("crawl");
    }

    if (!hasExtractedContent(input.crawl)) {
        missing.push("crawl.content");
    }

    if (!hasDesktopScreenshot(input.screenshots)) {
        missing.push("screenshots.desktop");
    }

    if (!hasMobileScreenshot(input.screenshots)) {
        missing.push("screenshots.mobile");
    }

    if (input.pageSpeed.mobile?.status !== "complete") {
        missing.push("googleMetrics.mobile");
    }

    if (input.pageSpeed.desktop?.status !== "complete") {
        missing.push("googleMetrics.desktop");
    }

    if (input.niceGuy?.status !== "complete") {
        missing.push("niceGuyMetrics");
    }

    const crawlId = input.crawl?.id;
    if (crawlId) {
        if (input.screenshots.some((shot) => shot.crawlId !== crawlId)) {
            missing.push("screenshots.crawlMatch");
        }
        if (input.pageSpeed.mobile && input.pageSpeed.mobile.crawlId !== crawlId) {
            missing.push("googleMetrics.mobile.crawlMatch");
        }
        if (input.pageSpeed.desktop && input.pageSpeed.desktop.crawlId !== crawlId) {
            missing.push("googleMetrics.desktop.crawlMatch");
        }
        if (input.niceGuy && input.niceGuy.crawlId !== crawlId) {
            missing.push("niceGuyMetrics.crawlMatch");
        }
    }

    const invalidScreenshotUrls = input.screenshots.filter((shot) => {
        const url = shot.secureUrl || shot.publicUrl;
        if (!url) return true;
        try {
            const parsed = new URL(url);
            return parsed.protocol !== "https:";
        } catch {
            return true;
        }
    });
    if (invalidScreenshotUrls.length > 0) {
        missing.push("screenshots.url");
    }

    return {
        ready: missing.length === 0,
        missing,
    };
}
