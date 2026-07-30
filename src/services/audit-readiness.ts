import type { SerializableAiSummary } from "@/src/data/ai-summaries";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";
import type { AuditReadiness } from "@/src/types/audit-dashboard";

function homepageSucceeded(crawl: SerializableCrawl | null): boolean {
    if (!crawl || crawl.status !== "complete") return false;
    const homepage = crawl.pageResults.find((page) => page.pageType === "home");
    return Boolean(homepage && (homepage.statusCode ?? 200) < 400 && !homepage.errorMessage);
}

function pageSpeedReady(
    mobile: SerializableGoogleMetric | null,
    desktop: SerializableGoogleMetric | null,
): boolean {
    return mobile?.status === "complete" || desktop?.status === "complete";
}

function deriveScreenshotStatus(screenshots: SerializableScreenshot[]): {
    status: "not-started" | "complete" | "partial" | "failed";
    completeCount: number;
    failedCount: number;
} {
    if (screenshots.length === 0) {
        return { status: "not-started", completeCount: 0, failedCount: 0 };
    }
    const completeCount = screenshots.filter((shot) => shot.status === "complete").length;
    const failedCount = screenshots.filter((shot) => shot.status === "failed").length;
    if (completeCount === 0 && failedCount > 0) {
        return { status: "failed", completeCount, failedCount };
    }
    if (completeCount > 0 && failedCount > 0) {
        return { status: "partial", completeCount, failedCount };
    }
    if (completeCount > 0) {
        return { status: "complete", completeCount, failedCount };
    }
    return { status: "not-started", completeCount, failedCount };
}

export function calculateAuditReadiness(input: {
    website: SerializableWebsite;
    latestCrawl: SerializableCrawl | null;
    screenshots: SerializableScreenshot[];
    pageSpeed: {
        mobile: SerializableGoogleMetric | null;
        desktop: SerializableGoogleMetric | null;
    };
    niceGuy: SerializableNiceGuyMetric | null;
    aiSummary: SerializableAiSummary | null;
    heroSuggestionsComplete: boolean;
    hasActiveCrawl: boolean;
    hasActivePageSpeed: boolean;
    hasActiveNiceGuy: boolean;
    hasActiveAiAnalysis: boolean;
}): AuditReadiness {
    const blockers: AuditReadiness["blockers"] = [];
    const warnings: string[] = [];

    const crawlComplete = input.latestCrawl?.status === "complete";
    const homepageOk = homepageSucceeded(input.latestCrawl);
    const pagespeedOk = pageSpeedReady(input.pageSpeed.mobile, input.pageSpeed.desktop);
    const niceGuyComplete = input.niceGuy?.status === "complete";
    const niceGuyMatchesCrawl =
        niceGuyComplete && input.niceGuy?.crawlId === input.latestCrawl?.id;
    const aiSummaryComplete = input.aiSummary?.status === "complete";
    const aiMatchesNiceGuy =
        input.aiSummary?.niceGuyMetricId === input.niceGuy?.id &&
        input.aiSummary?.crawlId === input.latestCrawl?.id;

    const screenshotDerived = deriveScreenshotStatus(input.screenshots);
    const screenshotsMatchCrawl =
        input.screenshots.length === 0 ||
        input.screenshots.every((shot) => shot.crawlId === input.latestCrawl?.id);

    const pageSpeedMatchesCrawl =
        (!input.pageSpeed.mobile || input.pageSpeed.mobile.crawlId === input.latestCrawl?.id) &&
        (!input.pageSpeed.desktop || input.pageSpeed.desktop.crawlId === input.latestCrawl?.id);

    const screenshotsStale = crawlComplete && !screenshotsMatchCrawl;
    const pageSpeedStale = crawlComplete && !pageSpeedMatchesCrawl;
    const niceGuyStale =
        niceGuyComplete &&
        (!niceGuyMatchesCrawl || (pagespeedOk && !pageSpeedMatchesCrawl));
    const aiStale = Boolean(input.aiSummary) && !aiMatchesNiceGuy;

    if (screenshotsStale) {
        warnings.push("Screenshots are older than the latest crawl.");
    }
    if (pageSpeedStale) {
        warnings.push(
            "The latest PageSpeed or Nice Guy result belongs to an earlier crawl. Rerun the affected stage to refresh the audit.",
        );
    }
    if (niceGuyStale) {
        warnings.push("Nice Guy Metrics were calculated before the latest PageSpeed run.");
    }
    if (aiStale) {
        warnings.push("AI analysis is based on an older Nice Guy score.");
    }

    const canRunCrawl =
        !input.hasActiveCrawl &&
        input.website.crawlStatus !== "queued" &&
        input.website.crawlStatus !== "processing";

    const canRunScreenshots =
        crawlComplete &&
        homepageOk &&
        !input.hasActiveCrawl &&
        input.website.crawlStatus !== "processing";

    const canRunPageSpeed =
        crawlComplete &&
        homepageOk &&
        !input.hasActiveCrawl &&
        !input.hasActivePageSpeed &&
        input.website.pageSpeedStatus !== "queued" &&
        input.website.pageSpeedStatus !== "processing";

    const canRunNiceGuy =
        crawlComplete &&
        homepageOk &&
        pagespeedOk &&
        pageSpeedMatchesCrawl &&
        !input.hasActiveNiceGuy &&
        input.website.niceGuyStatus !== "queued" &&
        input.website.niceGuyStatus !== "processing";

    const canRunAiAnalysis =
        crawlComplete &&
        homepageOk &&
        pagespeedOk &&
        niceGuyComplete &&
        niceGuyMatchesCrawl &&
        !input.hasActiveAiAnalysis &&
        input.website.aiAnalysisStatus !== "queued" &&
        input.website.aiAnalysisStatus !== "processing";

    if (!crawlComplete) {
        blockers.push({
            stage: "crawl",
            code: "CRAWL_REQUIRED",
            message: "A completed crawl is required before later audit stages.",
        });
    } else if (!homepageOk) {
        blockers.push({
            stage: "crawl",
            code: "CRAWL_HOMEPAGE_REQUIRED",
            message: "PageSpeed cannot run until the homepage crawl completes successfully.",
        });
    }

    if (crawlComplete && homepageOk && !pagespeedOk) {
        blockers.push({
            stage: "pagespeed",
            code: "PAGESPEED_REQUIRED",
            message: "At least one completed PageSpeed strategy is required before Nice Guy Metrics.",
        });
    }

    if (pagespeedOk && !niceGuyComplete) {
        blockers.push({
            stage: "niceguy",
            code: "NICEGUY_REQUIRED",
            message: "Complete Nice Guy Metrics before generating AI analysis.",
        });
    } else if (niceGuyComplete && !niceGuyMatchesCrawl) {
        blockers.push({
            stage: "niceguy",
            code: "NICEGUY_STALE",
            message:
                "Nice Guy Metrics must be run on the latest crawl before generating AI analysis.",
        });
    }

    let nextRecommendedStage: AuditReadiness["nextRecommendedStage"] = "crawl";
    if (!crawlComplete || !homepageOk) {
        nextRecommendedStage = "crawl";
    } else if (screenshotDerived.status === "not-started") {
        nextRecommendedStage = "screenshots";
    } else if (!pagespeedOk || pageSpeedStale) {
        nextRecommendedStage = "pagespeed";
    } else if (!niceGuyComplete || niceGuyStale) {
        nextRecommendedStage = "niceguy";
    } else if (!aiSummaryComplete || aiStale) {
        nextRecommendedStage = "ai-analysis";
    } else {
        nextRecommendedStage = "complete";
    }

    const isAuditReadyForReport = Boolean(
        crawlComplete &&
            homepageOk &&
            (screenshotDerived.status === "complete" || screenshotDerived.status === "partial") &&
            pagespeedOk &&
            niceGuyComplete &&
            niceGuyMatchesCrawl &&
            (aiSummaryComplete || input.website.aiAnalysisStatus === "partial") &&
            aiMatchesNiceGuy,
    );

    if (
        input.aiSummary?.status === "complete" &&
        input.website.aiAnalysisStatus !== "failed"
    ) {
        warnings.push("This AI analysis was generated without visual screenshot analysis.");
    }

    const overallConfidence = input.niceGuy
        ? Object.values(input.niceGuy.categories).reduce(
              (sum, category) => sum + category.confidence,
              0,
          ) / 7
        : 0;
    if (overallConfidence > 0 && overallConfidence < 70) {
        warnings.push(
            "This score is based on limited evidence. Review unavailable checks before using it in a client report.",
        );
    }

    return {
        canRunCrawl,
        canRunScreenshots,
        canRunPageSpeed,
        canRunNiceGuy,
        canRunAiAnalysis,
        nextRecommendedStage,
        blockers,
        isAuditReadyForReport,
        stages: {
            crawl: { canRun: canRunCrawl, isStale: false },
            screenshots: {
                canRun: canRunScreenshots,
                isStale: screenshotsStale,
                staleReason: screenshotsStale
                    ? "Screenshots are older than the latest crawl."
                    : null,
            },
            pageSpeed: {
                canRun: canRunPageSpeed,
                isStale: pageSpeedStale,
                staleReason: pageSpeedStale
                    ? "PageSpeed results belong to an earlier crawl."
                    : null,
            },
            niceGuy: {
                canRun: canRunNiceGuy,
                isStale: niceGuyStale,
                staleReason: niceGuyStale
                    ? "Nice Guy Metrics were calculated before the latest crawl or PageSpeed run."
                    : null,
            },
            aiAnalysis: {
                canRun: canRunAiAnalysis,
                isStale: aiStale,
                staleReason: aiStale
                    ? "AI analysis is based on an older Nice Guy score."
                    : null,
            },
        },
        warnings,
    };
}
