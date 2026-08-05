import "server-only";

import { connectToDatabase } from "@/src/lib/mongodb";
import {
    claimQueuedAuditJob,
    recoverStaleAuditPipelineJobs,
} from "@/src/data/audit-jobs";
import { recoverLegacyStageJobs } from "@/src/services/audit-jobs/audit-worker";
import { runAuditPipeline } from "@/src/services/audit-pipeline/run-audit-pipeline";
import { resumeAuditAfterCursorFailure } from "@/src/services/audit-pipeline/resume-audit-after-cursor";
import { recoverStaleAnalyses } from "@/src/services/cursor-analysis/recover-stale-analyses";
import { getAuditRunAnalysis } from "@/src/data/audit-run-analysis";
import { AuditJob } from "@/src/models/AuditJob";

export async function recoverStaleAuditJobs(): Promise<{
    pipelineJobs: number;
    crawls: number;
    pagespeed: number;
    niceguy: number;
    cursorAnalyses: number;
    waitingReconciled: number;
}> {
    await connectToDatabase();
    const [pipelineJobs, legacy, cursor] = await Promise.all([
        recoverStaleAuditPipelineJobs(),
        recoverLegacyStageJobs(),
        recoverStaleAnalyses(),
    ]);

    const waitingReconciled = await reconcileWaitingJobsAfterCursorRecovery(
        cursor.recovered.map((item) => item.auditRunId),
    );

    return {
        pipelineJobs,
        ...legacy,
        cursorAnalyses: cursor.recovered.length,
        waitingReconciled,
    };
}

async function reconcileWaitingJobsAfterCursorRecovery(
    recoveredAuditRunIds: string[],
): Promise<number> {
    let count = 0;
    const uniqueIds = [...new Set(recoveredAuditRunIds)];

    for (const auditRunId of uniqueIds) {
        const analysis = await getAuditRunAnalysis(auditRunId);
        if (analysis.status === "failed") {
            await resumeAuditAfterCursorFailure({
                auditRunId,
                errorCode: analysis.lastErrorCode,
                errorMessage: analysis.lastError,
            });
            count += 1;
        }
    }

    // Safety net: waiting jobs whose Cursor analysis already completed but resume was interrupted.
    const waitingJobs = await AuditJob.find({ status: "waiting_for_external" })
        .select({ _id: 1, auditRunId: 1 })
        .limit(50)
        .lean();

    for (const doc of waitingJobs) {
        const auditRunId = String(doc.auditRunId);
        if (uniqueIds.includes(auditRunId)) {
            continue;
        }
        const analysis = await getAuditRunAnalysis(auditRunId);
        if (analysis.status === "completed" && analysis.result) {
            const { resumeAuditAfterCursorCallback } = await import(
                "@/src/services/audit-pipeline/resume-audit-after-cursor"
            );
            await resumeAuditAfterCursorCallback({
                auditRunId,
                result: analysis.result,
            });
            count += 1;
        } else if (analysis.status === "failed") {
            await resumeAuditAfterCursorFailure({
                auditRunId,
                errorCode: analysis.lastErrorCode,
                errorMessage: analysis.lastError,
            });
            count += 1;
        }
    }

    return count;
}

export async function runAuditWorkerCycle(): Promise<{
    processedJobs: number;
    recovered: Awaited<ReturnType<typeof recoverStaleAuditJobs>>;
}> {
    await connectToDatabase();
    const recovered = await recoverStaleAuditJobs();

    const claimed = await claimQueuedAuditJob();
    if (!claimed) {
        return { processedJobs: 0, recovered };
    }

    await runAuditPipeline(claimed.id);
    return { processedJobs: 1, recovered };
}
