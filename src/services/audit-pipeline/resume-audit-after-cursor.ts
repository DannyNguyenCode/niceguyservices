import "server-only";

import {
    getAuditJobByAuditRunId,
    resumeWaitingAuditJob,
    updateAuditJobStage,
} from "@/src/data/audit-jobs";
import { getPublicReportDraftForAuditRun } from "@/src/data/public-reports";
import { updateAuditRunStage } from "@/src/services/audit-history/finalize-audit-run";
import { createReportDraftFromAuditRun } from "@/src/services/audit-pipeline/create-report-draft-from-audit-run";
import { runAuditPipeline } from "@/src/services/audit-pipeline/run-audit-pipeline";
import { isTerminalJobStatus } from "@/src/services/audit-pipeline/state";
import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";
import { materializeAiSummaryFromCursorResult } from "@/src/services/cursor-analysis/materialize-ai-summary-from-cursor";
import type { CursorAuditResult } from "@/src/services/cursor-analysis/schemas";
import { logAnalysisError, logAnalysisEvent } from "@/src/services/cursor-analysis/logging";

export type ResumeAfterCursorResult = {
    ok: boolean;
    job: SerializableAuditJob | null;
    resumed: boolean;
    reason?: string;
};

/**
 * After a validated Cursor callback is persisted:
 * 1. Mark AuditRun AI completion complete
 * 2. Materialize compatibility AiSummary from the canonical Cursor result
 * 3. Mark ai_analysis stage complete
 * 4. Resume finalize + report_draft
 *
 * Idempotent for duplicate callbacks.
 */
export async function resumeAuditAfterCursorCallback(input: {
    auditRunId: string;
    result: CursorAuditResult;
}): Promise<ResumeAfterCursorResult> {
    await updateAuditRunStage(input.auditRunId, "ai", "complete");

    try {
        await materializeAiSummaryFromCursorResult({
            auditRunId: input.auditRunId,
            result: input.result,
        });
    } catch (error) {
        logAnalysisError(
            "ai_summary_materialization_failed",
            { auditId: input.auditRunId, errorCode: "AI_SUMMARY_MATERIALIZE_FAILED" },
            error instanceof Error ? error.message : "materialization failed",
        );
    }

    const job = await getAuditJobByAuditRunId(input.auditRunId);
    if (!job) {
        return { ok: true, job: null, resumed: false, reason: "NO_AUDIT_JOB" };
    }

    if (job.stages.ai_analysis.status === "waiting_for_external") {
        await updateAuditJobStage({
            jobId: job.id,
            stage: "ai_analysis",
            status: "completed",
            errorCode: null,
            errorMessage: null,
        });
    } else if (job.stages.ai_analysis.status === "processing") {
        await updateAuditJobStage({
            jobId: job.id,
            stage: "ai_analysis",
            status: "completed",
        });
    }

    if (job.status === "waiting_for_external") {
        await resumeWaitingAuditJob(job.id);
        logAnalysisEvent("audit_pipeline_resumed", {
            auditId: input.auditRunId,
            analysisRequestId: input.result.analysisRequestId,
            status: "completed",
        });
        const resumed = await runAuditPipeline(job.id);
        return { ok: true, job: resumed, resumed: true };
    }

    if (isTerminalJobStatus(job.status) && job.configuration.generateReportDraft) {
        const existingReport = await getPublicReportDraftForAuditRun(input.auditRunId);
        if (!existingReport) {
            const report = await createReportDraftFromAuditRun({
                auditRunId: input.auditRunId,
                websiteId: job.websiteId,
            });
            if (!report.success) {
                logAnalysisError(
                    "report_draft_retry_failed",
                    {
                        auditId: input.auditRunId,
                        errorCode: report.error.code,
                    },
                    report.error.message,
                );
            }
        }
    }

    return { ok: true, job, resumed: false, reason: "ALREADY_ADVANCED" };
}

/**
 * When Cursor analysis permanently fails while an AuditJob is waiting, continue
 * finalization with AI marked as failed/warnings rather than leaving the job parked forever.
 */
export async function resumeAuditAfterCursorFailure(input: {
    auditRunId: string;
    errorCode?: string | null;
    errorMessage?: string | null;
}): Promise<ResumeAfterCursorResult> {
    await updateAuditRunStage(input.auditRunId, "ai", "failed");

    const job = await getAuditJobByAuditRunId(input.auditRunId);
    if (!job) {
        return { ok: true, job: null, resumed: false, reason: "NO_AUDIT_JOB" };
    }

    if (job.stages.ai_analysis.status === "waiting_for_external") {
        await updateAuditJobStage({
            jobId: job.id,
            stage: "ai_analysis",
            status: "completed_with_warnings",
            errorCode: input.errorCode ?? "CURSOR_ANALYSIS_FAILED",
            errorMessage: input.errorMessage ?? "Cursor analysis failed.",
        });
    }

    if (job.status === "waiting_for_external") {
        await resumeWaitingAuditJob(job.id);
        const resumed = await runAuditPipeline(job.id);
        return { ok: true, job: resumed, resumed: true };
    }

    return { ok: true, job, resumed: false, reason: "ALREADY_ADVANCED" };
}
