import "server-only";

import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";

export type AnalysisReadinessItem = {
    code: string;
    message: string;
    field?: string;
};

export type AnalysisReadiness = {
    ready: boolean;
    blockers: AnalysisReadinessItem[];
    warnings: AnalysisReadinessItem[];
};

/** @deprecated Use AnalysisReadiness.blockers codes instead */
export type CursorAnalysisReadiness = AnalysisReadiness & {
    missing: string[];
};

function blocker(code: string, message: string, field?: string): AnalysisReadinessItem {
    return { code, message, field };
}

function warning(code: string, message: string, field?: string): AnalysisReadinessItem {
    return { code, message, field };
}

function findScreenshot(
    screenshots: SerializableScreenshot[],
    device: "desktop" | "mobile",
): SerializableScreenshot | null {
    const prefix = device === "desktop" ? "desktop" : "mobile";
    return (
        screenshots.find(
            (shot) =>
                shot.status === "complete" &&
                shot.type.startsWith(prefix) &&
                Boolean(shot.secureUrl || shot.publicUrl),
        ) ?? null
    );
}

function isHttpsUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    try {
        return new URL(url).protocol === "https:";
    } catch {
        return false;
    }
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

function validateNiceGuyContract(metric: SerializableNiceGuyMetric | null): AnalysisReadinessItem[] {
    const blockers: AnalysisReadinessItem[] = [];
    if (!metric || metric.status !== "complete") {
        blockers.push(
            blocker("NICEGUY_METRICS_MISSING", "Nice Guy Metrics v2 result is required.", "niceGuyMetrics"),
        );
        return blockers;
    }

    if (!metric.scoringVersion) {
        blockers.push(
            blocker(
                "NICEGUY_SCORING_VERSION_MISSING",
                "Nice Guy Metrics scoringVersion is required.",
                "niceGuyMetrics.scoringVersion",
            ),
        );
    }

    if (metric.overallScore == null || Number.isNaN(metric.overallScore)) {
        blockers.push(
            blocker(
                "NICEGUY_OVERALL_SCORE_MISSING",
                "Nice Guy Metrics overallScore is required.",
                "niceGuyMetrics.overallScore",
            ),
        );
    }

    if (!metric.categories || Object.keys(metric.categories).length === 0) {
        blockers.push(
            blocker(
                "NICEGUY_CATEGORIES_MISSING",
                "Nice Guy Metrics categories are required.",
                "niceGuyMetrics.categories",
            ),
        );
    }

    if (!metric.completeness) {
        blockers.push(
            blocker(
                "NICEGUY_COMPLETENESS_MISSING",
                "Nice Guy Metrics completeness metadata is required.",
                "niceGuyMetrics.completeness",
            ),
        );
    }

    if (!metric.methodology) {
        blockers.push(
            blocker(
                "NICEGUY_METHODOLOGY_MISSING",
                "Nice Guy Metrics methodology metadata is required.",
                "niceGuyMetrics.methodology",
            ),
        );
    }

    return blockers;
}

export function calculateCursorAnalysisReadiness(input: {
    auditId: string | null;
    auditedUrl?: string | null;
    website: SerializableWebsite;
    crawl: SerializableCrawl | null;
    screenshots: SerializableScreenshot[];
    pageSpeed: {
        mobile: SerializableGoogleMetric | null;
        desktop: SerializableGoogleMetric | null;
    };
    niceGuy: SerializableNiceGuyMetric | null;
}): AnalysisReadiness {
    const blockers: AnalysisReadinessItem[] = [];
    const warnings: AnalysisReadinessItem[] = [];

    if (!input.auditId) {
        blockers.push(blocker("AUDIT_RUN_MISSING", "Audit run is required.", "auditId"));
    }

    const auditedUrl = input.auditedUrl?.trim() || input.website.originalUrl?.trim();
    if (!auditedUrl) {
        blockers.push(blocker("AUDITED_URL_MISSING", "Audited URL is required.", "auditedUrl"));
    } else {
        try {
            new URL(auditedUrl);
        } catch {
            blockers.push(blocker("AUDITED_URL_INVALID", "Audited URL is not valid.", "auditedUrl"));
        }
    }

    if (!input.crawl || input.crawl.status !== "complete") {
        blockers.push(
            blocker("CRAWL_INCOMPLETE", "Completed crawl data is required.", "crawl"),
        );
    } else if (!hasExtractedContent(input.crawl)) {
        blockers.push(
            blocker("CRAWL_CONTENT_MISSING", "Crawl content extraction is required.", "crawl.content"),
        );
    }

    const desktopShot = findScreenshot(input.screenshots, "desktop");
    if (!desktopShot) {
        blockers.push(
            blocker("DESKTOP_SCREENSHOT_MISSING", "Desktop screenshot is required.", "screenshots.desktop"),
        );
    } else if (!isHttpsUrl(desktopShot.secureUrl || desktopShot.publicUrl)) {
        blockers.push(
            blocker(
                "DESKTOP_SCREENSHOT_URL_INVALID",
                "Desktop screenshot must use an HTTPS URL.",
                "screenshots.desktop.url",
            ),
        );
    }

    const mobileShot = findScreenshot(input.screenshots, "mobile");
    if (!mobileShot) {
        blockers.push(
            blocker("MOBILE_SCREENSHOT_MISSING", "Mobile screenshot is required.", "screenshots.mobile"),
        );
    } else if (!isHttpsUrl(mobileShot.secureUrl || mobileShot.publicUrl)) {
        blockers.push(
            blocker(
                "MOBILE_SCREENSHOT_URL_INVALID",
                "Mobile screenshot must use an HTTPS URL.",
                "screenshots.mobile.url",
            ),
        );
    }

    if (input.pageSpeed.mobile?.status !== "complete") {
        blockers.push(
            blocker("PAGESPEED_MOBILE_MISSING", "PageSpeed mobile data is required.", "pageSpeed.mobile"),
        );
    }

    if (input.pageSpeed.desktop?.status !== "complete") {
        blockers.push(
            blocker("PAGESPEED_DESKTOP_MISSING", "PageSpeed desktop data is required.", "pageSpeed.desktop"),
        );
    }

    blockers.push(...validateNiceGuyContract(input.niceGuy));

    const crawlId = input.crawl?.id;
    if (crawlId) {
        const mismatchedScreenshots = input.screenshots.filter(
            (shot) => shot.crawlId && shot.crawlId !== crawlId,
        );
        if (mismatchedScreenshots.length > 0) {
            blockers.push(
                blocker(
                    "SCREENSHOT_CRAWL_MISMATCH",
                    "Screenshots must belong to the same crawl as the audit run.",
                    "screenshots.crawlId",
                ),
            );
        }

        if (input.pageSpeed.mobile?.crawlId && input.pageSpeed.mobile.crawlId !== crawlId) {
            blockers.push(
                blocker(
                    "PAGESPEED_MOBILE_CRAWL_MISMATCH",
                    "PageSpeed mobile data must match the audit crawl.",
                    "pageSpeed.mobile.crawlId",
                ),
            );
        }

        if (input.pageSpeed.desktop?.crawlId && input.pageSpeed.desktop.crawlId !== crawlId) {
            blockers.push(
                blocker(
                    "PAGESPEED_DESKTOP_CRAWL_MISMATCH",
                    "PageSpeed desktop data must match the audit crawl.",
                    "pageSpeed.desktop.crawlId",
                ),
            );
        }

        if (input.niceGuy?.crawlId && input.niceGuy.crawlId !== crawlId) {
            blockers.push(
                blocker(
                    "NICEGUY_CRAWL_MISMATCH",
                    "Nice Guy Metrics must match the audit crawl.",
                    "niceGuyMetrics.crawlId",
                ),
            );
        }
    }

    if (input.niceGuy?.completeness && !input.niceGuy.completeness.isComplete) {
        warnings.push(
            warning(
                "NICEGUY_PRELIMINARY",
                "Nice Guy Metrics are preliminary; evidence coverage may be incomplete.",
                "niceGuyMetrics.completeness",
            ),
        );
    }

    return {
        ready: blockers.length === 0,
        blockers,
        warnings,
    };
}

/** Backward-compatible helper for components expecting `missing` string codes. */
export function toLegacyReadinessMissing(readiness: AnalysisReadiness): string[] {
    return readiness.blockers.map((item) => item.field ?? item.code);
}

export function withLegacyReadinessFields(readiness: AnalysisReadiness): CursorAnalysisReadiness {
    return {
        ...readiness,
        missing: toLegacyReadinessMissing(readiness),
    };
}
