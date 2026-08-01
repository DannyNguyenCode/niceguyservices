export type AuditRunStatus =
    | "draft"
    | "queued"
    | "crawling"
    | "collecting-screenshots"
    | "collecting-pagespeed"
    | "calculating-metrics"
    | "generating-ai-analysis"
    | "complete"
    | "partial"
    | "failed"
    | "cancelled"
    | "archived";

export type AuditStageCompletion =
    | "not-started"
    | "running"
    | "complete"
    | "partial"
    | "failed"
    | "skipped";

export type AuditHistorySummary = {
    pagesDiscovered?: number | null;
    pagesCrawled?: number | null;
    screenshotsCaptured?: number | null;
    overallScore?: number | null;
    categoryScores: Array<{ category: string; score: number }>;
    pageSpeed: {
        mobile?: {
            performance?: number | null;
            accessibility?: number | null;
            bestPractices?: number | null;
            seo?: number | null;
        } | null;
        desktop?: {
            performance?: number | null;
            accessibility?: number | null;
            bestPractices?: number | null;
            seo?: number | null;
        } | null;
    };
    strengthCount?: number | null;
    weaknessCount?: number | null;
    recommendationCount?: number | null;
    warningCount: number;
    errorCount: number;
};

export type SerializableAuditRun = {
    id: string;
    websiteId: string;
    auditNumber: number;
    status: AuditRunStatus;
    isCurrent: boolean;
    isArchived: boolean;
    trigger: {
        type: "administrator" | "system" | "retry" | "migration";
        actorId: string | null;
        actorName: string | null;
    };
    source: {
        websiteUrl: string;
        normalizedUrl: string;
        businessName: string | null;
        domain: string | null;
    };
    configuration: {
        crawlMaxPages: number | null;
        crawlMaxDepth: number | null;
        includeScreenshots: boolean;
        includePageSpeed: boolean;
        includeNiceGuyMetrics: boolean;
        includeAiAnalysis: boolean;
        generateReportDraft: boolean;
        pageSpeedStrategies: Array<"mobile" | "desktop">;
        configurationVersion: string;
    };
    versions: {
        auditSchemaVersion: string;
        crawlerVersion: string | null;
        screenshotVersion: string | null;
        pageSpeedVersion: string | null;
        metricsVersion: string | null;
        aiPromptVersion: string | null;
        aiSchemaVersion: string | null;
    };
    references: {
        crawlDataIds: string[];
        screenshotIds: string[];
        googleMetricsIds: string[];
        niceGuyMetricsId: string | null;
        aiSummaryId: string | null;
        heroSuggestionIds: string[];
        aiMetadataIds: string[];
        publicReportIds: string[];
        pdfReportIds: string[];
        outreachDraftIds: string[];
        demoProjectIds: string[];
    };
    summary: AuditHistorySummary;
    completion: {
        crawl: AuditStageCompletion;
        screenshots: AuditStageCompletion;
        pageSpeed: AuditStageCompletion;
        metrics: AuditStageCompletion;
        ai: AuditStageCompletion;
    };
    failure: {
        stage: string | null;
        errorCode: string | null;
        errorMessage: string | null;
    } | null;
    startedAt: string | null;
    completedAt: string | null;
    archivedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type AuditRunListItem = Pick<
    SerializableAuditRun,
    | "id"
    | "websiteId"
    | "auditNumber"
    | "status"
    | "isCurrent"
    | "isArchived"
    | "summary"
    | "completion"
    | "startedAt"
    | "completedAt"
    | "createdAt"
>;

export type AuditComparisonSnapshot = {
    auditRunId: string;
    auditNumber: number;
    status: AuditRunStatus;
    completedAt: string | null;
    summary: AuditHistorySummary;
    versions: SerializableAuditRun["versions"];
};

export type AuditComparison = {
    from: AuditComparisonSnapshot;
    to: AuditComparisonSnapshot;
    changes: {
        overallScore?: {
            from: number | null;
            to: number | null;
            difference: number | null;
        };
        categoryScores: Array<{
            category: string;
            from: number | null;
            to: number | null;
            difference: number | null;
        }>;
        pageSpeed: {
            mobile: {
                performance?: {
                    from: number | null;
                    to: number | null;
                    difference: number | null;
                };
            };
            desktop: {
                performance?: {
                    from: number | null;
                    to: number | null;
                    difference: number | null;
                };
            };
        };
        pagesCrawled?: {
            from: number | null;
            to: number | null;
            difference: number | null;
        };
        screenshotsCaptured?: {
            from: number | null;
            to: number | null;
            difference: number | null;
        };
        strengths?: {
            from: number | null;
            to: number | null;
            difference: number | null;
        };
        weaknesses?: {
            from: number | null;
            to: number | null;
            difference: number | null;
        };
        recommendations?: {
            from: number | null;
            to: number | null;
            difference: number | null;
        };
    };
    compatibility: {
        metricsVersionMatch: boolean;
        aiPromptVersionMatch: boolean;
        pageSpeedVersionMatch: boolean;
        warnings: string[];
    };
};
