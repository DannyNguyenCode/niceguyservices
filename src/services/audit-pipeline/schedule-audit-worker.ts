import "server-only";

import { after } from "next/server";
import { getAuditOperationFlags } from "@/src/config/app-env";
import { runAuditWorkerCycle } from "@/src/services/audit-pipeline/audit-pipeline-worker";

export type ScheduleAuditWorkerKickOptions = {
    /**
     * When true, schedule a worker kick even if AUDIT_SYNC_EXECUTION is enabled.
     * Required for forceAsync public submissions so jobs cannot be stranded queued
     * with no execution path.
     */
    force?: boolean;
};

/**
 * Returns whether a worker kick should be scheduled for the current flags.
 * Pure decision helper — used by scheduleAuditWorkerKick and unit tests.
 */
export function shouldScheduleAuditWorkerKick(
    options: ScheduleAuditWorkerKickOptions = {},
): boolean {
    const syncExecution = getAuditOperationFlags().syncExecution;
    if (syncExecution && !options.force) {
        return false;
    }
    return true;
}

/**
 * Schedules a best-effort worker kick after the current request finishes.
 * Production also relies on the Vercel Cron hitting /api/internal/audit-worker.
 *
 * Sync-execution mode normally skips this (admin runs inline instead). Callers
 * that intentionally queue work with forceAsync MUST pass `{ force: true }`.
 */
export function scheduleAuditWorkerKick(
    reason = "audit-job-queued",
    options: ScheduleAuditWorkerKickOptions = {},
): void {
    if (!shouldScheduleAuditWorkerKick(options)) {
        return;
    }

    if (getAuditOperationFlags().syncExecution && options.force) {
        console.warn("[audit-worker] scheduling forced async kick while syncExecution=true", {
            reason,
        });
    }

    try {
        after(async () => {
            try {
                console.info("[audit-worker] AUDIT_WORKER_KICK_SCHEDULED", { reason });
                await runAuditWorkerCycle();
            } catch (error) {
                console.error("[audit-worker] scheduled kick failed", {
                    reason,
                    message: error instanceof Error ? error.message : "unknown",
                });
            }
        });
    } catch (error) {
        // `after()` is only available in a request context.
        console.error("[audit-worker] unable to schedule kick", {
            reason,
            message: error instanceof Error ? error.message : "unknown",
        });
    }
}
