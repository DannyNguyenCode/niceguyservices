import "server-only";

import {
    completeAuditJob,
    getAuditJobById,
    markAuditJobProcessing,
    parkAuditJobWaitingForExternal,
    toExecutionContext,
    touchAuditJobHeartbeat,
    updateAuditJobProgress,
    updateAuditJobStage,
} from "@/src/data/audit-jobs";
import {
    deriveJobStatusFromStages,
    isTerminalJobStatus,
    isWaitingJobStatus,
} from "@/src/services/audit-pipeline/state";
import { updateAuditRunStatus } from "@/src/data/audit-runs";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import { runAuditStage } from "@/src/services/audit-pipeline/run-audit-stage";
import { withAuditJobHeartbeat } from "@/src/services/audit-pipeline/job-heartbeat";
import {
    computePipelineProgress,
    getNextPipelineStage,
    hasWaitingPipelineStage,
    isStageRequired,
    markSkippedStages,
    resolveEnabledPipelineStages,
} from "@/src/services/audit-pipeline/stage-plan";
import type { AuditPipelineStageName, SerializableAuditJob } from "@/src/services/audit-pipeline/types";
import { getPublicReportDraftForAuditRun } from "@/src/data/public-reports";
import { syncWebsiteAuditSummary } from "@/src/services/audit-pipeline/sync-website-summary";

async function initializeSkippedStages(job: SerializableAuditJob): Promise<void> {
    for (const stage of markSkippedStages(job.configuration)) {
        if (job.stages[stage].status === "pending") {
            await updateAuditJobStage({
                jobId: job.id,
                stage,
                status: "skipped",
            });
        }
    }
}

export async function runAuditPipeline(jobId: string): Promise<SerializableAuditJob | null> {
    let job = await getAuditJobById(jobId);
    if (!job || job.status === "cancelled" || isTerminalJobStatus(job.status)) {
        return job;
    }

    // Waiting jobs are resumed explicitly after Cursor callback — do not re-enter here.
    if (isWaitingJobStatus(job.status)) {
        return job;
    }

    await initializeSkippedStages(job);
    job = (await getAuditJobById(jobId)) ?? job;
    await markAuditJobProcessing(jobId);
    job = (await getAuditJobById(jobId)) ?? job;
    const context = toExecutionContext(job);

    if (job.status === "queued") {
        await updateAuditRunStatus(job.auditRunId, "crawling");
    }

    while (true) {
        job = (await getAuditJobById(jobId)) ?? job;
        if (!job || job.status === "cancelled") {
            return job;
        }

        if (hasWaitingPipelineStage(job.stages)) {
            break;
        }

        const nextStage = getNextPipelineStage({
            configuration: job.configuration,
            stages: job.stages,
        });
        if (!nextStage) {
            break;
        }

        await touchAuditJobHeartbeat(jobId);
        const currentStageState = job.stages[nextStage];
        if (currentStageState.status === "pending" || currentStageState.status === "failed") {
            await updateAuditJobStage({
                jobId,
                stage: nextStage,
                status: "queued",
            });
        }
        if (currentStageState.status !== "processing") {
            await updateAuditJobStage({
                jobId,
                stage: nextStage,
                status: "processing",
                incrementAttempt: true,
            });
        }

        const result = await withAuditJobHeartbeat(jobId, () =>
            runAuditStage(nextStage, context),
        );
        await updateAuditJobStage({
            jobId,
            stage: nextStage,
            status: result.status,
            errorCode: result.errorCode ?? null,
            errorMessage: result.errorMessage ?? null,
        });

        job = (await getAuditJobById(jobId)) ?? job;
        const progress = computePipelineProgress(job.configuration, job.stages);
        await updateAuditJobProgress({
            jobId,
            progressPercent: progress,
            currentStage: nextStage,
        });

        if (result.status === "waiting_for_external") {
            const parked = await parkAuditJobWaitingForExternal(jobId);
            await updateAuditRunStatus(job.auditRunId, "generating-ai-analysis");
            await syncWebsiteAuditSummary(job.websiteId);
            await createActivityEvent({
                websiteId: job.websiteId,
                auditRunId: job.auditRunId,
                eventType: "ai-analysis-started",
                title: "Waiting for Cursor analysis",
                description:
                    "Deterministic audit stages finished. Audit is waiting for authenticated Cursor callback before finalization.",
                actor: { type: "system" },
                metadata: { jobId, stage: nextStage },
            });
            return parked;
        }

        const required = isStageRequired(nextStage, job.configuration);
        if (required && result.status === "failed") {
            const failedJob = await completeAuditJob({
                jobId,
                status: "failed",
                error: {
                    code: result.errorCode ?? "AUDIT_STAGE_FAILED",
                    message: result.errorMessage ?? "Audit stage failed.",
                    retryable: result.retryable ?? true,
                },
            });
            await updateAuditRunStatus(job.auditRunId, "failed");
            await syncWebsiteAuditSummary(job.websiteId);
            await createActivityEvent({
                websiteId: job.websiteId,
                auditRunId: job.auditRunId,
                eventType: "audit-run-failed",
                title: "Audit failed",
                description: result.errorMessage ?? "Audit pipeline failed.",
                actor: { type: "system" },
                metadata: { jobId, stage: nextStage, errorCode: result.errorCode },
            });
            return failedJob;
        }
    }

    job = (await getAuditJobById(jobId)) ?? job;
    if (hasWaitingPipelineStage(job.stages) || isWaitingJobStatus(job.status)) {
        return (await parkAuditJobWaitingForExternal(jobId)) ?? job;
    }

    const enabledStages = resolveEnabledPipelineStages(job.configuration);
    const stageSummary = enabledStages.map((stage: AuditPipelineStageName) => ({
        required: isStageRequired(stage, job.configuration),
        status: job.stages[stage].status,
    }));
    const finalStatus = deriveJobStatusFromStages(stageSummary);
    if (
        finalStatus === "queued" ||
        finalStatus === "processing" ||
        finalStatus === "waiting_for_external"
    ) {
        if (finalStatus === "waiting_for_external") {
            return (await parkAuditJobWaitingForExternal(jobId)) ?? job;
        }
        return job;
    }

    const reportDraft =
        (await getPublicReportDraftForAuditRun(job.auditRunId))?.id ?? job.reportDraftId;

    const completedJob = await completeAuditJob({
        jobId,
        status: finalStatus,
        reportDraftId: reportDraft,
    });

    await updateAuditRunStatus(
        job.auditRunId,
        finalStatus === "completed_with_warnings"
            ? "partial"
            : finalStatus === "completed"
              ? "complete"
              : "failed",
    );
    await syncWebsiteAuditSummary(job.websiteId);

    await createActivityEvent({
        websiteId: job.websiteId,
        auditRunId: job.auditRunId,
        eventType:
            finalStatus === "completed"
                ? "audit-run-completed"
                : finalStatus === "completed_with_warnings"
                  ? "audit-run-partial"
                  : "audit-run-failed",
        title: `Audit ${finalStatus}`,
        description: `Audit pipeline finished with status ${finalStatus}.`,
        actor: { type: "system" },
        metadata: { jobId, status: finalStatus },
    });

    return completedJob;
}
