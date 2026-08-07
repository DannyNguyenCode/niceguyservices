import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import { getLatestCrawlForWebsite, getCrawlById } from "@/src/data/crawls";
import { getGoogleMetricsForCrawl } from "@/src/data/google-metrics";
import {
    completeNiceGuyMetricRecord,
    createNiceGuyMetricRecord,
    failNiceGuyMetricRecord,
    hasActiveNiceGuyRun,
    updateNiceGuyMetricStatus,
} from "@/src/data/niceguy-metrics";
import {
    getWebsiteById,
    updateWebsiteNiceGuyStatus,
} from "@/src/data/websites";
import { NICEGUY_SCORING_VERSION } from "@/src/config/niceguy-scoring";
import { calculateNiceGuyScore } from "@/src/services/niceguy-scoring/calculate-niceguy-score";
import {
    getCompleteGoogleMetricsForCrawl,
    hasAtLeastOnePageSpeedResult,
    normalizeNiceGuyScoringInput,
} from "@/src/services/niceguy-scoring/normalize-input";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { resolveAuditRunIdForCrawl } from "@/src/services/audit-history/resolve-audit-run";
import { updateAuditRunStage } from "@/src/services/audit-history/finalize-audit-run";
import { enforceAdministratorActionRateLimit } from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";

export type RunNiceGuyAnalysisResult =
    | {
          success: true;
          websiteId: string;
          crawlId: string;
          niceGuyMetricId: string;
          scoringVersion: string;
          overallScore: number;
          status: "complete";
      }
    | {
          success: false;
          error: { code: string; message: string };
      };

export async function runNiceGuyAnalysis(
    websiteId: string,
    options?: RateLimitedServiceOptions,
): Promise<RunNiceGuyAnalysisResult> {
    const website = await getWebsiteById(websiteId);
    if (!website) {
        return {
            success: false,
            error: { code: "NOT_FOUND", message: "Website not found." },
        };
    }

    const latestCrawl = options?.crawlId
        ? await getCrawlById(options.crawlId)
        : await getLatestCrawlForWebsite(websiteId);
    if (!latestCrawl || latestCrawl.status !== "complete") {
        return {
            success: false,
            error: {
                code: "CRAWL_REQUIRED",
                message: "A completed crawl is required before running Nice Guy analysis.",
            },
        };
    }

    const homepage = latestCrawl.pageResults.find((page) => page.pageType === "home");
    if (!homepage || (homepage.statusCode ?? 200) >= 400 || homepage.errorMessage) {
        return {
            success: false,
            error: {
                code: "CRAWL_HOMEPAGE_REQUIRED",
                message: "A successful homepage crawl result is required before scoring.",
            },
        };
    }

    const crawlMetrics = await getGoogleMetricsForCrawl(latestCrawl.id);
    const pagespeed = getCompleteGoogleMetricsForCrawl(crawlMetrics);
    const requirePageSpeed = options?.requirePageSpeed ?? true;
    if (requirePageSpeed && !hasAtLeastOnePageSpeedResult(pagespeed)) {
        return {
            success: false,
            error: {
                code: "PAGESPEED_REQUIRED",
                message:
                    "At least one completed PageSpeed result is required before running Nice Guy analysis.",
            },
        };
    }

    if (
        website.niceGuyStatus === "queued" ||
        website.niceGuyStatus === "processing" ||
        (await hasActiveNiceGuyRun(websiteId, latestCrawl.id))
    ) {
        return {
            success: false,
            error: {
                code: "DUPLICATE_RUN",
                message: "Nice Guy scoring is already in progress for this website.",
            },
        };
    }

    await enforceAdministratorActionRateLimit({
        policyId: "metrics-run",
        websiteId,
        administratorIdentity: options?.administratorIdentity,
        internalWorker: options?.internalWorker,
    });

    const startedAt = Date.now();
    let metricRecordId = "";
    const auditRunId = await resolveAuditRunIdForCrawl({
        websiteId,
        crawlId: latestCrawl.id,
        crawlAuditRunId: latestCrawl.auditRunId,
    });

    try {
        await updateWebsiteNiceGuyStatus(websiteId, "queued");
        const metricRecord = await createNiceGuyMetricRecord({
            websiteId,
            crawlId: latestCrawl.id,
            auditRunId,
            scoringVersion: NICEGUY_SCORING_VERSION,
            status: "queued",
        });
        metricRecordId = metricRecord.id;

        if (auditRunId) {
            await updateAuditRunStage(auditRunId, "metrics", "running", "calculating-metrics");
            await registerAuditReference({
                auditRunId,
                resourceType: "niceguy-metrics",
                resourceId: metricRecord.id,
            });
        }

        await createActivityLog({
            websiteId,
            crawlId: latestCrawl.id,
            type: "niceguy-queued",
            description: "Nice Guy scoring queued.",
            actor: "admin",
            metadata: {
                niceGuyMetricId: metricRecord.id,
                crawlId: latestCrawl.id,
                scoringVersion: NICEGUY_SCORING_VERSION,
            },
        });

        await updateNiceGuyMetricStatus(metricRecord.id, "processing");
        await updateWebsiteNiceGuyStatus(websiteId, "processing");

        await createActivityLog({
            websiteId,
            crawlId: latestCrawl.id,
            type: "niceguy-started",
            description: "Nice Guy scoring started.",
            actor: "admin",
            metadata: {
                niceGuyMetricId: metricRecord.id,
                crawlId: latestCrawl.id,
                scoringVersion: NICEGUY_SCORING_VERSION,
            },
        });

        const scoringInput = normalizeNiceGuyScoringInput({
            website,
            crawl: latestCrawl,
            pagespeed,
        });
        const result = calculateNiceGuyScore(scoringInput);
        const durationMs = Date.now() - startedAt;

        const completed = await completeNiceGuyMetricRecord(metricRecord.id, {
            ...result,
            durationMs,
        });

        await updateWebsiteNiceGuyStatus(websiteId, "complete", new Date());
        if (auditRunId) {
            await updateAuditRunStage(auditRunId, "metrics", "complete", "generating-ai-analysis");
        }
        await createActivityLog({
            websiteId,
            crawlId: latestCrawl.id,
            type: "niceguy-completed",
            description: `Nice Guy scoring completed with an overall score of ${result.overallScore}.`,
            actor: "system",
            metadata: {
                niceGuyMetricId: completed.id,
                crawlId: latestCrawl.id,
                scoringVersion: result.scoringVersion,
                overallScore: result.overallScore,
                durationMs,
            },
        });

        return {
            success: true,
            websiteId,
            crawlId: latestCrawl.id,
            niceGuyMetricId: completed.id,
            scoringVersion: result.scoringVersion,
            overallScore: result.overallScore,
            status: "complete",
        };
    } catch (error) {
        console.error("Nice Guy analysis failed:", error);
        const durationMs = Date.now() - startedAt;
        const message = "Nice Guy scoring could not be completed.";

        if (metricRecordId) {
            await failNiceGuyMetricRecord(metricRecordId, {
                errorCode: "NICEGUY_ANALYSIS_ERROR",
                errorMessage: message,
                durationMs,
            });
        }

        await updateWebsiteNiceGuyStatus(websiteId, "failed");
        await createActivityLog({
            websiteId,
            crawlId: latestCrawl.id,
            type: "niceguy-failed",
            description: message,
            actor: "system",
            metadata: {
                niceGuyMetricId: metricRecordId || undefined,
                crawlId: latestCrawl.id,
                scoringVersion: NICEGUY_SCORING_VERSION,
                durationMs,
            },
        });

        return {
            success: false,
            error: {
                code: "NICEGUY_ANALYSIS_ERROR",
                message,
            },
        };
    }
}
