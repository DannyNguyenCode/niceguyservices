import "server-only";

import { connectToDatabase } from "@/src/lib/mongodb";
import { AuditRun } from "@/src/models/AuditRun";
import {
    markAuditRunAnalysisFailed,
    type SerializableAuditRunAnalysis,
} from "@/src/data/audit-run-analysis";
import { getCursorAnalysisConfig } from "@/src/services/cursor-analysis/config";
import { ANALYSIS_ERROR_CODES } from "@/src/services/cursor-analysis/constants";
import { logAnalysisEvent } from "@/src/services/cursor-analysis/logging";

export type StaleAnalysisRecoveryResult = {
    auditRunId: string;
    analysisRequestId: string;
    previousStatus: string;
    action: "marked_retry_pending" | "marked_failed";
    errorCode: string;
};

export type RecoverStaleAnalysesSummary = {
    scanned: number;
    recovered: StaleAnalysisRecoveryResult[];
};

function minutesAgo(minutes: number): Date {
    return new Date(Date.now() - minutes * 60 * 1000);
}

function isStaleQueued(analysis: SerializableAuditRunAnalysis, threshold: Date): boolean {
    if (analysis.status !== "queued" || !analysis.queuedAt) return false;
    return new Date(analysis.queuedAt) < threshold;
}

function isStaleActive(analysis: SerializableAuditRunAnalysis, threshold: Date): boolean {
    if (!["triggered", "analyzing", "validating"].includes(analysis.status)) return false;
    const reference =
        analysis.analyzingAt ??
        analysis.triggeredAt ??
        analysis.queuedAt;
    if (!reference) return false;
    return new Date(reference) < threshold;
}

export async function recoverStaleAnalyses(input?: {
    limit?: number;
    preserveForRetry?: boolean;
}): Promise<RecoverStaleAnalysesSummary> {
    const config = getCursorAnalysisConfig();
    const queuedThreshold = minutesAgo(config.queuedTimeoutMinutes);
    const activeThreshold = minutesAgo(config.activeTimeoutMinutes);
    const limit = input?.limit ?? 100;

    await connectToDatabase();

    const candidates = await AuditRun.find({
        "analysis.status": { $in: ["queued", "triggered", "analyzing", "validating"] },
    })
        .select({ _id: 1, analysis: 1 })
        .limit(limit)
        .lean();

    const recovered: StaleAnalysisRecoveryResult[] = [];

    for (const doc of candidates) {
        const auditRunId = String(doc._id);
        const analysis = doc.analysis as Record<string, unknown> | undefined;
        if (!analysis) continue;

        const serialized: SerializableAuditRunAnalysis = {
            status: String(analysis.status) as SerializableAuditRunAnalysis["status"],
            provider: analysis.provider ? String(analysis.provider) : null,
            attempt: Number(analysis.attempt ?? 0),
            analysisRequestId: analysis.analysisRequestId
                ? String(analysis.analysisRequestId)
                : null,
            queuedAt: analysis.queuedAt
                ? new Date(analysis.queuedAt as Date).toISOString()
                : null,
            triggeredAt: analysis.triggeredAt
                ? new Date(analysis.triggeredAt as Date).toISOString()
                : null,
            analyzingAt: analysis.analyzingAt
                ? new Date(analysis.analyzingAt as Date).toISOString()
                : null,
            validatingAt: analysis.validatingAt
                ? new Date(analysis.validatingAt as Date).toISOString()
                : null,
            completedAt: analysis.completedAt
                ? new Date(analysis.completedAt as Date).toISOString()
                : null,
            failedAt: analysis.failedAt
                ? new Date(analysis.failedAt as Date).toISOString()
                : null,
            promptVersion: String(analysis.promptVersion ?? "1.1"),
            packageVersion: String(analysis.packageVersion ?? "1.1"),
            externalJobId: analysis.externalJobId ? String(analysis.externalJobId) : null,
            lastError: analysis.lastError ? String(analysis.lastError) : null,
            lastErrorCode: analysis.lastErrorCode ? String(analysis.lastErrorCode) : null,
            failureHistory: [],
            statusHistory: [],
            packageFirstAccessedAt: null,
            packageLastAccessedAt: null,
            packageAccessCount: Number(analysis.packageAccessCount ?? 0),
            result: null,
        };

        if (!serialized.analysisRequestId) continue;

        const staleQueued = isStaleQueued(serialized, queuedThreshold);
        const staleActive = isStaleActive(serialized, activeThreshold);
        if (!staleQueued && !staleActive) continue;

        const errorCode = staleQueued
            ? ANALYSIS_ERROR_CODES.ANALYSIS_QUEUED_TIMEOUT
            : ANALYSIS_ERROR_CODES.ANALYSIS_CALLBACK_TIMEOUT;
        const message = staleQueued
            ? "Analysis request timed out while queued."
            : "Analysis request timed out before callback completion.";

        const preserveForRetry =
            input?.preserveForRetry ?? serialized.attempt < config.maxAttempts;

        await markAuditRunAnalysisFailed({
            auditRunId,
            analysisRequestId: serialized.analysisRequestId,
            error: message,
            errorCode,
            preserveForRetry,
        });

        logAnalysisEvent("analysis_timeout", {
            auditId: auditRunId,
            analysisRequestId: serialized.analysisRequestId,
            status: serialized.status,
            errorCode,
            attempt: serialized.attempt,
        });

        recovered.push({
            auditRunId,
            analysisRequestId: serialized.analysisRequestId,
            previousStatus: serialized.status,
            action: preserveForRetry ? "marked_retry_pending" : "marked_failed",
            errorCode,
        });
    }

    return {
        scanned: candidates.length,
        recovered,
    };
}
