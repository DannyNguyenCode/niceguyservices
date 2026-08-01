import type { SerializableActivityItem } from "@/src/services/activity/types";
import type { SerializableAiSummary } from "@/src/data/ai-summaries";
import type { SerializableCrawl } from "@/src/data/crawls";
import type { SerializableGoogleMetric } from "@/src/data/google-metrics";
import type { SerializableHeroSuggestion } from "@/src/data/hero-suggestions";
import type { SerializableNiceGuyMetric } from "@/src/data/niceguy-metrics";
import type { SerializableScreenshot } from "@/src/data/screenshots";
import type { SerializableWebsite } from "@/src/data/websites";

export type AuditStageStatusValue =
    | "not-started"
    | "queued"
    | "processing"
    | "complete"
    | "partial"
    | "failed"
    | "unavailable";

export type AuditStageKey =
    | "crawl"
    | "screenshots"
    | "pageSpeed"
    | "niceGuy"
    | "aiAnalysis";

export type AuditStageStatus = {
    status: AuditStageStatusValue;
    label: string;
    description?: string | null;
    startedAt?: string | null;
    completedAt?: string | null;
    latestRunAt?: string | null;
    errorCode?: string | null;
    errorMessage?: string | null;
    isStale?: boolean;
    staleReason?: string | null;
};

export type AuditBlocker = {
    stage: string;
    code: string;
    message: string;
};

export type AuditReadiness = {
    canRunCrawl: boolean;
    canRunScreenshots: boolean;
    canRunPageSpeed: boolean;
    canRunNiceGuy: boolean;
    canRunAiAnalysis: boolean;
    nextRecommendedStage:
        | "crawl"
        | "screenshots"
        | "pagespeed"
        | "niceguy"
        | "ai-analysis"
        | "complete";
    blockers: AuditBlocker[];
    isAuditReadyForReport: boolean;
    stages: {
        crawl: { canRun: boolean; isStale: boolean; staleReason?: string | null };
        screenshots: { canRun: boolean; isStale: boolean; staleReason?: string | null };
        pageSpeed: { canRun: boolean; isStale: boolean; staleReason?: string | null };
        niceGuy: { canRun: boolean; isStale: boolean; staleReason?: string | null };
        aiAnalysis: { canRun: boolean; isStale: boolean; staleReason?: string | null };
    };
    warnings: string[];
};

export type AuditHistoryItem = {
    id: string;
    status: string;
    label: string;
    createdAt: string;
    completedAt?: string | null;
    durationMs?: number | null;
    crawlId?: string | null;
    version?: string | null;
    score?: number | null;
    confidence?: number | null;
    model?: string | null;
    promptVersion?: string | null;
};

export type AuditRelationWarning = {
    code: string;
    message: string;
};

import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";

export type WebsiteAuditDashboardData = {
    website: SerializableWebsite;
    selectedAuditRunId: string | null;
    activeJob: SerializableAuditJob | null;
    auditStatus: {
        crawl: AuditStageStatus;
        screenshots: AuditStageStatus;
        pageSpeed: AuditStageStatus;
        niceGuy: AuditStageStatus;
        aiAnalysis: AuditStageStatus;
    };
    readiness: AuditReadiness;
    relationWarnings: AuditRelationWarning[];
    latest: {
        crawl: SerializableCrawl | null;
        screenshots: SerializableScreenshot[];
        pageSpeed: {
            mobile: SerializableGoogleMetric | null;
            desktop: SerializableGoogleMetric | null;
        };
        niceGuy: SerializableNiceGuyMetric | null;
        aiSummary: SerializableAiSummary | null;
        heroSuggestions: SerializableHeroSuggestion[];
        aiMetadata: {
            provider: string | null;
            model: string | null;
            promptTokens: number | null;
            completionTokens: number | null;
            totalTokens: number | null;
        } | null;
    };
    overview: {
        pagesCrawled: number | null;
        screenshotCount: number | null;
        mobilePerformance: number | null;
        desktopPerformance: number | null;
        niceGuyScore: number | null;
        niceGuyConfidence: number | null;
        aiAnalysisStatus: string;
    };
    history: {
        crawlRuns: AuditHistoryItem[];
        pageSpeedRuns: AuditHistoryItem[];
        niceGuyRuns: AuditHistoryItem[];
        aiRuns: AuditHistoryItem[];
    };
    activity?: SerializableActivityItem[];
};
