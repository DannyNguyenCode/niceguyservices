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

export type RunPageSpeedAnalysisResult =
    | {
          success: true;
          status: "complete" | "partial";
          websiteId: string;
          crawlId: string;
          results: {
              mobile: { status: "complete" | "failed"; googleMetricId?: string };
              desktop: { status: "complete" | "failed"; googleMetricId?: string };
          };
      }
    | {
          success: false;
          error: { code: string; message: string };
      };

const STRATEGY_MESSAGES: Record<PageSpeedStrategy, { success: string; failure: string }> = {
    mobile: {
        success: "Google PageSpeed completed the mobile analysis.",
        failure: "Google PageSpeed could not complete the mobile analysis.",
    },
    desktop: {
        success: "Google PageSpeed completed the desktop analysis.",
        failure: "Google PageSpeed could not complete the desktop analysis.",
    },
};

function mapClientError(error: unknown): { code: string; message: string } {
    if (error instanceof PageSpeedClientError) {
        return { code: error.code, message: error.message };
    }
    if (error instanceof PublicUrlValidationError) {
        return { code: "PAGESPEED_URL_ERROR", message: error.message };
    }
    if (error instanceof Error && error.message === "PAGESPEED_CONFIGURATION_ERROR") {
        return {
            code: "PAGESPEED_CONFIGURATION_ERROR",
            message:
                "Google PageSpeed is not configured. Set GOOGLE_PAGESPEED_API_KEY in your .env file.",
        };
    }
    if (error instanceof Error && error.message === "PAGESPEED_INVALID_RESPONSE") {
        return {
            code: "PAGESPEED_INVALID_RESPONSE",
            message: "Google PageSpeed returned an invalid response.",
        };
    }
    return {
        code: "PAGESPEED_API_ERROR",
        message: "Google PageSpeed could not complete the analysis.",
    };
}

async function runStrategy(input: {
    websiteId: string;
    crawlId: string;
    strategy: PageSpeedStrategy;
    url: string;
    googleMetricId: string;
}): Promise<{ status: "complete" | "failed"; googleMetricId: string }> {
    const startedAt = Date.now();

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

        await createActivityLog({
            websiteId: input.websiteId,
            crawlId: input.crawlId,
            type:
                input.strategy === "mobile"
                    ? "pagespeed-mobile-completed"
                    : "pagespeed-desktop-completed",
            description: STRATEGY_MESSAGES[input.strategy].success,
            actor: "system",
            metadata: {
                strategy: input.strategy,
                googleMetricId: input.googleMetricId,
                durationMs: Date.now() - startedAt,
            },
        });

        return { status: "complete", googleMetricId: input.googleMetricId };
    } catch (error) {
        const mapped = mapClientError(error);
        console.error(`PageSpeed ${input.strategy} failed:`, error);

        await failGoogleMetricRecord(input.googleMetricId, {
            errorCode: mapped.code,
            errorMessage: STRATEGY_MESSAGES[input.strategy].failure,
            durationMs: Date.now() - startedAt,
        });

        await createActivityLog({
            websiteId: input.websiteId,
            crawlId: input.crawlId,
            type:
                input.strategy === "mobile"
                    ? "pagespeed-mobile-failed"
                    : "pagespeed-desktop-failed",
            description: STRATEGY_MESSAGES[input.strategy].failure,
            actor: "system",
            metadata: {
                strategy: input.strategy,
                googleMetricId: input.googleMetricId,
                errorCode: mapped.code,
            },
        });

        return { status: "failed", googleMetricId: input.googleMetricId };
    }
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

    const mobileResult = await runStrategy({
        websiteId,
        crawlId: latestCrawl.id,
        strategy: "mobile",
        url: homepageUrl,
        googleMetricId: mobileRecord.id,
    });

    const desktopResult = await runStrategy({
        websiteId,
        crawlId: latestCrawl.id,
        strategy: "desktop",
        url: homepageUrl,
        googleMetricId: desktopRecord.id,
    });

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
        },
    });

    if (auditRunId) {
        await updateAuditRunStage(
            auditRunId,
            "pageSpeed",
            finalStatus === "complete" ? "complete" : finalStatus === "partial" ? "partial" : "failed",
            "calculating-metrics",
        );
    }

    if (finalStatus === "failed") {
        return {
            success: false,
            error: {
                code: "PAGESPEED_FAILED",
                message: "Google PageSpeed could not complete the analysis.",
            },
        };
    }

    return {
        success: true,
        status: finalStatus === "complete" ? "complete" : "partial",
        websiteId,
        crawlId: latestCrawl.id,
        results: {
            mobile: mobileResult,
            desktop: desktopResult,
        },
    };
}
