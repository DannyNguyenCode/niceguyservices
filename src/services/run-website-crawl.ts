import "server-only";

import { CRAWL_CONFIG } from "@/src/lib/crawl-config";
import { toSafePublicErrorMessage, validatePublicCrawlUrl } from "@/src/lib/validate-public-url";
import { createActivityLog } from "@/src/data/activity-logs";
import { getCrawlByAuditRunId, hasActiveCrawlForWebsite } from "@/src/data/crawls";
import { getWebsiteById } from "@/src/data/websites";
import {
    calculateScreenshotCost,
    enforceAdministratorActionRateLimit,
} from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";
import { assertAuditStageEnabled, shouldExecuteAuditStageSynchronously } from "@/src/services/audit-jobs/stage-execution";
import { recoverLegacyStageJobs } from "@/src/services/audit-jobs/audit-worker";
import { recoverAbandonedQueuedCrawlForWebsite } from "@/src/services/audit-jobs/recover-abandoned-queued-crawl";
import { recoverOrphanedActiveAuditRunForWebsite } from "@/src/services/audit-history/recover-orphaned-audit-run";
import {
    StartAuditJobError,
    startAuditJob,
} from "@/src/services/audit-pipeline/start-audit-job";
import { MANUAL_CRAWL_AUDIT_CONFIGURATION } from "@/src/services/audit-pipeline/manual-crawl-configuration";

export type RunWebsiteCrawlResult =
    | {
          ok: true;
          crawlId: string | null;
          auditRunId: string;
          auditJobId: string;
          message: string;
          accepted?: boolean;
          reused?: boolean;
      }
    | {
          ok: false;
          message: string;
          code:
              | "invalid-id"
              | "not-found"
              | "duplicate"
              | "invalid-url"
              | "crawl-failed"
              | "database"
              | "disabled"
              | "worker-schedule-failed";
      };

function mapStartErrorCode(
    code: string,
): Extract<RunWebsiteCrawlResult, { ok: false }>["code"] {
    if (code === "AUDIT_WEBSITE_NOT_FOUND") return "not-found";
    if (code === "AUDIT_HISTORY_DUPLICATE_ACTIVE_RUN") return "duplicate";
    if (code.startsWith("AUDIT_PREFLIGHT") || code.includes("URL")) return "invalid-url";
    return "database";
}

/**
 * Manual Run Crawl — enters the same durable AuditJob + worker architecture as
 * full audits, limited to crawl + screenshots via configuration flags.
 */
export async function runWebsiteCrawl(
    websiteId: string,
    options?: RateLimitedServiceOptions & { policyId?: "crawl-start" | "audit-start" },
): Promise<RunWebsiteCrawlResult> {
    try {
        assertAuditStageEnabled("crawl");
    } catch (error) {
        return {
            ok: false,
            code: "disabled",
            message: error instanceof Error ? error.message : "Crawling is disabled.",
        };
    }

    const website = await getWebsiteById(websiteId);
    if (!website) {
        return { ok: false, code: "not-found", message: "Website not found." };
    }

    await recoverLegacyStageJobs();
    await recoverAbandonedQueuedCrawlForWebsite(websiteId);
    await recoverOrphanedActiveAuditRunForWebsite(websiteId);

    if (await hasActiveCrawlForWebsite(websiteId)) {
        return {
            ok: false,
            code: "duplicate",
            message: "A crawl is already in progress for this website.",
        };
    }

    try {
        await validatePublicCrawlUrl(website.originalUrl);
    } catch (error) {
        return {
            ok: false,
            code: "invalid-url",
            message: toSafePublicErrorMessage(error),
        };
    }

    await enforceAdministratorActionRateLimit({
        policyId: options?.policyId ?? "crawl-start",
        websiteId,
        administratorIdentity: options?.administratorIdentity,
        internalWorker: options?.internalWorker,
    });
    await enforceAdministratorActionRateLimit({
        policyId: "screenshot-start",
        websiteId,
        cost: calculateScreenshotCost(12),
        administratorIdentity: options?.administratorIdentity,
        internalWorker: options?.internalWorker,
    });

    const forceAsync = !shouldExecuteAuditStageSynchronously();

    try {
        const started = await startAuditJob({
            websiteId,
            configuration: {
                ...MANUAL_CRAWL_AUDIT_CONFIGURATION,
                crawlMaxPages: CRAWL_CONFIG.maxPages,
                crawlMaxDepth: CRAWL_CONFIG.maxDepth,
            },
            trigger: { type: "administrator", actorId: null, actorName: null },
            forceAsync,
        });

        const crawl = await getCrawlByAuditRunId(started.auditRunId).catch(() => null);

        console.info("[manual-crawl] MANUAL_CRAWL_ACCEPTED", {
            websiteId,
            auditRunId: started.auditRunId,
            auditJobId: started.job.id,
            crawlId: crawl?.id ?? null,
            reused: started.reused,
            jobStatus: started.job.status,
            forceAsync,
        });

        await createActivityLog({
            websiteId,
            crawlId: crawl?.id,
            auditRunId: started.auditRunId,
            type: "crawl-queued",
            description: started.reused
                ? `Manual crawl reused active audit job for ${website.originalUrl}.`
                : `Manual crawl queued via AuditJob for ${website.originalUrl}.`,
            actor: "admin",
            metadata: {
                auditJobId: started.job.id,
                reused: started.reused,
                forceAsync,
            },
        });

        const queued =
            started.job.status === "queued" ||
            started.job.status === "processing" ||
            started.job.status === "waiting_for_external";

        if (forceAsync || queued) {
            return {
                ok: true,
                accepted: true,
                crawlId: crawl?.id ?? null,
                auditRunId: started.auditRunId,
                auditJobId: started.job.id,
                reused: started.reused,
                message: started.reused
                    ? "Crawl is already queued or running for this website."
                    : "Website crawl queued for background processing.",
            };
        }

        return {
            ok: true,
            crawlId: crawl?.id ?? null,
            auditRunId: started.auditRunId,
            auditJobId: started.job.id,
            reused: started.reused,
            message:
                started.job.status === "failed"
                    ? "Website crawl finished with errors. Check the dashboard for details."
                    : "Website crawl completed successfully.",
        };
    } catch (error) {
        if (error instanceof StartAuditJobError) {
            console.error("[manual-crawl] MANUAL_CRAWL_START_FAILED", {
                websiteId,
                code: error.code,
                message: error.message,
            });
            return {
                ok: false,
                code: mapStartErrorCode(error.code),
                message: error.message,
            };
        }

        console.error("[manual-crawl] MANUAL_CRAWL_UNEXPECTED_FAILURE", {
            websiteId,
            message: error instanceof Error ? error.message : "unknown",
        });
        return {
            ok: false,
            code: "crawl-failed",
            message: error instanceof Error ? error.message : "Website crawl failed.",
        };
    }
}
