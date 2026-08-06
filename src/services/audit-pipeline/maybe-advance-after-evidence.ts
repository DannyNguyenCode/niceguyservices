import "server-only";

import {
    getActiveAuditJobForWebsite,
    getAuditJobByAuditRunId,
    parkAuditJobWaitingForExternal,
    updateAuditJobStage,
} from "@/src/data/audit-jobs";
import { updateAuditRunStatus } from "@/src/data/audit-runs";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import { evaluateAuditEvidenceBarrier } from "@/src/services/audit-pipeline/evidence-barrier";
import { scheduleAuditWorkerKick } from "@/src/services/audit-pipeline/schedule-audit-worker";
import { isTerminalJobStatus, isWaitingJobStatus } from "@/src/services/audit-pipeline/state";
import { requestCursorAnalysisForAuditRun } from "@/src/services/cursor-analysis/request-cursor-analysis";
import { syncWebsiteAuditSummary } from "@/src/services/audit-pipeline/sync-website-summary";

export type MaybeAdvanceOrchestrationResult =
    | { advanced: false; reason: string; blockers?: string[] }
    | {
          advanced: true;
          auditRunId: string;
          analysisRequestId?: string;
          status: string;
      };

/**
 * After manual stage completion (or retry), re-evaluate the evidence barrier
 * and trigger Cursor exactly once when ready — without requiring Save & Start again.
 */
export async function maybeAdvanceOrchestrationAfterEvidenceChange(input: {
    websiteId: string;
    auditRunId?: string | null;
}): Promise<MaybeAdvanceOrchestrationResult> {
    let auditRunId = input.auditRunId ?? null;
    if (!auditRunId) {
        const activeJob = await getActiveAuditJobForWebsite(input.websiteId);
        auditRunId = activeJob?.auditRunId ?? null;
    }
    if (!auditRunId) {
        return { advanced: false, reason: "no_audit_run" };
    }

    const barrier = await evaluateAuditEvidenceBarrier(auditRunId);
    if (!barrier.ready) {
        scheduleAuditWorkerKick("manual-evidence-not-ready");
        return {
            advanced: false,
            reason: "evidence_not_ready",
            blockers: barrier.blockers.map((item) => item.code),
        };
    }

    await createActivityEvent({
        websiteId: input.websiteId,
        auditRunId,
        eventType: "ai-analysis-queued",
        title: "Evidence ready",
        description:
            "Evidence barrier satisfied. Attempting Cursor trigger after stage evidence update.",
        actor: { type: "system" },
        metadata: { source: "manual-or-retry-evidence" },
    });

    const result = await requestCursorAnalysisForAuditRun(auditRunId);
    if (!result.ok) {
        if (result.code === "ANALYSIS_ALREADY_ACTIVE") {
            return {
                advanced: true,
                auditRunId,
                status: "already_active",
            };
        }
        return {
            advanced: false,
            reason: result.code,
            blockers: result.blockers?.map((item) => item.code),
        };
    }

    const job =
        (await getAuditJobByAuditRunId(auditRunId)) ??
        (await getActiveAuditJobForWebsite(input.websiteId));

    if (job && !isTerminalJobStatus(job.status)) {
        const aiStatus = job.stages.ai_analysis.status;
        try {
            if (aiStatus === "pending" || aiStatus === "failed") {
                await updateAuditJobStage({
                    jobId: job.id,
                    stage: "ai_analysis",
                    status: "queued",
                });
                await updateAuditJobStage({
                    jobId: job.id,
                    stage: "ai_analysis",
                    status: "processing",
                    incrementAttempt: true,
                });
            } else if (aiStatus === "queued") {
                await updateAuditJobStage({
                    jobId: job.id,
                    stage: "ai_analysis",
                    status: "processing",
                    incrementAttempt: true,
                });
            }

            if (
                aiStatus === "pending" ||
                aiStatus === "failed" ||
                aiStatus === "queued" ||
                aiStatus === "processing"
            ) {
                await updateAuditJobStage({
                    jobId: job.id,
                    stage: "ai_analysis",
                    status: "waiting_for_external",
                });
            }
        } catch {
            // Stage may already be waiting — continue parking the job.
        }

        if (!isWaitingJobStatus(job.status)) {
            await parkAuditJobWaitingForExternal(job.id);
        }
        await updateAuditRunStatus(auditRunId, "generating-ai-analysis");
        await syncWebsiteAuditSummary(input.websiteId);
    }

    return {
        advanced: true,
        auditRunId,
        analysisRequestId: result.analysisRequestId,
        status: result.status,
    };
}
