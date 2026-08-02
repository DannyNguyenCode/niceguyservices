import "server-only";

import { getOpenAuditRunForWebsite } from "@/src/data/audit-runs";
import { hasActiveCrawlForWebsite } from "@/src/data/crawls";
import { ACTIVE_AUDIT_RUN_STATUSES } from "@/src/services/audit-history/constants";
import {
    AuditFinalizationError,
    finalizeAuditRun,
    updateAuditRunStage,
} from "@/src/services/audit-history/finalize-audit-run";
import type { AuditRunStatus } from "@/src/services/audit-history/types";

function isActiveAuditRunStatus(status: AuditRunStatus): boolean {
    return ACTIVE_AUDIT_RUN_STATUSES.includes(
        status as (typeof ACTIVE_AUDIT_RUN_STATUSES)[number],
    );
}

/**
 * Clears audit runs left in an active state when no crawl job is still running.
 * This commonly happens after a dev-server restart or an interrupted crawl.
 */
export async function recoverOrphanedActiveAuditRunForWebsite(
    websiteId: string,
): Promise<boolean> {
    if (await hasActiveCrawlForWebsite(websiteId)) {
        return false;
    }

    const openRun = await getOpenAuditRunForWebsite(websiteId);
    if (!openRun || !isActiveAuditRunStatus(openRun.status)) {
        return false;
    }

    if (openRun.completion.crawl === "complete") {
        return false;
    }

    await updateAuditRunStage(openRun.id, "crawl", "failed", "failed");

    try {
        await finalizeAuditRun({ auditRunId: openRun.id });
    } catch (error) {
        if (
            error instanceof AuditFinalizationError &&
            error.code === "AUDIT_HISTORY_ALREADY_FINALIZED"
        ) {
            return true;
        }
        throw error;
    }

    return true;
}
