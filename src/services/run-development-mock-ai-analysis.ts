import "server-only";

import {
    completeAiSummaryRecord,
    createAiSummaryRecord,
    updateAiSummaryStatus,
} from "@/src/data/ai-summaries";
import { createActivityLog } from "@/src/data/activity-logs";
import { createAiMetadataRecord } from "@/src/data/ai-metadata";
import { getAuditRunById } from "@/src/data/audit-runs";
import { getCrawlById } from "@/src/data/crawls";
import { getGoogleMetricsForCrawl } from "@/src/data/google-metrics";
import { getNiceGuyMetricById } from "@/src/data/niceguy-metrics";
import { getScreenshotsForCrawl } from "@/src/data/screenshots";
import { getWebsiteById, updateWebsiteAiAnalysisStatus } from "@/src/data/websites";
import { AI_ANALYSIS_VERSION, AI_CONFIG } from "@/src/lib/ai-config";
import { buildDevelopmentMockAiSummary } from "@/src/services/ai/development-mock-analysis";
import {
    collectValidCheckIds,
    normalizeAiSummaryOutput,
} from "@/src/services/ai/normalize-output";
import { updateAuditRunStage } from "@/src/services/audit-history/finalize-audit-run";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";
import type { RunAiAnalysisResult } from "@/src/services/run-ai-analysis";

export async function runDevelopmentMockAiAnalysis(
    websiteId: string,
    options: RateLimitedServiceOptions & { crawlId: string; auditRunId: string },
): Promise<RunAiAnalysisResult> {
    const website = await getWebsiteById(websiteId);
    const crawl = await getCrawlById(options.crawlId);
    const auditRun = await getAuditRunById(options.auditRunId);
    const niceGuyMetricId = auditRun?.references.niceGuyMetricsId;
    const niceGuyMetric = niceGuyMetricId
        ? await getNiceGuyMetricById(niceGuyMetricId)
        : null;

    if (!website || !crawl || crawl.status !== "complete" || !niceGuyMetric) {
        return {
            success: false,
            error: {
                code: "MOCK_AI_PREREQUISITES",
                message: "Development mock AI analysis requires completed crawl and Nice Guy scoring.",
            },
        };
    }

    const googleMetrics = await getGoogleMetricsForCrawl(crawl.id);
    const screenshots = await getScreenshotsForCrawl(crawl.id);
    const startedAt = Date.now();

    await updateWebsiteAiAnalysisStatus(websiteId, "processing");
    const summaryRecord = await createAiSummaryRecord({
        websiteId,
        crawlId: crawl.id,
        niceGuyMetricId: niceGuyMetric.id,
        auditRunId: options.auditRunId,
        analysisVersion: AI_ANALYSIS_VERSION,
        promptVersion: `${AI_CONFIG.analysisPromptVersion}-development-mock`,
        sourceSnapshot: {
            scoringVersion: niceGuyMetric.scoringVersion,
            overallScore: niceGuyMetric.overallScore,
            categoryScores: {},
            mobilePageSpeedAvailable: googleMetrics.some(
                (metric) => metric.strategy === "mobile" && metric.status === "complete",
            ),
            desktopPageSpeedAvailable: googleMetrics.some(
                (metric) => metric.strategy === "desktop" && metric.status === "complete",
            ),
            screenshotCount: screenshots.filter((shot) => shot.status === "complete").length,
            pageCount: crawl.pageResults.length,
        },
        status: "processing",
        visuallyAnalyzed: false,
        inputModalities: ["text", "dom"],
        screenshotIds: [],
    });

    await registerAuditReference({
        auditRunId: options.auditRunId,
        resourceType: "ai-summary",
        resourceId: summaryRecord.id,
    });
    await updateAuditRunStage(options.auditRunId, "ai", "running", "generating-ai-analysis");

    const validCheckIds = collectValidCheckIds(
        Object.values(niceGuyMetric.categories).map((category) => ({
            checks: category.checks ?? [],
        })),
    );
    const mockOutput = normalizeAiSummaryOutput(
        buildDevelopmentMockAiSummary({
            categories: Object.values(niceGuyMetric.categories).map((category) => ({
                checks: category.checks,
            })),
            businessName: website.businessName,
        }),
        validCheckIds,
    );

    const completedSummary = await completeAiSummaryRecord(summaryRecord.id, {
        ...mockOutput,
        durationMs: Date.now() - startedAt,
        promptVersion: `${AI_CONFIG.analysisPromptVersion}-development-mock`,
        analysisVersion: AI_ANALYSIS_VERSION,
        visuallyAnalyzed: false,
        inputModalities: ["text", "dom"],
        screenshotIds: [],
    });

    await createAiMetadataRecord({
        websiteId,
        crawlId: crawl.id,
        auditRunId: options.auditRunId,
        relatedType: "ai-summary",
        relatedId: completedSummary.id,
        provider: "development-mock",
        model: "development-mock-v1",
        promptVersion: `${AI_CONFIG.analysisPromptVersion}-development-mock`,
        analysisVersion: AI_ANALYSIS_VERSION,
        promptTokens: null,
        completionTokens: null,
        totalTokens: null,
        durationMs: Date.now() - startedAt,
        providerRequestId: null,
    });

    await updateWebsiteAiAnalysisStatus(websiteId, "complete", new Date());
    await updateAuditRunStage(options.auditRunId, "ai", "complete");

    await createActivityLog({
        websiteId,
        crawlId: crawl.id,
        auditRunId: options.auditRunId,
        type: "ai-analysis-completed",
        description: "Development mock AI analysis completed.",
        actor: "system",
        metadata: {
            aiSummaryId: completedSummary.id,
            developmentMock: true,
        },
    });

    return {
        success: true,
        status: "partial",
        websiteId,
        crawlId: crawl.id,
        niceGuyMetricId: niceGuyMetric.id,
        results: {
            summary: { status: "complete", aiSummaryId: completedSummary.id },
            heroSuggestions: { status: "failed" },
        },
    };
}
