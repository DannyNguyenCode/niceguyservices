import "server-only";

import { getAuditRunById } from "@/src/data/audit-runs";
import { createCrawlRecord } from "@/src/data/crawls";
import { getCrawlById } from "@/src/data/crawls";
import { getGoogleMetricsForCrawl } from "@/src/data/google-metrics";
import { getPublicReportDraftForAuditRun } from "@/src/data/public-reports";
import { setAuditJobReportDraftId } from "@/src/data/audit-jobs";
import { getScreenshotsForCrawl } from "@/src/data/screenshots";
import { getWebsiteById } from "@/src/data/websites";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { updateAuditRunStage } from "@/src/services/audit-history/finalize-audit-run";
import { finalizeAuditRun } from "@/src/services/audit-history/finalize-audit-run";
import { executeWebsiteCrawlWork } from "@/src/services/audit-jobs/execute-crawl-work";
import { runAuditPreflight } from "@/src/services/audit-pipeline/preflight";
import { createReportDraftFromAuditRun } from "@/src/services/audit-pipeline/create-report-draft-from-audit-run";
import { markSkippedStages } from "@/src/services/audit-pipeline/stage-plan";
import type {
    AuditExecutionContext,
    AuditPipelineStageName,
    AuditStageResult,
} from "@/src/services/audit-pipeline/types";
import { isAnalysisProviderEnabled } from "@/src/services/cursor-analysis/config";
import { requestCursorAnalysisForAuditRun } from "@/src/services/cursor-analysis/request-cursor-analysis";
import { runNiceGuyAnalysis } from "@/src/services/run-niceguy-analysis";
import {
    completeGoogleMetricRecord,
    createGoogleMetricRecord,
    failGoogleMetricRecord,
    updateGoogleMetricStatus,
} from "@/src/data/google-metrics";
import { isPageSpeedConfigured } from "@/src/lib/pagespeed-config";
import { PageSpeedClientError, runPageSpeedTest } from "@/src/services/pagespeed-client";
import { parsePageSpeedResponse } from "@/src/services/pagespeed-parser";
import { validatePublicCrawlUrl, toSafePublicErrorMessage } from "@/src/lib/validate-public-url";
import type { PageSpeedStrategy } from "@/src/schemas/enums";
import { createActivityLog } from "@/src/data/activity-logs";
import { updateWebsitePageSpeedStatus } from "@/src/data/websites";

async function getCrawlForContext(context: AuditExecutionContext) {
    const auditRun = await getAuditRunById(context.auditRunId);
    if (!auditRun) {
        return null;
    }
    const crawlId = auditRun.references.crawlDataIds.at(-1);
    return crawlId ? getCrawlById(crawlId) : null;
}

async function runPageSpeedStrategy(input: {
    context: AuditExecutionContext;
    strategy: PageSpeedStrategy;
}): Promise<AuditStageResult> {
    if (!input.context.configuration.includePageSpeed) {
        return { status: "skipped" };
    }

    const crawl = await getCrawlForContext(input.context);
    if (!crawl || crawl.status !== "complete") {
        return {
            status: "failed",
            errorCode: "CRAWL_REQUIRED",
            errorMessage: "A completed crawl is required before PageSpeed.",
            retryable: true,
        };
    }

    const existing = (await getGoogleMetricsForCrawl(crawl.id)).find(
        (metric) => metric.strategy === input.strategy && metric.status === "complete",
    );
    if (existing?.status === "complete") {
        return { status: "completed" };
    }
    if (existing?.status === "failed") {
        return {
            status: "completed_with_warnings",
            errorCode: existing.errorCode,
            errorMessage: `${input.strategy} PageSpeed failed previously.`,
            retryable: true,
        };
    }

    if (!isPageSpeedConfigured()) {
        return {
            status: "completed_with_warnings",
            errorCode: "PAGESPEED_CONFIGURATION_ERROR",
            errorMessage: "Google PageSpeed is not configured.",
            retryable: false,
        };
    }

    const homepageUrl = crawl.finalUrl || crawl.requestedUrl;
    try {
        await validatePublicCrawlUrl(homepageUrl);
    } catch (error) {
        return {
            status: "completed_with_warnings",
            errorCode: "PAGESPEED_URL_ERROR",
            errorMessage: toSafePublicErrorMessage(error),
            retryable: false,
        };
    }

    const record =
        existing ??
        (await createGoogleMetricRecord({
            websiteId: input.context.websiteId,
            crawlId: crawl.id,
            auditRunId: input.context.auditRunId,
            strategy: input.strategy,
            requestedUrl: homepageUrl,
            status: "queued",
        }));

    await registerAuditReference({
        auditRunId: input.context.auditRunId,
        resourceType: "google-metrics",
        resourceId: record.id,
    });

    await updateAuditRunStage(input.context.auditRunId, "pageSpeed", "running", "collecting-pagespeed");
    await updateGoogleMetricStatus(record.id, "processing");
    const startedAt = Date.now();

    try {
        const response = await runPageSpeedTest({ url: homepageUrl, strategy: input.strategy });
        const parsed = parsePageSpeedResponse(response, input.strategy);
        await completeGoogleMetricRecord(record.id, {
            ...parsed,
            durationMs: Date.now() - startedAt,
        });
        await createActivityLog({
            websiteId: input.context.websiteId,
            crawlId: crawl.id,
            auditRunId: input.context.auditRunId,
            type:
                input.strategy === "mobile"
                    ? "pagespeed-mobile-completed"
                    : "pagespeed-desktop-completed",
            description: `${input.strategy} PageSpeed completed.`,
            actor: "system",
        });
        return { status: "completed" };
    } catch (error) {
        const code =
            error instanceof PageSpeedClientError ? error.code : "PAGESPEED_API_ERROR";
        await failGoogleMetricRecord(record.id, {
            errorCode: code,
            errorMessage: `${input.strategy} PageSpeed failed.`,
            durationMs: Date.now() - startedAt,
        });
        return {
            status: "completed_with_warnings",
            errorCode: code,
            errorMessage: `${input.strategy} PageSpeed could not be completed.`,
            retryable: true,
        };
    } finally {
        const metrics = await getGoogleMetricsForCrawl(crawl.id);
        const mobile = metrics.find((metric) => metric.strategy === "mobile");
        const desktop = metrics.find((metric) => metric.strategy === "desktop");
        const mobileDone = mobile?.status === "complete";
        const desktopDone = desktop?.status === "complete";
        const mobileFailed = mobile?.status === "failed";
        const desktopFailed = desktop?.status === "failed";
        let finalStatus: "complete" | "partial" | "failed" = "failed";
        if (mobileDone && desktopDone) finalStatus = "complete";
        else if (mobileDone || desktopDone) finalStatus = "partial";
        else if (mobileFailed && desktopFailed) finalStatus = "failed";
        await updateWebsitePageSpeedStatus(input.context.websiteId, finalStatus, new Date());
        await updateAuditRunStage(
            input.context.auditRunId,
            "pageSpeed",
            finalStatus === "complete" ? "complete" : finalStatus === "partial" ? "partial" : "failed",
            "calculating-metrics",
        );
    }
}

export async function runAuditStage(
    stage: AuditPipelineStageName,
    context: AuditExecutionContext,
): Promise<AuditStageResult> {
    const website = await getWebsiteById(context.websiteId);
    if (!website) {
        return {
            status: "failed",
            errorCode: "WEBSITE_NOT_FOUND",
            errorMessage: "Website not found.",
            retryable: false,
        };
    }

    if (markSkippedStages(context.configuration).includes(stage)) {
        return { status: "skipped" };
    }

    switch (stage) {
        case "preflight": {
            try {
                const result = await runAuditPreflight(website.originalUrl);
                await createActivityLog({
                    websiteId: context.websiteId,
                    auditRunId: context.auditRunId,
                    type: "crawl-completed",
                    description: `Preflight passed for ${result.finalUrl}.`,
                    actor: "system",
                });
                return { status: "completed" };
            } catch (error) {
                return {
                    status: "failed",
                    errorCode: error instanceof Error && "code" in error ? String((error as { code: string }).code) : "AUDIT_PREFLIGHT_FAILED",
                    errorMessage: error instanceof Error ? error.message : "Audit preflight failed.",
                    retryable: false,
                };
            }
        }
        case "crawl": {
            const existing = await getCrawlForContext(context);
            if (existing?.status === "complete") {
                return { status: "completed" };
            }
            if (existing?.status === "processing" || existing?.status === "queued") {
                try {
                    await executeWebsiteCrawlWork(existing.id, {
                        includeScreenshots: context.configuration.includeScreenshots,
                        crawlMaxPages: context.configuration.crawlMaxPages ?? undefined,
                        crawlMaxDepth: context.configuration.crawlMaxDepth ?? undefined,
                        managedByPipeline: true,
                    });
                    const refreshed = await getCrawlById(existing.id);
                    return refreshed?.status === "complete"
                        ? { status: "completed" }
                        : {
                              status: "failed",
                              errorCode: "CRAWL_FAILED",
                              errorMessage: refreshed?.errorMessage ?? "Crawl failed.",
                              retryable: true,
                          };
                } catch {
                    return {
                        status: "failed",
                        errorCode: "CRAWL_FAILED",
                        errorMessage: "Crawl failed.",
                        retryable: true,
                    };
                }
            }

            const { crawl, created } = await createCrawlRecord({
                websiteId: context.websiteId,
                requestedUrl: website.originalUrl,
                status: "queued",
                auditRunId: context.auditRunId,
            });
            if (!created) {
                return {
                    status: "failed",
                    errorCode: "CRAWL_DUPLICATE",
                    errorMessage: "A crawl is already in progress.",
                    retryable: true,
                };
            }

            await registerAuditReference({
                auditRunId: context.auditRunId,
                resourceType: "crawl-data",
                resourceId: crawl.id,
            });
            await updateAuditRunStage(context.auditRunId, "crawl", "running", "crawling");

            try {
                await executeWebsiteCrawlWork(crawl.id, {
                    includeScreenshots: context.configuration.includeScreenshots,
                    crawlMaxPages: context.configuration.crawlMaxPages ?? undefined,
                    crawlMaxDepth: context.configuration.crawlMaxDepth ?? undefined,
                    managedByPipeline: true,
                });
                return { status: "completed" };
            } catch {
                return {
                    status: "failed",
                    errorCode: "CRAWL_FAILED",
                    errorMessage: "Crawl failed.",
                    retryable: true,
                };
            }
        }
        case "screenshots": {
            if (!context.configuration.includeScreenshots) {
                return { status: "skipped" };
            }
            const crawl = await getCrawlForContext(context);
            if (!crawl) {
                return { status: "skipped" };
            }
            const screenshots = await getScreenshotsForCrawl(crawl.id);
            if (screenshots.length === 0) {
                return {
                    status: "completed_with_warnings",
                    errorCode: "SCREENSHOTS_MISSING",
                    errorMessage: "No screenshots were captured.",
                    retryable: true,
                };
            }
            const failed = screenshots.every((shot) => shot.status === "failed");
            if (failed) {
                return {
                    status: "completed_with_warnings",
                    errorCode: "SCREENSHOTS_FAILED",
                    errorMessage: "Screenshot capture failed.",
                    retryable: true,
                };
            }
            await updateAuditRunStage(context.auditRunId, "screenshots", "complete");
            return { status: "completed" };
        }
        case "pagespeed_mobile":
            return runPageSpeedStrategy({ context, strategy: "mobile" });
        case "pagespeed_desktop":
            return runPageSpeedStrategy({ context, strategy: "desktop" });
        case "niceguy": {
            const crawl = await getCrawlForContext(context);
            if (!crawl) {
                return {
                    status: "failed",
                    errorCode: "CRAWL_REQUIRED",
                    errorMessage: "Crawl is required for Nice Guy scoring.",
                    retryable: true,
                };
            }
            const result = await runNiceGuyAnalysis(context.websiteId, {
                internalWorker: true,
                crawlId: crawl.id,
                auditRunId: context.auditRunId,
                managedByPipeline: true,
                requirePageSpeed: context.configuration.includePageSpeed,
            });
            if (!result.success) {
                return {
                    status: "failed",
                    errorCode: result.error.code,
                    errorMessage: result.error.message,
                    retryable: result.error.code !== "CRAWL_HOMEPAGE_REQUIRED",
                };
            }
            return { status: "completed" };
        }
        case "ai_analysis": {
            if (!context.configuration.includeAiAnalysis) {
                return { status: "skipped" };
            }
            const crawl = await getCrawlForContext(context);
            if (!crawl) {
                return {
                    status: "completed_with_warnings",
                    errorCode: "CRAWL_REQUIRED",
                    errorMessage: "Crawl is required for AI analysis.",
                    retryable: true,
                };
            }

            if (!isAnalysisProviderEnabled()) {
                return {
                    status: "completed_with_warnings",
                    errorCode: "CURSOR_ANALYSIS_NOT_CONFIGURED",
                    errorMessage:
                        "Cursor analysis is not configured. Add Cursor environment variables and redeploy.",
                    retryable: true,
                };
            }

            await updateAuditRunStage(
                context.auditRunId,
                "ai",
                "running",
                "generating-ai-analysis",
            );

            const result = await requestCursorAnalysisForAuditRun(context.auditRunId);
            if (!result.ok) {
                await updateAuditRunStage(context.auditRunId, "ai", "failed");
                return {
                    status: "completed_with_warnings",
                    errorCode: result.code,
                    errorMessage: result.message,
                    retryable: result.code !== "ANALYSIS_ALREADY_ACTIVE",
                };
            }

            // Successful webhook trigger means accepted/pending — not AI complete.
            return {
                status: "waiting_for_external",
                errorCode: null,
                errorMessage: "Cursor analysis accepted. Waiting for authenticated callback.",
            };
        }
        case "finalize": {
            try {
                await finalizeAuditRun({ auditRunId: context.auditRunId });
                return { status: "completed" };
            } catch (error) {
                return {
                    status: "failed",
                    errorCode: error instanceof Error && "code" in error ? String((error as { code: string }).code) : "FINALIZE_FAILED",
                    errorMessage: error instanceof Error ? error.message : "Unable to finalize audit.",
                    retryable: true,
                };
            }
        }
        case "report_draft": {
            if (!context.configuration.generateReportDraft) {
                return { status: "skipped" };
            }
            const existing = await getPublicReportDraftForAuditRun(context.auditRunId);
            if (existing) {
                return { status: "completed" };
            }
            const result = await createReportDraftFromAuditRun({
                auditRunId: context.auditRunId,
                websiteId: context.websiteId,
            });
            if (!result.success) {
                if (result.error.code === "AI_SUMMARY_MISSING") {
                    return {
                        status: "completed_with_warnings",
                        errorCode: result.error.code,
                        errorMessage: result.error.message,
                        retryable: true,
                    };
                }
                return {
                    status: "failed",
                    errorCode: result.error.code,
                    errorMessage: result.error.message,
                    retryable: true,
                };
            }
            await setAuditJobReportDraftId(context.jobId, result.reportId);
            return { status: "completed" };
        }
        default:
            return { status: "skipped" };
    }
}
