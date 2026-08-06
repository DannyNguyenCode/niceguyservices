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
import { AuditJobHeartbeatSession } from "@/src/services/audit-pipeline/job-heartbeat";
import {
    computePipelineProgress,
    getReadyPipelineStages,
    hasBlockingRequiredFailure,
    hasWaitingPipelineStage,
    isStageRequired,
    markSkippedStages,
    resolveEnabledPipelineStages,
} from "@/src/services/audit-pipeline/stage-plan";
import type {
    AuditPipelineStageName,
    AuditStageResult,
    SerializableAuditJob,
} from "@/src/services/audit-pipeline/types";
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

async function markStageProcessing(
    jobId: string,
    stage: AuditPipelineStageName,
    currentStatus: string,
): Promise<void> {
    if (currentStatus === "pending" || currentStatus === "failed") {
        await updateAuditJobStage({
            jobId,
            stage,
            status: "queued",
        });
    }
    if (currentStatus !== "processing") {
        await updateAuditJobStage({
            jobId,
            stage,
            status: "processing",
            incrementAttempt: true,
        });
    }
}

type InFlightEntry = {
    stage: AuditPipelineStageName;
    promise: Promise<{ stage: AuditPipelineStageName; result: AuditStageResult }>;
};

/**
 * Durable audit orchestration with overlapping independent stages.
 *
 * Uses a continuous scheduler: whenever any in-flight stage finishes, newly
 * unblocked stages start immediately. Example: NiceGuy can start as soon as
 * crawl completes while PageSpeed is still running.
 */
export async function runAuditPipeline(jobId: string): Promise<SerializableAuditJob | null> {
    let job = await getAuditJobById(jobId);
    if (!job || job.status === "cancelled" || isTerminalJobStatus(job.status)) {
        return job;
    }

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
        await createActivityEvent({
            websiteId: job.websiteId,
            auditRunId: job.auditRunId,
            eventType: "audit-run-started",
            title: "Audit orchestration started",
            description: "Asynchronous audit pipeline began processing.",
            actor: { type: "system" },
            metadata: { jobId },
        });
    }

    const heartbeat = new AuditJobHeartbeatSession(jobId);
    heartbeat.start();

    const inFlight = new Map<AuditPipelineStageName, InFlightEntry>();

    try {
        while (true) {
            job = (await getAuditJobById(jobId)) ?? job;
            if (!job || job.status === "cancelled") {
                return job;
            }

            if (hasWaitingPipelineStage(job.stages) && inFlight.size === 0) {
                break;
            }

            const blockingFailure = hasBlockingRequiredFailure({
                configuration: job.configuration,
                stages: job.stages,
            });
            if (blockingFailure && inFlight.size === 0) {
                const failedJob = await completeAuditJob({
                    jobId,
                    status: "failed",
                    error: {
                        code: job.stages[blockingFailure].errorCode ?? "AUDIT_STAGE_FAILED",
                        message:
                            job.stages[blockingFailure].errorMessage ??
                            `Required stage ${blockingFailure} failed.`,
                        retryable: true,
                    },
                });
                await updateAuditRunStatus(job.auditRunId, "failed");
                await syncWebsiteAuditSummary(job.websiteId);
                await createActivityEvent({
                    websiteId: job.websiteId,
                    auditRunId: job.auditRunId,
                    eventType: "audit-run-failed",
                    title: "Audit failed",
                    description:
                        job.stages[blockingFailure].errorMessage ?? "Audit pipeline failed.",
                    actor: { type: "system" },
                    metadata: { jobId, stage: blockingFailure },
                });
                return failedJob;
            }

            const readyStages = getReadyPipelineStages({
                configuration: job.configuration,
                stages: job.stages,
            }).filter((stage) => !inFlight.has(stage));

            for (const stage of readyStages) {
                await markStageProcessing(jobId, stage, job.stages[stage].status);
                const promise = runAuditStage(stage, context).then(async (result) => {
                    await updateAuditJobStage({
                        jobId,
                        stage,
                        status: result.status,
                        errorCode: result.errorCode ?? null,
                        errorMessage: result.errorMessage ?? null,
                    });
                    return { stage, result };
                });
                inFlight.set(stage, { stage, promise });
            }

            if (inFlight.size === 0) {
                break;
            }

            await touchAuditJobHeartbeat(jobId);
            const settled = await Promise.race(
                [...inFlight.values()].map((entry) => entry.promise),
            );
            inFlight.delete(settled.stage);

            job = (await getAuditJobById(jobId)) ?? job;
            const progress = computePipelineProgress(job.configuration, job.stages);
            await updateAuditJobProgress({
                jobId,
                progressPercent: progress,
                currentStage: settled.stage,
            });

            if (settled.result.status === "waiting_for_external") {
                // Let sibling in-flight stages finish updating, then park.
                if (inFlight.size > 0) {
                    await Promise.allSettled([...inFlight.values()].map((e) => e.promise));
                    inFlight.clear();
                }
                const parked = await parkAuditJobWaitingForExternal(jobId);
                await updateAuditRunStatus(job.auditRunId, "generating-ai-analysis");
                await syncWebsiteAuditSummary(job.websiteId);
                await createActivityEvent({
                    websiteId: job.websiteId,
                    auditRunId: job.auditRunId,
                    eventType: "ai-analysis-started",
                    title: "Waiting for Cursor analysis",
                    description:
                        "Evidence barrier satisfied. Audit is waiting for authenticated Cursor callback before finalization.",
                    actor: { type: "system" },
                    metadata: { jobId, stage: settled.stage },
                });
                return parked;
            }

            const required = isStageRequired(settled.stage, job.configuration);
            if (required && settled.result.status === "failed") {
                if (inFlight.size > 0) {
                    await Promise.allSettled([...inFlight.values()].map((e) => e.promise));
                    inFlight.clear();
                }
                const failedJob = await completeAuditJob({
                    jobId,
                    status: "failed",
                    error: {
                        code: settled.result.errorCode ?? "AUDIT_STAGE_FAILED",
                        message: settled.result.errorMessage ?? "Audit stage failed.",
                        retryable: settled.result.retryable ?? true,
                    },
                });
                await updateAuditRunStatus(job.auditRunId, "failed");
                await syncWebsiteAuditSummary(job.websiteId);
                await createActivityEvent({
                    websiteId: job.websiteId,
                    auditRunId: job.auditRunId,
                    eventType: "audit-run-failed",
                    title: "Audit failed",
                    description: settled.result.errorMessage ?? "Audit pipeline failed.",
                    actor: { type: "system" },
                    metadata: {
                        jobId,
                        stage: settled.stage,
                        errorCode: settled.result.errorCode,
                    },
                });
                return failedJob;
            }
        }
    } finally {
        heartbeat.stop();
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
