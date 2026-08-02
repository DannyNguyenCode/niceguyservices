import "server-only";

import { CRAWL_CONFIG } from "@/src/lib/crawl-config";
import { toSafePublicErrorMessage, validatePublicCrawlUrl } from "@/src/lib/validate-public-url";
import { createActivityLog } from "@/src/data/activity-logs";
import { createCrawlRecord, hasActiveCrawlForWebsite } from "@/src/data/crawls";
import { getWebsiteById, updateWebsiteCrawlStatus } from "@/src/data/websites";
import { createAuditRun, AuditHistoryError } from "@/src/services/audit-history/create-audit-run";
import { recoverOrphanedActiveAuditRunForWebsite } from "@/src/services/audit-history/recover-orphaned-audit-run";
import { updateAuditRunStage } from "@/src/services/audit-history/finalize-audit-run";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { updateAuditRunStatus } from "@/src/data/audit-runs";
import {
    calculateScreenshotCost,
    enforceAdministratorActionRateLimit,
} from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";
import {
    assertAuditStageEnabled,
    shouldExecuteAuditStageSynchronously,
} from "@/src/services/audit-jobs/stage-execution";
import { executeWebsiteCrawlWork } from "@/src/services/audit-jobs/execute-crawl-work";
import { recoverLegacyStageJobs } from "@/src/services/audit-jobs/audit-worker";

export type RunWebsiteCrawlResult =
    | {
          ok: true;
          crawlId: string;
          message: string;
          accepted?: boolean;
          auditRunId?: string;
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
              | "disabled";
      };

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

    let auditRun;
    try {
        auditRun = await createAuditRun({
            websiteId,
            trigger: { type: "administrator", actorId: null, actorName: null },
        });
    } catch (error) {
        if (error instanceof AuditHistoryError) {
            if (error.code === "AUDIT_HISTORY_DUPLICATE_ACTIVE_RUN") {
                return {
                    ok: false,
                    code: "duplicate",
                    message: error.message,
                };
            }
            return {
                ok: false,
                code: "database",
                message: error.message,
            };
        }
        throw error;
    }

    await updateAuditRunStatus(auditRun.id, "crawling", { startedAt: new Date() });
    await updateAuditRunStage(auditRun.id, "crawl", "running", "crawling");

    const beforeCreateActive = await hasActiveCrawlForWebsite(websiteId);
    const { crawl, created } = await createCrawlRecord({
        websiteId,
        requestedUrl: website.originalUrl,
        status: "queued",
        auditRunId: auditRun.id,
    });

    if (!created || beforeCreateActive) {
        return {
            ok: false,
            code: "duplicate",
            message: "A crawl is already in progress for this website.",
        };
    }

    await registerAuditReference({
        auditRunId: auditRun.id,
        resourceType: "crawl-data",
        resourceId: crawl.id,
    });

    await createActivityLog({
        websiteId,
        crawlId: crawl.id,
        auditRunId: auditRun.id,
        type: "crawl-queued",
        description: `Crawl queued for ${website.originalUrl}.`,
        actor: "admin",
    });

    await updateWebsiteCrawlStatus(websiteId, "queued");

    if (!shouldExecuteAuditStageSynchronously()) {
        return {
            ok: true,
            accepted: true,
            crawlId: crawl.id,
            auditRunId: auditRun.id,
            message: "Website crawl queued for background processing.",
        };
    }

    try {
        await executeWebsiteCrawlWork(crawl.id);
        return {
            ok: true,
            crawlId: crawl.id,
            auditRunId: auditRun.id,
            message: "Website crawl completed successfully.",
        };
    } catch (error) {
        return {
            ok: false,
            code: "crawl-failed",
            message: error instanceof Error ? error.message : "Website crawl failed.",
        };
    }
}
