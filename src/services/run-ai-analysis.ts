import "server-only";

import {
    completeAiSummaryRecord,
    createAiSummaryRecord,
    failAiSummaryRecord,
    hasActiveAiAnalysis,
    updateAiSummaryStatus,
} from "@/src/data/ai-summaries";
import { createActivityLog } from "@/src/data/activity-logs";
import { createAiMetadataRecord } from "@/src/data/ai-metadata";
import { getLatestCrawlForWebsite } from "@/src/data/crawls";
import { createHeroSuggestionRecords } from "@/src/data/hero-suggestions";
import { getGoogleMetricsForCrawl } from "@/src/data/google-metrics";
import { getLatestNiceGuyMetricForWebsite } from "@/src/data/niceguy-metrics";
import { getScreenshotsForCrawl } from "@/src/data/screenshots";
import {
    getWebsiteById,
    updateWebsiteAiAnalysisStatus,
} from "@/src/data/websites";
import {
    AI_ANALYSIS_VERSION,
    AI_CONFIG,
    AI_HERO_SUGGESTION_VERSION,
    isAiConfigured,
} from "@/src/lib/ai-config";
import type { NiceGuyCategoryKey } from "@/src/config/niceguy-scoring";
import {
    buildAuditAnalysisInput,
    hasSufficientHeroContext,
} from "@/src/services/ai/build-audit-analysis-input";
import { generateAuditAnalysis } from "@/src/services/ai/generate-audit-analysis";
import { generateHeroSuggestions } from "@/src/services/ai/generate-hero-suggestions";
import {
    getCompleteGoogleMetricsForCrawl,
    hasAtLeastOnePageSpeedResult,
} from "@/src/services/niceguy-scoring/normalize-input";
import { finalizeAuditRun, updateAuditRunStage } from "@/src/services/audit-history/finalize-audit-run";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { resolveAuditRunIdForCrawl } from "@/src/services/audit-history/resolve-audit-run";
import {
    checkProviderBudget,
    enforceAdministratorActionRateLimit,
} from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";

export type RunAiAnalysisResult =
    | {
          success: true;
          status: "complete" | "partial";
          websiteId: string;
          crawlId: string;
          niceGuyMetricId: string;
          results: {
              summary: { status: "complete" | "failed"; aiSummaryId?: string };
              heroSuggestions: {
                  status: "complete" | "failed";
                  heroSuggestionIds?: string[];
              };
          };
      }
    | {
          success: false;
          error: { code: string; message: string };
      };

const CATEGORY_KEYS: NiceGuyCategoryKey[] = [
    "businessClarity",
    "trustCredibility",
    "conversionReadiness",
    "userExperience",
    "brandingConsistency",
    "contentQuality",
    "technicalFoundation",
];

function buildSourceSnapshot(input: {
    niceGuyMetric: Awaited<ReturnType<typeof getLatestNiceGuyMetricForWebsite>>;
    googleMetrics: Awaited<ReturnType<typeof getGoogleMetricsForCrawl>>;
    screenshotCount: number;
    pageCount: number;
}) {
    const categoryScores: Record<string, number | null> = {};
    for (const key of CATEGORY_KEYS) {
        categoryScores[key] = input.niceGuyMetric?.categories[key]?.score ?? null;
    }

    const mobile = input.googleMetrics.find(
        (metric) => metric.strategy === "mobile" && metric.status === "complete",
    );
    const desktop = input.googleMetrics.find(
        (metric) => metric.strategy === "desktop" && metric.status === "complete",
    );

    return {
        scoringVersion: input.niceGuyMetric?.scoringVersion ?? "niceguy-v1",
        overallScore: input.niceGuyMetric?.overallScore ?? 0,
        categoryScores,
        mobilePageSpeedAvailable: Boolean(mobile),
        desktopPageSpeedAvailable: Boolean(desktop),
        screenshotCount: input.screenshotCount,
        pageCount: input.pageCount,
    };
}

function mapErrorCode(error: unknown): { code: string; message: string } {
    const code =
        error instanceof Error && error.message.startsWith("AI_")
            ? error.message
            : "AI_PROVIDER_ERROR";

    const messages: Record<string, string> = {
        AI_CONFIGURATION_ERROR:
            "AI provider is not configured. Add AI_PROVIDER, AI_MODEL, and AI_API_KEY.",
        AI_ANALYSIS_ALREADY_RUNNING:
            "AI analysis is already in progress for this website.",
        AI_INSUFFICIENT_EVIDENCE:
            "Insufficient business and service information to generate grounded hero suggestions.",
        AI_REQUEST_TIMEOUT: "AI analysis timed out. Please try again.",
        AI_RATE_LIMIT: "AI provider rate limit reached. Please try again shortly.",
        AI_SCHEMA_VALIDATION_FAILED:
            "AI output could not be validated. Please try again.",
        AI_SUMMARY_FAILED: "AI summary generation failed.",
        AI_HERO_SUGGESTIONS_FAILED: "Hero suggestion generation failed.",
    };

    return {
        code,
        message: messages[code] ?? "AI analysis could not be completed.",
    };
}

export async function runAiAnalysis(
    websiteId: string,
    options?: RateLimitedServiceOptions,
): Promise<RunAiAnalysisResult> {
    if (!isAiConfigured()) {
        return {
            success: false,
            error: {
                code: "AI_CONFIGURATION_ERROR",
                message:
                    "AI provider is not configured. Add AI_PROVIDER, AI_MODEL, and AI_API_KEY.",
            },
        };
    }

    const website = await getWebsiteById(websiteId);
    if (!website || website.deletedAt) {
        return {
            success: false,
            error: { code: "NOT_FOUND", message: "Website not found." },
        };
    }

    const latestCrawl = await getLatestCrawlForWebsite(websiteId);
    if (!latestCrawl || latestCrawl.status !== "complete") {
        return {
            success: false,
            error: {
                code: "CRAWL_REQUIRED",
                message: "A completed crawl is required before running AI analysis.",
            },
        };
    }

    const homepage = latestCrawl.pageResults.find((page) => page.pageType === "home");
    if (!homepage || (homepage.statusCode ?? 200) >= 400 || homepage.errorMessage) {
        return {
            success: false,
            error: {
                code: "CRAWL_HOMEPAGE_REQUIRED",
                message: "A successful homepage crawl result is required before AI analysis.",
            },
        };
    }

    const niceGuyMetric = await getLatestNiceGuyMetricForWebsite(websiteId);
    if (!niceGuyMetric || niceGuyMetric.status !== "complete") {
        return {
            success: false,
            error: {
                code: "NICEGUY_REQUIRED",
                message:
                    "Completed Nice Guy scoring is required before running AI analysis.",
            },
        };
    }

    if (niceGuyMetric.crawlId !== latestCrawl.id) {
        return {
            success: false,
            error: {
                code: "NICEGUY_STALE",
                message:
                    "Nice Guy scoring must be run on the latest crawl before AI analysis.",
            },
        };
    }

    const googleMetrics = await getGoogleMetricsForCrawl(latestCrawl.id);
    const pagespeed = getCompleteGoogleMetricsForCrawl(googleMetrics);
    if (!hasAtLeastOnePageSpeedResult(pagespeed)) {
        return {
            success: false,
            error: {
                code: "PAGESPEED_REQUIRED",
                message:
                    "At least one completed PageSpeed result is required before running AI analysis.",
            },
        };
    }

    if (
        website.aiAnalysisStatus === "queued" ||
        website.aiAnalysisStatus === "processing" ||
        (await hasActiveAiAnalysis(websiteId, latestCrawl.id, niceGuyMetric.id))
    ) {
        return {
            success: false,
            error: {
                code: "AI_ANALYSIS_ALREADY_RUNNING",
                message: "AI analysis is already in progress for this website.",
            },
        };
    }

    await enforceAdministratorActionRateLimit({
        policyId: "ai-analysis-run",
        websiteId,
        administratorIdentity: options?.administratorIdentity,
        internalWorker: options?.internalWorker,
    });
    await checkProviderBudget({
        policyId: "ai-analysis-global-daily",
        cost: 1,
    });

    const screenshots = await getScreenshotsForCrawl(latestCrawl.id);
    const sourceSnapshot = buildSourceSnapshot({
        niceGuyMetric,
        googleMetrics,
        screenshotCount: screenshots.filter((item) => item.status === "complete").length,
        pageCount: latestCrawl.pageResults.length,
    });

    const startedAt = Date.now();
    let summaryRecordId = "";
    const auditRunId = await resolveAuditRunIdForCrawl({
        websiteId,
        crawlId: latestCrawl.id,
        crawlAuditRunId: latestCrawl.auditRunId,
    });
    let summaryOutcome: { status: "complete" | "failed"; aiSummaryId?: string } = {
        status: "failed",
    };
    let heroOutcome: {
        status: "complete" | "failed";
        heroSuggestionIds?: string[];
    } = { status: "failed" };

    try {
        await updateWebsiteAiAnalysisStatus(websiteId, "queued");
        const summaryRecord = await createAiSummaryRecord({
            websiteId,
            crawlId: latestCrawl.id,
            niceGuyMetricId: niceGuyMetric.id,
            auditRunId,
            analysisVersion: AI_ANALYSIS_VERSION,
            promptVersion: AI_CONFIG.analysisPromptVersion,
            sourceSnapshot,
            status: "queued",
        });
        summaryRecordId = summaryRecord.id;

        if (auditRunId) {
            await updateAuditRunStage(auditRunId, "ai", "running", "generating-ai-analysis");
            await registerAuditReference({
                auditRunId,
                resourceType: "ai-summary",
                resourceId: summaryRecord.id,
            });
        }

        await createActivityLog({
            websiteId,
            crawlId: latestCrawl.id,
            type: "ai-analysis-queued",
            description: "AI analysis queued.",
            actor: "admin",
            metadata: {
                aiSummaryId: summaryRecord.id,
                crawlId: latestCrawl.id,
                niceGuyMetricId: niceGuyMetric.id,
                analysisVersion: AI_ANALYSIS_VERSION,
                promptVersion: AI_CONFIG.analysisPromptVersion,
            },
        });

        await updateAiSummaryStatus(summaryRecord.id, "processing");
        await updateWebsiteAiAnalysisStatus(websiteId, "processing");

        await createActivityLog({
            websiteId,
            crawlId: latestCrawl.id,
            type: "ai-analysis-started",
            description: "AI analysis started.",
            actor: "admin",
            metadata: {
                aiSummaryId: summaryRecord.id,
                crawlId: latestCrawl.id,
                niceGuyMetricId: niceGuyMetric.id,
            },
        });

        const analysisInput = buildAuditAnalysisInput({
            website,
            crawl: latestCrawl,
            niceGuyMetric,
            googleMetrics,
            screenshots,
        });

        let summarySuccess = false;
        let heroSuccess = false;
        let heroSuggestionIds: string[] = [];

        try {
            const summaryGeneration = await generateAuditAnalysis(analysisInput);
            const completedSummary = await completeAiSummaryRecord(summaryRecord.id, {
                ...summaryGeneration.output,
                durationMs: summaryGeneration.durationMs,
                promptVersion: summaryGeneration.promptVersion,
                analysisVersion: AI_ANALYSIS_VERSION,
            });

            await createAiMetadataRecord({
                websiteId,
                crawlId: latestCrawl.id,
                auditRunId,
                relatedType: "ai-summary",
                relatedId: completedSummary.id,
                provider: summaryGeneration.provider,
                model: summaryGeneration.model,
                promptVersion: summaryGeneration.promptVersion,
                analysisVersion: AI_ANALYSIS_VERSION,
                promptTokens: summaryGeneration.promptTokens,
                completionTokens: summaryGeneration.completionTokens,
                totalTokens: summaryGeneration.totalTokens,
                durationMs: summaryGeneration.durationMs,
                providerRequestId: summaryGeneration.providerRequestId,
            });

            summarySuccess = true;
            summaryOutcome = {
                status: "complete",
                aiSummaryId: completedSummary.id,
            };

            await createActivityLog({
                websiteId,
                crawlId: latestCrawl.id,
                type: "ai-summary-completed",
                description: "AI summary completed.",
                actor: "system",
                metadata: {
                    aiSummaryId: completedSummary.id,
                    crawlId: latestCrawl.id,
                    niceGuyMetricId: niceGuyMetric.id,
                    provider: summaryGeneration.provider,
                    model: summaryGeneration.model,
                    durationMs: summaryGeneration.durationMs,
                },
            });
        } catch (error) {
            console.error("AI summary generation failed:", error);
            const mapped = mapErrorCode(error);
            await failAiSummaryRecord(summaryRecord.id, {
                errorCode: mapped.code,
                errorMessage: mapped.message,
                durationMs: Date.now() - startedAt,
            });
            await createActivityLog({
                websiteId,
                crawlId: latestCrawl.id,
                type: "ai-summary-failed",
                description: mapped.message,
                actor: "system",
                metadata: {
                    aiSummaryId: summaryRecord.id,
                    crawlId: latestCrawl.id,
                    niceGuyMetricId: niceGuyMetric.id,
                },
            });
        }

        if (summarySuccess) {
            try {
                if (!hasSufficientHeroContext(analysisInput)) {
                    throw new Error("AI_INSUFFICIENT_EVIDENCE");
                }

                const heroGeneration = await generateHeroSuggestions(analysisInput);
                const heroRecords = await createHeroSuggestionRecords({
                    websiteId,
                    crawlId: latestCrawl.id,
                    niceGuyMetricId: niceGuyMetric.id,
                    aiSummaryId: summaryOutcome.aiSummaryId!,
                    auditRunId,
                    promptVersion: heroGeneration.promptVersion,
                    suggestionVersion: AI_HERO_SUGGESTION_VERSION,
                    suggestions: heroGeneration.output.suggestions,
                });

                heroSuggestionIds = heroRecords.map((record) => record.id);

                if (auditRunId) {
                    for (const record of heroRecords) {
                        await registerAuditReference({
                            auditRunId,
                            resourceType: "hero-suggestion",
                            resourceId: record.id,
                        });
                    }
                }

                await createAiMetadataRecord({
                    websiteId,
                    crawlId: latestCrawl.id,
                    auditRunId,
                    relatedType: "hero-suggestions",
                    relatedId: summaryOutcome.aiSummaryId!,
                    provider: heroGeneration.provider,
                    model: heroGeneration.model,
                    promptVersion: heroGeneration.promptVersion,
                    analysisVersion: AI_HERO_SUGGESTION_VERSION,
                    promptTokens: heroGeneration.promptTokens,
                    completionTokens: heroGeneration.completionTokens,
                    totalTokens: heroGeneration.totalTokens,
                    durationMs: heroGeneration.durationMs,
                    providerRequestId: heroGeneration.providerRequestId,
                });

                heroSuccess = true;
                heroOutcome = {
                    status: "complete",
                    heroSuggestionIds,
                };

                await createActivityLog({
                    websiteId,
                    crawlId: latestCrawl.id,
                    type: "hero-suggestions-completed",
                    description: "Hero suggestions completed.",
                    actor: "system",
                    metadata: {
                        aiSummaryId: summaryOutcome.aiSummaryId,
                        heroSuggestionIds,
                        crawlId: latestCrawl.id,
                        niceGuyMetricId: niceGuyMetric.id,
                        provider: heroGeneration.provider,
                        model: heroGeneration.model,
                        durationMs: heroGeneration.durationMs,
                    },
                });
            } catch (error) {
                console.error("Hero suggestions generation failed:", error);
                const mapped = mapErrorCode(error);
                await createActivityLog({
                    websiteId,
                    crawlId: latestCrawl.id,
                    type: "hero-suggestions-failed",
                    description: mapped.message,
                    actor: "system",
                    metadata: {
                        aiSummaryId: summaryOutcome.aiSummaryId,
                        crawlId: latestCrawl.id,
                        niceGuyMetricId: niceGuyMetric.id,
                    },
                });
            }
        }

        const finalStatus =
            summarySuccess && heroSuccess
                ? "complete"
                : summarySuccess || heroSuccess
                  ? "partial"
                  : "failed";

        await updateWebsiteAiAnalysisStatus(websiteId, finalStatus, new Date());

        const activityType =
            finalStatus === "complete"
                ? "ai-analysis-completed"
                : finalStatus === "partial"
                  ? "ai-analysis-partial"
                  : "ai-analysis-failed";

        await createActivityLog({
            websiteId,
            crawlId: latestCrawl.id,
            type: activityType,
            description:
                finalStatus === "complete"
                    ? "AI analysis completed."
                    : finalStatus === "partial"
                      ? "AI analysis partially completed."
                      : "AI analysis failed.",
            actor: "system",
            metadata: {
                aiSummaryId: summaryOutcome.aiSummaryId,
                heroSuggestionIds,
                crawlId: latestCrawl.id,
                niceGuyMetricId: niceGuyMetric.id,
                durationMs: Date.now() - startedAt,
            },
        });

        if (auditRunId) {
            await updateAuditRunStage(
                auditRunId,
                "ai",
                finalStatus === "complete"
                    ? "complete"
                    : finalStatus === "partial"
                      ? "partial"
                      : "failed",
            );
            try {
                await finalizeAuditRun({ auditRunId });
            } catch (finalizeError) {
                console.error("Audit finalization after AI analysis:", finalizeError);
            }
        }

        if (!summarySuccess && !heroSuccess) {
            return {
                success: false,
                error: {
                    code: "AI_SUMMARY_FAILED",
                    message: "AI analysis could not be completed.",
                },
            };
        }

        return {
            success: true,
            status: finalStatus === "complete" ? "complete" : "partial",
            websiteId,
            crawlId: latestCrawl.id,
            niceGuyMetricId: niceGuyMetric.id,
            results: {
                summary: summaryOutcome,
                heroSuggestions: heroOutcome,
            },
        };
    } catch (error) {
        console.error("AI analysis workflow failed:", error);
        const mapped = mapErrorCode(error);

        if (summaryRecordId) {
            await failAiSummaryRecord(summaryRecordId, {
                errorCode: mapped.code,
                errorMessage: mapped.message,
                durationMs: Date.now() - startedAt,
            });
        }

        await updateWebsiteAiAnalysisStatus(websiteId, "failed", new Date());
        await createActivityLog({
            websiteId,
            crawlId: latestCrawl.id,
            type: "ai-analysis-failed",
            description: mapped.message,
            actor: "system",
            metadata: {
                aiSummaryId: summaryRecordId || undefined,
                crawlId: latestCrawl.id,
                niceGuyMetricId: niceGuyMetric.id,
            },
        });

        return { success: false, error: mapped };
    }
}
