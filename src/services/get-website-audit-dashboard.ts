import "server-only";

import { getRecentActivityForWebsite } from "@/src/data/activity-logs";
import { getActiveAuditJobForWebsite } from "@/src/data/audit-jobs";
import { getOpenAuditRunForWebsite, getLatestCompletedAuditRunForWebsite } from "@/src/data/audit-runs";
import { getAiMetadataForRelatedRecord } from "@/src/data/ai-metadata";
import {
    getAiSummariesForWebsite,
    getLatestAiSummaryForWebsite,
    hasActiveAiAnalysis,
} from "@/src/data/ai-summaries";
import {
    getCrawlsForWebsite,
    getLatestCrawlForWebsite,
    hasActiveCrawlForWebsite,
} from "@/src/data/crawls";
import { getHeroSuggestionsForSummary } from "@/src/data/hero-suggestions";
import {
    getGoogleMetricsForWebsite,
    getLatestGoogleMetricsForWebsite,
    hasActivePageSpeedRun,
} from "@/src/data/google-metrics";
import {
    getLatestNiceGuyMetricForWebsite,
    getNiceGuyMetricsForWebsite,
    hasActiveNiceGuyRun,
} from "@/src/data/niceguy-metrics";
import { getLatestScreenshotsForWebsite } from "@/src/data/screenshots";
import { getWebsiteById } from "@/src/data/websites";
import { formatAuditStageStatus } from "@/src/lib/audit-dashboard-labels";
import { calculateAuditReadiness } from "@/src/services/audit-readiness";
import { calculateCursorAnalysisReadiness } from "@/src/services/cursor-analysis/readiness";
import { isAnalysisProviderEnabled } from "@/src/services/cursor-analysis/config";
import type {
    AuditHistoryItem,
    AuditRelationWarning,
    AuditStageStatus,
    AuditStageStatusValue,
    WebsiteAuditDashboardData,
} from "@/src/types/audit-dashboard";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";
import { loadAuditRunResources } from "@/src/services/audit-history/load-audit-run-resources";
import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";

const HISTORY_LIMIT = 10;
const ACTIVITY_LIMIT = 50;

export type WebsiteAuditDashboardOptions = {
    auditRunId?: string | null;
    includeHistory?: boolean;
    includeActivity?: boolean;
};

async function resolveSelectedAuditRunId(input: {
    websiteId: string;
    requestedAuditRunId?: string | null;
    activeJobAuditRunId?: string | null;
}): Promise<string | null> {
    if (input.requestedAuditRunId?.trim()) {
        return input.requestedAuditRunId.trim();
    }
    if (input.activeJobAuditRunId) {
        return input.activeJobAuditRunId;
    }
    const openAuditRun = await getOpenAuditRunForWebsite(input.websiteId);
    if (openAuditRun) {
        return openAuditRun.id;
    }
    const latestCompleted = await getLatestCompletedAuditRunForWebsite(input.websiteId);
    return latestCompleted?.id ?? null;
}

function mapWebsiteStatus(
    status: string,
    overrides?: Partial<AuditStageStatus>,
): AuditStageStatus {
    const value = status as AuditStageStatusValue;
    return {
        status: value,
        label: formatAuditStageStatus(value),
        description: null,
        startedAt: null,
        completedAt: null,
        latestRunAt: null,
        errorCode: null,
        errorMessage: null,
        ...overrides,
    };
}

function deriveScreenshotStage(
    screenshots: SerializableScreenshot[],
    crawl: SerializableCrawl | null,
): AuditStageStatus {
    if (!crawl || crawl.status !== "complete") {
        return mapWebsiteStatus("unavailable", {
            description: "Screenshots require a completed crawl.",
        });
    }

    if (screenshots.length === 0) {
        return mapWebsiteStatus("not-started", {
            description: "No screenshots captured for the current crawl.",
        });
    }

    const complete = screenshots.filter((shot) => shot.status === "complete").length;
    const failed = screenshots.filter((shot) => shot.status === "failed").length;
    const latest = screenshots[0];

    if (complete === 0 && failed > 0) {
        return mapWebsiteStatus("failed", {
            completedAt: latest?.updatedAt ?? null,
            errorMessage: "All screenshot captures failed.",
        });
    }

    if (failed > 0) {
        return mapWebsiteStatus("partial", {
            completedAt: latest?.generatedAt ?? latest?.updatedAt ?? null,
            description: `${complete} captured, ${failed} failed.`,
        });
    }

    return mapWebsiteStatus("complete", {
        completedAt: latest?.generatedAt ?? latest?.updatedAt ?? null,
        description: `${complete} screenshots captured.`,
    });
}

function buildCrawlStage(
    website: SerializableWebsite,
    crawl: SerializableCrawl | null,
): AuditStageStatus {
    return mapWebsiteStatus(website.crawlStatus, {
        startedAt: crawl?.startedAt ?? null,
        completedAt: crawl?.completedAt ?? null,
        latestRunAt: crawl?.completedAt ?? crawl?.startedAt ?? null,
        errorMessage: crawl?.errorMessage ?? null,
    });
}

function buildPageSpeedStage(
    website: SerializableWebsite,
    mobile: SerializableGoogleMetric | null,
    desktop: SerializableGoogleMetric | null,
): AuditStageStatus {
    const mobileComplete = mobile?.status === "complete";
    const desktopComplete = desktop?.status === "complete";
    const mobileFailed = mobile?.status === "failed";
    const desktopFailed = desktop?.status === "failed";

    let status = website.pageSpeedStatus as AuditStageStatusValue;
    if (mobileComplete && desktopComplete) status = "complete";
    else if ((mobileComplete && desktopFailed) || (desktopComplete && mobileFailed)) {
        status = "partial";
    } else if (mobileFailed && desktopFailed) status = "failed";

    return mapWebsiteStatus(status, {
        latestRunAt: website.latestPageSpeedRunAt,
        completedAt: website.latestPageSpeedRunAt,
        errorMessage: mobile?.errorMessage ?? desktop?.errorMessage ?? null,
        errorCode: mobile?.errorCode ?? desktop?.errorCode ?? null,
        description:
            status === "partial"
                ? `Mobile: ${mobileComplete ? "Complete" : "Failed"} · Desktop: ${desktopComplete ? "Complete" : "Failed"}`
                : null,
    });
}

function buildRelationWarnings(input: {
    crawl: SerializableCrawl | null;
    screenshots: SerializableScreenshot[];
    mobile: SerializableGoogleMetric | null;
    desktop: SerializableGoogleMetric | null;
    niceGuy: WebsiteAuditDashboardData["latest"]["niceGuy"];
    aiSummary: WebsiteAuditDashboardData["latest"]["aiSummary"];
}): AuditRelationWarning[] {
    const warnings: AuditRelationWarning[] = [];
    const crawlId = input.crawl?.id;
    if (!crawlId) return warnings;

    if (
        input.screenshots.length > 0 &&
        input.screenshots.some((shot) => shot.crawlId !== crawlId)
    ) {
        warnings.push({
            code: "SCREENSHOTS_MISMATCH",
            message:
                "The latest screenshots belong to an earlier crawl. Recapture screenshots to refresh the audit.",
        });
    }

    if (
        (input.mobile && input.mobile.crawlId !== crawlId) ||
        (input.desktop && input.desktop.crawlId !== crawlId)
    ) {
        warnings.push({
            code: "PAGESPEED_MISMATCH",
            message:
                "The latest PageSpeed or Nice Guy result belongs to an earlier crawl. Rerun the affected stage to refresh the audit.",
        });
    }

    if (input.niceGuy && input.niceGuy.crawlId !== crawlId) {
        warnings.push({
            code: "NICEGUY_MISMATCH",
            message:
                "The latest Nice Guy score belongs to an earlier crawl. Recalculate Nice Guy Metrics.",
        });
    }

    if (
        input.aiSummary &&
        (input.aiSummary.crawlId !== crawlId ||
            input.aiSummary.niceGuyMetricId !== input.niceGuy?.id)
    ) {
        warnings.push({
            code: "AI_MISMATCH",
            message: "AI analysis is based on an older Nice Guy score or crawl.",
        });
    }

    return warnings;
}

function toCrawlHistory(crawls: SerializableCrawl[]): AuditHistoryItem[] {
    return crawls.slice(0, HISTORY_LIMIT).map((crawl) => ({
        id: crawl.id,
        status: crawl.status,
        label: "Website crawl",
        createdAt: crawl.createdAt,
        completedAt: crawl.completedAt,
        durationMs: crawl.crawlDurationMs,
        crawlId: crawl.id,
    }));
}

export async function getWebsiteAuditDashboardHistory(websiteId: string) {
    const [crawlHistory, pageSpeedHistory, niceGuyHistory, aiHistory] = await Promise.all([
        getCrawlsForWebsite(websiteId),
        getGoogleMetricsForWebsite(websiteId, HISTORY_LIMIT),
        getNiceGuyMetricsForWebsite(websiteId, HISTORY_LIMIT),
        getAiSummariesForWebsite(websiteId, HISTORY_LIMIT),
    ]);

    return {
        crawlRuns: toCrawlHistory(crawlHistory),
        pageSpeedRuns: pageSpeedHistory,
        niceGuyRuns: niceGuyHistory,
        aiRuns: aiHistory,
    };
}

export async function getWebsiteAuditDashboard(
    websiteId: string,
    options?: WebsiteAuditDashboardOptions,
): Promise<WebsiteAuditDashboardData | null> {
    const website = await getWebsiteById(websiteId);
    if (!website || website.deletedAt) {
        return null;
    }

    const activeJob = await getActiveAuditJobForWebsite(websiteId);
    const selectedAuditRunId = await resolveSelectedAuditRunId({
        websiteId,
        requestedAuditRunId: options?.auditRunId,
        activeJobAuditRunId: activeJob?.auditRunId ?? null,
    });

    const auditRunResources = selectedAuditRunId
        ? await loadAuditRunResources({ websiteId, auditRunId: selectedAuditRunId })
        : null;

    const latestCrawl =
        auditRunResources?.crawl ?? (await getLatestCrawlForWebsite(website.id));
    const crawlId = latestCrawl?.id;

    const includeHistory = options?.includeHistory ?? false;
    const includeActivity = options?.includeActivity ?? false;

    const [
        screenshots,
        pageSpeed,
        niceGuy,
        aiSummary,
        activity,
        crawlHistory,
        pageSpeedHistory,
        niceGuyHistory,
        aiHistory,
        hasActiveCrawl,
        hasActivePageSpeed,
        hasActiveNiceGuy,
    ] = await Promise.all([
        auditRunResources
            ? Promise.resolve(auditRunResources.screenshots)
            : getLatestScreenshotsForWebsite(website.id),
        auditRunResources
            ? Promise.resolve(auditRunResources.pageSpeed)
            : getLatestGoogleMetricsForWebsite(website.id),
        auditRunResources
            ? Promise.resolve(auditRunResources.niceGuy)
            : getLatestNiceGuyMetricForWebsite(website.id),
        auditRunResources
            ? Promise.resolve(auditRunResources.aiSummary)
            : getLatestAiSummaryForWebsite(website.id),
        includeActivity
            ? getRecentActivityForWebsite({ websiteId: website.id, limit: ACTIVITY_LIMIT })
            : Promise.resolve([]),
        includeHistory ? getCrawlsForWebsite(website.id) : Promise.resolve([]),
        includeHistory
            ? getGoogleMetricsForWebsite(website.id, HISTORY_LIMIT)
            : Promise.resolve([]),
        includeHistory
            ? getNiceGuyMetricsForWebsite(website.id, HISTORY_LIMIT)
            : Promise.resolve([]),
        includeHistory
            ? getAiSummariesForWebsite(website.id, HISTORY_LIMIT)
            : Promise.resolve([]),
        hasActiveCrawlForWebsite(website.id),
        hasActivePageSpeedRun(website.id, crawlId),
        crawlId ? hasActiveNiceGuyRun(website.id, crawlId) : Promise.resolve(false),
    ]);

    const hasActiveAi =
        crawlId && niceGuy?.id
            ? await hasActiveAiAnalysis(website.id, crawlId, niceGuy.id)
            : false;

    const heroSuggestions = aiSummary
        ? auditRunResources?.heroSuggestions?.length
            ? auditRunResources.heroSuggestions
            : await getHeroSuggestionsForSummary(aiSummary.id)
        : [];

    const aiMetadata = aiSummary
        ? await getAiMetadataForRelatedRecord("ai-summary", aiSummary.id)
        : null;

    const relationWarnings = buildRelationWarnings({
        crawl: latestCrawl,
        screenshots,
        mobile: pageSpeed.mobile,
        desktop: pageSpeed.desktop,
        niceGuy,
        aiSummary,
    });

    const readiness = calculateAuditReadiness({
        website,
        latestCrawl,
        screenshots,
        pageSpeed,
        niceGuy,
        aiSummary,
        heroSuggestionsComplete: heroSuggestions.length === 3,
        hasActiveCrawl,
        hasActivePageSpeed,
        hasActiveNiceGuy,
        hasActiveAiAnalysis: hasActiveAi,
    });

    const screenshotStage = deriveScreenshotStage(screenshots, latestCrawl);
    screenshotStage.isStale = readiness.stages.screenshots.isStale;
    screenshotStage.staleReason = readiness.stages.screenshots.staleReason ?? null;

    const pageSpeedStage = buildPageSpeedStage(website, pageSpeed.mobile, pageSpeed.desktop);
    pageSpeedStage.isStale = readiness.stages.pageSpeed.isStale;
    pageSpeedStage.staleReason = readiness.stages.pageSpeed.staleReason ?? null;

    const niceGuyStage = mapWebsiteStatus(website.niceGuyStatus, {
        latestRunAt: website.latestNiceGuyRunAt,
        completedAt: niceGuy?.generatedAt ?? website.latestNiceGuyRunAt,
        errorMessage: niceGuy?.errorMessage ?? null,
        errorCode: niceGuy?.errorCode ?? null,
        isStale: readiness.stages.niceGuy.isStale,
        staleReason: readiness.stages.niceGuy.staleReason ?? null,
    });

    const aiStage = mapWebsiteStatus(website.aiAnalysisStatus, {
        latestRunAt: website.latestAiAnalysisRunAt,
        completedAt: aiSummary?.generatedAt ?? website.latestAiAnalysisRunAt,
        errorMessage: aiSummary?.errorMessage ?? null,
        errorCode: aiSummary?.errorCode ?? null,
        isStale: readiness.stages.aiAnalysis.isStale,
        staleReason: readiness.stages.aiAnalysis.staleReason ?? null,
    });

    const overallConfidence = niceGuy
        ? Math.round(
              Object.values(niceGuy.categories).reduce(
                  (sum, category) => sum + category.confidence,
                  0,
              ) / 7,
          )
        : null;

    const cursorAnalysisReadiness = calculateCursorAnalysisReadiness({
        auditId: selectedAuditRunId,
        auditedUrl: auditRunResources?.auditRun.source.websiteUrl ?? website.originalUrl,
        website,
        crawl: latestCrawl,
        screenshots,
        pageSpeed,
        niceGuy,
    });

    return {
        website,
        selectedAuditRunId,
        activeJob: activeJob as SerializableAuditJob | null,
        auditStatus: {
            crawl: buildCrawlStage(website, latestCrawl),
            screenshots: screenshotStage,
            pageSpeed: pageSpeedStage,
            niceGuy: niceGuyStage,
            aiAnalysis: aiStage,
        },
        readiness,
        relationWarnings,
        latest: {
            crawl: latestCrawl,
            screenshots,
            pageSpeed,
            niceGuy,
            aiSummary,
            heroSuggestions,
            aiMetadata: aiMetadata
                ? {
                      provider: aiMetadata.provider,
                      model: aiMetadata.model,
                      promptTokens: aiMetadata.promptTokens,
                      completionTokens: aiMetadata.completionTokens,
                      totalTokens: aiMetadata.totalTokens,
                  }
                : null,
        },
        overview: {
            pagesCrawled: latestCrawl?.pagesCrawled ?? null,
            screenshotCount:
                screenshots.length > 0
                    ? screenshots.filter((shot) => shot.status === "complete").length
                    : null,
            mobilePerformance: pageSpeed.mobile?.scores.performance ?? null,
            desktopPerformance: pageSpeed.desktop?.scores.performance ?? null,
            niceGuyScore: niceGuy?.overallScore ?? null,
            niceGuyConfidence: overallConfidence,
            aiAnalysisStatus: website.aiAnalysisStatus,
        },
        history: {
            crawlRuns: toCrawlHistory(crawlHistory),
            pageSpeedRuns: pageSpeedHistory,
            niceGuyRuns: niceGuyHistory,
            aiRuns: aiHistory,
        },
        cursorAnalysis: auditRunResources?.auditRun.analysis ?? null,
        cursorAnalysisReadiness,
        useCursorAutomation: isAnalysisProviderEnabled(),
        ...(includeActivity ? { activity } : {}),
    };
}
