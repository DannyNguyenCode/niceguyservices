import "server-only";

import { getLatestCrawlForWebsite, getCrawlById } from "@/src/data/crawls";
import { createActivityLog } from "@/src/data/activity-logs";
import {
    completeGoogleMetricRecord,
    createGoogleMetricRecord,
    failGoogleMetricRecord,
    hasActivePageSpeedRun,
    updateGoogleMetricStatus,
} from "@/src/data/google-metrics";
import {
    getWebsiteById,
    updateWebsitePageSpeedStatus,
} from "@/src/data/websites";
import { isPageSpeedConfigured } from "@/src/lib/pagespeed-config";
import {
    PublicUrlValidationError,
    toSafePublicErrorMessage,
    validatePublicCrawlUrl,
} from "@/src/lib/validate-public-url";
import { PageSpeedClientError, runPageSpeedTest } from "@/src/services/pagespeed-client";
import { parsePageSpeedResponse } from "@/src/services/pagespeed-parser";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { resolveAuditRunIdForCrawl } from "@/src/services/audit-history/resolve-audit-run";
import { updateAuditRunStage } from "@/src/services/audit-history/finalize-audit-run";
import {
    calculatePageSpeedCost,
    checkProviderBudget,
    enforceAdministratorActionRateLimit,
} from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";
import type { PageSpeedStrategy } from "@/src/schemas/enums";
import type { PageSpeedStatus } from "@/src/schemas/enums";

export type PageSpeedStrategyOutcome = {
    status: "complete" | "failed";
    googleMetricId: string;
    errorCode?: string;
    errorMessage?: string;
};

export type RunPageSpeedAnalysisResult =
    | {
          /** Persistence finished; inspect `status` for Google outcome. */
          success: true;
          status: "complete" | "partial" | "failed";
          websiteId: string;
          crawlId: string;
          results: {
              mobile: PageSpeedStrategyOutcome;
              desktop: PageSpeedStrategyOutcome;
          };
      }
    | {
          /** Precondition / setup failure before metrics were run. */
          success: false;
          error: { code: string; message: string };
      };

const STRATEGY_LABEL: Record<PageSpeedStrategy, string> = {
    mobile: "mobile",
    desktop: "desktop",
};

function adminSafeErrorMessage(code: string, strategy: PageSpeedStrategy, detail: string): string {
    const label = STRATEGY_LABEL[strategy];
    switch (code) {
        case "PAGESPEED_CONFIGURATION_ERROR":
            return `PageSpeed ${label}: configuration error. Check GOOGLE_PAGESPEED_API_KEY.`;
        case "PAGESPEED_RATE_LIMIT":
            return `PageSpeed ${label}: rate limited by Google. Try again later.`;
        case "PAGESPEED_TIMEOUT":
            return `PageSpeed ${label}: request timed out.`;
        case "PAGESPEED_NETWORK_ERROR":
            return `PageSpeed ${label}: network error reaching Google.`;
        case "PAGESPEED_URL_ERROR":
            return `PageSpeed ${label}: Google could not analyze this URL.`;
        case "PAGESPEED_PROVIDER_ERROR":
        case "PAGESPEED_API_ERROR":
            return `PageSpeed ${label}: provider error. ${detail.slice(0, 180)}`;
        case "PAGESPEED_INVALID_RESPONSE":
            return `PageSpeed ${label}: invalid response from Google.`;
        default:
            return `PageSpeed ${label}: ${detail.slice(0, 200) || "analysis failed."}`;
    }
}

function mapClientError(
    error: unknown,
    strategy: PageSpeedStrategy,
): { code: string; message: string } {
    if (error instanceof PageSpeedClientError) {
        const code =
            error.code === "PAGESPEED_API_ERROR" ? "PAGESPEED_PROVIDER_ERROR" : error.code;
        return {
            code,
            message: adminSafeErrorMessage(code, strategy, error.message),
        };
    }
    if (error instanceof PublicUrlValidationError) {
        return {
            code: "PAGESPEED_URL_ERROR",
            message: adminSafeErrorMessage("PAGESPEED_URL_ERROR", strategy, error.message),
        };
    }
    if (error instanceof Error && error.message === "PAGESPEED_CONFIGURATION_ERROR") {
        return {
            code: "PAGESPEED_CONFIGURATION_ERROR",
            message: adminSafeErrorMessage(
                "PAGESPEED_CONFIGURATION_ERROR",
                strategy,
                error.message,
            ),
        };
    }
    if (error instanceof Error && error.message === "PAGESPEED_INVALID_RESPONSE") {
        return {
            code: "PAGESPEED_INVALID_RESPONSE",
            message: adminSafeErrorMessage("PAGESPEED_INVALID_RESPONSE", strategy, error.message),
        };
    }
    const detail = error instanceof Error ? error.message : "unknown error";
    return {
        code: "PAGESPEED_PROVIDER_ERROR",
        message: adminSafeErrorMessage("PAGESPEED_PROVIDER_ERROR", strategy, detail),
    };
}

async function runStrategy(input: {
    websiteId: string;
    crawlId: string;
    strategy: PageSpeedStrategy;
    url: string;
    googleMetricId: string;
}): Promise<PageSpeedStrategyOutcome> {
    const startedAt = Date.now();

    console.info("[pagespeed] STRATEGY_STARTED", {
        websiteId: input.websiteId,
        crawlId: input.crawlId,
        metricId: input.googleMetricId,
        strategy: input.strategy,
    });

    await updateGoogleMetricStatus(input.googleMetricId, "processing");

    try {
        const response = await runPageSpeedTest({
            url: input.url,
            strategy: input.strategy,
        });
        const parsed = parsePageSpeedResponse(response, input.strategy);

        await completeGoogleMetricRecord(input.googleMetricId, {
            ...parsed,
            durationMs: Date.now() - startedAt,
        });

        console.info("[pagespeed] STRATEGY_COMPLETED", {
            websiteId: input.websiteId,
            crawlId: input.crawlId,
            metricId: input.googleMetricId,
            strategy: input.strategy,
            durationMs: Date.now() - startedAt,
        });

        await createActivityLog({
            websiteId: input.websiteId,
            crawlId: input.crawlId,
            type:
                input.strategy === "mobile"
                    ? "pagespeed-mobile-completed"
                    : "pagespeed-desktop-completed",
            description: `Google PageSpeed completed the ${input.strategy} analysis.`,
            actor: "system",
            metadata: {
                strategy: input.strategy,
                googleMetricId: input.googleMetricId,
                durationMs: Date.now() - startedAt,
            },
        });

        return { status: "complete", googleMetricId: input.googleMetricId };
    } catch (error) {
        const mapped = mapClientError(error, input.strategy);
        console.error("[pagespeed] STRATEGY_FAILED", {
            websiteId: input.websiteId,
            crawlId: input.crawlId,
            metricId: input.googleMetricId,
            strategy: input.strategy,
            errorCode: mapped.code,
            message: mapped.message,
        });

        await failGoogleMetricRecord(input.googleMetricId, {
            errorCode: mapped.code,
            errorMessage: mapped.message,
            durationMs: Date.now() - startedAt,
        });

        await createActivityLog({
            websiteId: input.websiteId,
            crawlId: input.crawlId,
            type:
                input.strategy === "mobile"
                    ? "pagespeed-mobile-failed"
                    : "pagespeed-desktop-failed",
            description: mapped.message,
            actor: "system",
            metadata: {
                strategy: input.strategy,
                googleMetricId: input.googleMetricId,
                errorCode: mapped.code,
            },
        });

        return {
            status: "failed",
            googleMetricId: input.googleMetricId,
            errorCode: mapped.code,
            errorMessage: mapped.message,
        };
    }
}

function outcomeFromSettled(
    settled: PromiseSettledResult<PageSpeedStrategyOutcome>,
    fallbackMetricId: string,
    strategy: PageSpeedStrategy,
): PageSpeedStrategyOutcome {
    if (settled.status === "fulfilled") {
        return settled.value;
    }
    const mapped = mapClientError(settled.reason, strategy);
    console.error("[pagespeed] STRATEGY_UNHANDLED_REJECTION", {
        strategy,
        metricId: fallbackMetricId,
        errorCode: mapped.code,
        message: mapped.message,
    });
    return {
        status: "failed",
        googleMetricId: fallbackMetricId,
        errorCode: mapped.code,
        errorMessage: mapped.message,
    };
}

export async function runPageSpeedAnalysis(
    websiteId: string,
    options?: RateLimitedServiceOptions,
): Promise<RunPageSpeedAnalysisResult> {
    if (!isPageSpeedConfigured()) {
        return {
            success: false,
            error: {
                code: "PAGESPEED_CONFIGURATION_ERROR",
                message:
                    "Google PageSpeed is not configured. Set GOOGLE_PAGESPEED_API_KEY in your .env file.",
            },
        };
    }

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
                message: "A completed crawl is required before running PageSpeed.",
            },
        };
    }

    const homepageUrl = latestCrawl.finalUrl || latestCrawl.requestedUrl;
    if (!homepageUrl) {
        return {
            success: false,
            error: {
                code: "PAGESPEED_URL_ERROR",
                message: "No homepage URL is available from the latest crawl.",
            },
        };
    }

    try {
        await validatePublicCrawlUrl(homepageUrl);
    } catch (error) {
        return {
            success: false,
            error: {
                code: "PAGESPEED_URL_ERROR",
                message: toSafePublicErrorMessage(error),
            },
        };
    }

    if (
        website.pageSpeedStatus === "queued" ||
        website.pageSpeedStatus === "processing" ||
        (await hasActivePageSpeedRun(websiteId, latestCrawl.id))
    ) {
        return {
            success: false,
            error: {
                code: "DUPLICATE_RUN",
                message: "A PageSpeed analysis is already in progress for this website.",
            },
        };
    }

    const strategies: PageSpeedStrategy[] = ["mobile", "desktop"];
    const cost = calculatePageSpeedCost(strategies);
    await enforceAdministratorActionRateLimit({
        policyId: "pagespeed-run",
        websiteId,
        cost,
        administratorIdentity: options?.administratorIdentity,
        internalWorker: options?.internalWorker,
    });
    await checkProviderBudget({
        policyId: "pagespeed-global-daily",
        cost,
    });

    const auditRunId = await resolveAuditRunIdForCrawl({
        websiteId,
        crawlId: latestCrawl.id,
        crawlAuditRunId: latestCrawl.auditRunId,
    });

    await updateWebsitePageSpeedStatus(websiteId, "queued");
    await createActivityLog({
        websiteId,
        crawlId: latestCrawl.id,
        type: "pagespeed-queued",
        description: `PageSpeed queued for ${homepageUrl}.`,
        actor: "admin",
    });

    const mobileRecord = await createGoogleMetricRecord({
        websiteId,
        crawlId: latestCrawl.id,
        auditRunId,
        strategy: "mobile",
        requestedUrl: homepageUrl,
        status: "queued",
    });
    const desktopRecord = await createGoogleMetricRecord({
        websiteId,
        crawlId: latestCrawl.id,
        auditRunId,
        strategy: "desktop",
        requestedUrl: homepageUrl,
        status: "queued",
    });

    if (auditRunId) {
        await updateAuditRunStage(auditRunId, "pageSpeed", "running", "collecting-pagespeed");
        await registerAuditReference({
            auditRunId,
            resourceType: "google-metrics",
            resourceId: mobileRecord.id,
        });
        await registerAuditReference({
            auditRunId,
            resourceType: "google-metrics",
            resourceId: desktopRecord.id,
        });
    }

    await updateWebsitePageSpeedStatus(websiteId, "processing");
    await createActivityLog({
        websiteId,
        crawlId: latestCrawl.id,
        type: "pagespeed-started",
        description: "PageSpeed analysis started.",
        actor: "admin",
    });

    const [mobileSettled, desktopSettled] = await Promise.allSettled([
        runStrategy({
            websiteId,
            crawlId: latestCrawl.id,
            strategy: "mobile",
            url: homepageUrl,
            googleMetricId: mobileRecord.id,
        }),
        runStrategy({
            websiteId,
            crawlId: latestCrawl.id,
            strategy: "desktop",
            url: homepageUrl,
            googleMetricId: desktopRecord.id,
        }),
    ]);

    const mobileResult = outcomeFromSettled(mobileSettled, mobileRecord.id, "mobile");
    const desktopResult = outcomeFromSettled(desktopSettled, desktopRecord.id, "desktop");

    // If a strategy rejected before failGoogleMetricRecord, persist failure now.
    if (mobileSettled.status === "rejected" && mobileResult.status === "failed") {
        try {
            await failGoogleMetricRecord(mobileRecord.id, {
                errorCode: mobileResult.errorCode ?? "PAGESPEED_PROVIDER_ERROR",
                errorMessage: mobileResult.errorMessage ?? "PageSpeed mobile analysis failed.",
                durationMs: 0,
            });
        } catch {
            // Already failed or complete.
        }
    }
    if (desktopSettled.status === "rejected" && desktopResult.status === "failed") {
        try {
            await failGoogleMetricRecord(desktopRecord.id, {
                errorCode: desktopResult.errorCode ?? "PAGESPEED_PROVIDER_ERROR",
                errorMessage: desktopResult.errorMessage ?? "PageSpeed desktop analysis failed.",
                durationMs: 0,
            });
        } catch {
            // Already failed or complete.
        }
    }

    let finalStatus: PageSpeedStatus = "failed";
    if (mobileResult.status === "complete" && desktopResult.status === "complete") {
        finalStatus = "complete";
    } else if (mobileResult.status === "complete" || desktopResult.status === "complete") {
        finalStatus = "partial";
    }

    const completedAt = new Date();
    await updateWebsitePageSpeedStatus(websiteId, finalStatus, completedAt);

    const activityType =
        finalStatus === "complete"
            ? "pagespeed-completed"
            : finalStatus === "partial"
              ? "pagespeed-partial"
              : "pagespeed-failed";

    await createActivityLog({
        websiteId,
        crawlId: latestCrawl.id,
        auditRunId,
        type: activityType,
        description:
            finalStatus === "complete"
                ? "PageSpeed analysis completed for mobile and desktop."
                : finalStatus === "partial"
                  ? "PageSpeed analysis completed with partial results."
                  : "PageSpeed analysis failed for mobile and desktop.",
        actor: "system",
        metadata: {
            mobileStatus: mobileResult.status,
            desktopStatus: desktopResult.status,
            mobileErrorCode: mobileResult.errorCode ?? null,
            desktopErrorCode: desktopResult.errorCode ?? null,
        },
    });

    if (auditRunId) {
        await updateAuditRunStage(
            auditRunId,
            "pageSpeed",
            finalStatus === "complete"
                ? "complete"
                : finalStatus === "partial"
                  ? "partial"
                  : "failed",
            "calculating-metrics",
        );
    }

    console.info("[pagespeed] DASHBOARD_ACTION_COMPLETED", {
        websiteId,
        crawlId: latestCrawl.id,
        auditRunId,
        status: finalStatus,
        mobileStatus: mobileResult.status,
        desktopStatus: desktopResult.status,
        mobileMetricId: mobileResult.googleMetricId,
        desktopMetricId: desktopResult.googleMetricId,
    });

    return {
        success: true,
        status: finalStatus,
        websiteId,
        crawlId: latestCrawl.id,
        results: {
            mobile: mobileResult,
            desktop: desktopResult,
        },
    };
}
