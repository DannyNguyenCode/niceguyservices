import "server-only";

import { getAuditJobById } from "@/src/data/audit-jobs";
import { shouldExecuteAuditStageSynchronously } from "@/src/services/audit-jobs/stage-execution";
import { runAuditPipeline } from "@/src/services/audit-pipeline/run-audit-pipeline";
import { isTerminalJobStatus } from "@/src/services/audit-pipeline/state";
import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";

export async function maybeRunAuditPipelineSynchronously(
    job: SerializableAuditJob,
): Promise<SerializableAuditJob> {
    if (!shouldExecuteAuditStageSynchronously()) {
        return job;
    }

    if (isTerminalJobStatus(job.status)) {
        return job;
    }

    return (await runAuditPipeline(job.id)) ?? job;
}

export async function maybeRunAuditPipelineSynchronouslyById(
    jobId: string,
): Promise<SerializableAuditJob | null> {
    const job = await getAuditJobById(jobId);
    if (!job) {
        return null;
    }
    return maybeRunAuditPipelineSynchronously(job);
}
