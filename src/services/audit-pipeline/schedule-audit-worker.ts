import "server-only";

import { after } from "next/server";
import { getAuditOperationFlags } from "@/src/config/app-env";
import { runAuditWorkerCycle } from "@/src/services/audit-pipeline/audit-pipeline-worker";

/**
 * Schedules a best-effort worker kick after the current request finishes.
 * Production also relies on the Vercel Cron hitting /api/internal/audit-worker.
 */
export function scheduleAuditWorkerKick(reason = "audit-job-queued"): void {
    if (getAuditOperationFlags().syncExecution) {
        return;
    }

    try {
        after(async () => {
            try {
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
