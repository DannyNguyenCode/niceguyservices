import "server-only";

import { connectToDatabase } from "@/src/lib/mongodb";
import {
    claimQueuedAuditJob,
    recoverStaleAuditPipelineJobs,
} from "@/src/data/audit-jobs";
import { recoverLegacyStageJobs } from "@/src/services/audit-jobs/audit-worker";
import { runAuditPipeline } from "@/src/services/audit-pipeline/run-audit-pipeline";

export async function recoverStaleAuditJobs(): Promise<{
    pipelineJobs: number;
    crawls: number;
    pagespeed: number;
    niceguy: number;
}> {
    await connectToDatabase();
    const [pipelineJobs, legacy] = await Promise.all([
        recoverStaleAuditPipelineJobs(),
        recoverLegacyStageJobs(),
    ]);
    return {
        pipelineJobs,
        ...legacy,
    };
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
