import type { PageSpeedStrategy } from "@/src/schemas/enums";

export type LabMetricValue = {
    valueMs?: number | null;
    value?: number | null;
    displayValue?: string | null;
    score?: number | null;
};

export type NormalizedPageSpeedResult = {
    finalUrl?: string | null;
    fetchTime?: Date | null;
    lighthouseVersion?: string | null;
    userAgent?: string | null;
    scores: {
        performance?: number | null;
        accessibility?: number | null;
        bestPractices?: number | null;
        seo?: number | null;
    };
    labMetrics: {
        firstContentfulPaint?: LabMetricValue;
        largestContentfulPaint?: LabMetricValue;
        totalBlockingTime?: LabMetricValue;
        cumulativeLayoutShift?: LabMetricValue;
        speedIndex?: LabMetricValue;
        interactive?: LabMetricValue;
        timeToFirstByte?: LabMetricValue;
        maxPotentialFirstInputDelay?: LabMetricValue;
    };
    fieldData: {
        available: boolean;
        overallCategory?: "FAST" | "AVERAGE" | "SLOW" | "NONE" | null;
        originFallback?: boolean;
        firstContentfulPaint?: { percentile?: number | null; category?: string | null };
        largestContentfulPaint?: { percentile?: number | null; category?: string | null };
        interactionToNextPaint?: { percentile?: number | null; category?: string | null };
        cumulativeLayoutShift?: { percentile?: number | null; category?: string | null };
        timeToFirstByte?: { percentile?: number | null; category?: string | null };
    };
    coreWebVitals: {
        assessment?: "passed" | "failed" | "unavailable";
        largestContentfulPaint?: {
            value?: number | null;
            rating?: "good" | "needs-improvement" | "poor" | "unavailable";
        };
        interactionToNextPaint?: {
            value?: number | null;
            rating?: "good" | "needs-improvement" | "poor" | "unavailable";
        };
        cumulativeLayoutShift?: {
            value?: number | null;
            rating?: "good" | "needs-improvement" | "poor" | "unavailable";
        };
    };
    opportunities: Array<{
        auditId: string;
        title: string;
        description?: string | null;
        score?: number | null;
        scoreDisplayMode?: string | null;
        displayValue?: string | null;
        estimatedSavingsMs?: number | null;
        estimatedSavingsBytes?: number | null;
        priority: "high" | "medium" | "low";
    }>;
    diagnostics: Array<{
        auditId: string;
        title: string;
        description?: string | null;
        score?: number | null;
        scoreDisplayMode?: string | null;
        displayValue?: string | null;
        detailsType?: string | null;
    }>;
    failedAudits: Array<{
        auditId: string;
        category: "performance" | "accessibility" | "best-practices" | "seo" | "unknown";
        title: string;
        description?: string | null;
        score?: number | null;
        scoreDisplayMode?: string | null;
        displayValue?: string | null;
        severity: "critical" | "high" | "medium" | "low";
    }>;
    passedAuditCount: number;
    failedAuditCount: number;
    notApplicableAuditCount: number;
    apiMetadata: {
        responseId?: string | null;
        analysisUTCTimestamp?: Date | null;
    };
};

export type PageSpeedStrategyInput = PageSpeedStrategy;
