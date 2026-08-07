import "server-only";

import crypto from "node:crypto";
import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { AuditRun } from "@/src/models/AuditRun";
import { getAuditRunById } from "@/src/data/audit-runs";
import type { CursorAnalysisStatus } from "@/src/services/cursor-analysis/constants";
import { ACTIVE_CURSOR_ANALYSIS_STATUSES } from "@/src/services/cursor-analysis/constants";
import type { CursorAuditResult } from "@/src/services/cursor-analysis/schemas";
import type {
    AuditRunAnalysisFailureRecord,
    AuditRunAnalysisStatusTransition,
    SerializableAuditRunAnalysis,
} from "@/src/services/cursor-analysis/types";
import { assertAnalysisTransition } from "@/src/services/cursor-analysis/state-machine";

function assertObjectId(id: string): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid audit run ID.");
    }
    return new mongoose.Types.ObjectId(id);
}

function toIsoString(value: unknown): string | null {
    if (value == null) return null;
    const date = value instanceof Date ? value : new Date(value as string);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString();
}

function serializeAnalysis(doc: Record<string, unknown> | null | undefined): SerializableAuditRunAnalysis {
    const analysis = (doc ?? {}) as Record<string, unknown>;
    const failureHistory = Array.isArray(analysis.failureHistory)
        ? analysis.failureHistory.map((entry) => {
              const record = entry as Record<string, unknown>;
              return {
                  attempt: Number(record.attempt ?? 0),
                  analysisRequestId: String(record.analysisRequestId ?? ""),
                  error: String(record.error ?? ""),
                  errorCode: record.errorCode ? String(record.errorCode) : undefined,
                  failedAt: toIsoString(record.failedAt) ?? new Date(0).toISOString(),
              } satisfies AuditRunAnalysisFailureRecord;
          })
        : [];

    const statusHistory = Array.isArray(analysis.statusHistory)
        ? analysis.statusHistory.map((entry) => {
              const record = entry as Record<string, unknown>;
              return {
                  from: String(record.from) as CursorAnalysisStatus,
                  to: String(record.to) as CursorAnalysisStatus,
                  at: toIsoString(record.at) ?? new Date(0).toISOString(),
              } satisfies AuditRunAnalysisStatusTransition;
          })
        : [];

    return {
        status: (analysis.status as CursorAnalysisStatus) ?? "not_started",
        provider: analysis.provider ? String(analysis.provider) : null,
        attempt: Number(analysis.attempt ?? 0),
        analysisRequestId: analysis.analysisRequestId ? String(analysis.analysisRequestId) : null,
        queuedAt: toIsoString(analysis.queuedAt),
        triggeredAt: toIsoString(analysis.triggeredAt),
        analyzingAt: toIsoString(analysis.analyzingAt),
        validatingAt: toIsoString(analysis.validatingAt),
        completedAt: toIsoString(analysis.completedAt),
        failedAt: toIsoString(analysis.failedAt),
        promptVersion: String(analysis.promptVersion ?? "1.1"),
        packageVersion: String(analysis.packageVersion ?? "1.1"),
        externalJobId: analysis.externalJobId ? String(analysis.externalJobId) : null,
        lastError: analysis.lastError ? String(analysis.lastError) : null,
        lastErrorCode: analysis.lastErrorCode ? String(analysis.lastErrorCode) : null,
        failureHistory,
        statusHistory,
        packageFirstAccessedAt: toIsoString(analysis.packageFirstAccessedAt),
        packageLastAccessedAt: toIsoString(analysis.packageLastAccessedAt),
        packageAccessCount: Number(analysis.packageAccessCount ?? 0),
        result: (analysis.result as CursorAuditResult | null) ?? null,
    };
}

function defaultAnalysis(): SerializableAuditRunAnalysis {
    return {
        status: "not_started",
        provider: null,
        attempt: 0,
        analysisRequestId: null,
        queuedAt: null,
        triggeredAt: null,
        analyzingAt: null,
        validatingAt: null,
        completedAt: null,
        failedAt: null,
        promptVersion: "1.1",
        packageVersion: "1.1",
        externalJobId: null,
        lastError: null,
        lastErrorCode: null,
        failureHistory: [],
        statusHistory: [],
        packageFirstAccessedAt: null,
        packageLastAccessedAt: null,
        packageAccessCount: 0,
        result: null,
    };
}

export function createAnalysisRequestId(): string {
    return crypto.randomUUID();
}

export async function getAuditRunAnalysis(
    auditRunId: string,
): Promise<SerializableAuditRunAnalysis> {
    const auditRun = await getAuditRunById(auditRunId);
    if (!auditRun?.analysis) {
        return defaultAnalysis();
    }
    return auditRun.analysis;
}

async function recordStatusTransition(input: {
    auditRunId: string;
    analysisRequestId: string;
    from: CursorAnalysisStatus;
    to: CursorAnalysisStatus;
    timestampField?: string;
    extraSet?: Record<string, unknown>;
}): Promise<SerializableAuditRunAnalysis | null> {
    assertAnalysisTransition(input.from, input.to);
    await connectToDatabase();

    const now = new Date();
    const setFields: Record<string, unknown> = {
        "analysis.status": input.to,
        ...(input.timestampField ? { [`analysis.${input.timestampField}`]: now } : {}),
        ...input.extraSet,
    };

    const updated = await AuditRun.findOneAndUpdate(
        {
            _id: assertObjectId(input.auditRunId),
            "analysis.analysisRequestId": input.analysisRequestId,
            "analysis.status": input.from,
        },
        {
            $set: setFields,
            $push: {
                "analysis.statusHistory": {
                    from: input.from,
                    to: input.to,
                    at: now,
                },
            },
        },
        { new: true },
    ).lean();

    return updated ? serializeAnalysis(updated.analysis as Record<string, unknown>) : null;
}

export async function queueAuditRunAnalysis(input: {
    auditRunId: string;
    analysisRequestId: string;
    provider: string;
    attempt: number;
    promptVersion: string;
    packageVersion: string;
}): Promise<SerializableAuditRunAnalysis> {
    await connectToDatabase();
    const objectId = assertObjectId(input.auditRunId);
    const now = new Date();

    const existing = await AuditRun.findById(objectId).select("analysis.status").lean();
    const fromStatus = (existing?.analysis as { status?: CursorAnalysisStatus } | undefined)
        ?.status ?? "not_started";

    if (ACTIVE_CURSOR_ANALYSIS_STATUSES.includes(fromStatus)) {
        throw new Error("ANALYSIS_ALREADY_ACTIVE");
    }

    if (fromStatus !== "not_started" && fromStatus !== "retry_pending") {
        throw new Error(`INVALID_ANALYSIS_TRANSITION: ${fromStatus} -> queued`);
    }

    assertAnalysisTransition(fromStatus, "queued");

    const updated = await AuditRun.findOneAndUpdate(
        {
            _id: objectId,
            $nor: [{ "analysis.status": { $in: ACTIVE_CURSOR_ANALYSIS_STATUSES } }],
        },
        {
            $set: {
                "analysis.status": "queued",
                "analysis.provider": input.provider,
                "analysis.attempt": input.attempt,
                "analysis.analysisRequestId": input.analysisRequestId,
                "analysis.queuedAt": now,
                "analysis.triggeredAt": null,
                "analysis.analyzingAt": null,
                "analysis.validatingAt": null,
                "analysis.completedAt": null,
                "analysis.failedAt": null,
                "analysis.promptVersion": input.promptVersion,
                "analysis.packageVersion": input.packageVersion,
                "analysis.externalJobId": null,
                "analysis.lastError": null,
                "analysis.lastErrorCode": null,
                "analysis.result": null,
                "analysis.packageFirstAccessedAt": null,
                "analysis.packageLastAccessedAt": null,
                "analysis.packageAccessCount": 0,
            },
            $push: {
                "analysis.statusHistory": {
                    from: fromStatus,
                    to: "queued",
                    at: now,
                },
            },
        },
        { new: true },
    ).lean();

    if (!updated) {
        throw new Error("ANALYSIS_ALREADY_ACTIVE");
    }

    return serializeAnalysis(updated.analysis as Record<string, unknown>);
}

export async function markAuditRunAnalysisTriggered(input: {
    auditRunId: string;
    analysisRequestId: string;
    externalJobId?: string | null;
}): Promise<SerializableAuditRunAnalysis | null> {
    return recordStatusTransition({
        auditRunId: input.auditRunId,
        analysisRequestId: input.analysisRequestId,
        from: "queued",
        to: "triggered",
        timestampField: "triggeredAt",
        extraSet: {
            "analysis.externalJobId": input.externalJobId ?? null,
        },
    });
}

export async function markAuditRunAnalysisAnalyzing(input: {
    auditRunId: string;
    analysisRequestId: string;
}): Promise<SerializableAuditRunAnalysis | null> {
    return recordStatusTransition({
        auditRunId: input.auditRunId,
        analysisRequestId: input.analysisRequestId,
        from: "triggered",
        to: "analyzing",
        timestampField: "analyzingAt",
    });
}

export async function markAuditRunAnalysisFailed(input: {
    auditRunId: string;
    analysisRequestId: string;
    error: string;
    errorCode?: string;
    preserveForRetry?: boolean;
}): Promise<SerializableAuditRunAnalysis | null> {
    await connectToDatabase();
    const sanitizedError = input.error.slice(0, 500);
    const status: CursorAnalysisStatus = input.preserveForRetry ? "retry_pending" : "failed";

    const existing = await AuditRun.findOne({
        _id: assertObjectId(input.auditRunId),
        "analysis.analysisRequestId": input.analysisRequestId,
    }).lean();

    if (!existing) return null;

    const currentStatus = String(
        (existing.analysis as { status?: string })?.status ?? "not_started",
    ) as CursorAnalysisStatus;
    const attempt = Number((existing.analysis as { attempt?: number })?.attempt ?? 0);
    const now = new Date();

    const updated = await AuditRun.findOneAndUpdate(
        {
            _id: assertObjectId(input.auditRunId),
            "analysis.analysisRequestId": input.analysisRequestId,
        },
        {
            $set: {
                "analysis.status": status,
                "analysis.lastError": sanitizedError,
                "analysis.lastErrorCode": input.errorCode ?? null,
                "analysis.failedAt": now,
            },
            $push: {
                "analysis.failureHistory": {
                    attempt,
                    analysisRequestId: input.analysisRequestId,
                    error: sanitizedError,
                    errorCode: input.errorCode ?? null,
                    failedAt: now,
                },
                "analysis.statusHistory": {
                    from: currentStatus,
                    to: status,
                    at: now,
                },
            },
        },
        { new: true },
    ).lean();

    return updated ? serializeAnalysis(updated.analysis as Record<string, unknown>) : null;
}

export async function markAuditRunAnalysisValidating(input: {
    auditRunId: string;
    analysisRequestId: string;
}): Promise<boolean> {
    const fromStatuses: CursorAnalysisStatus[] = ["triggered", "analyzing", "queued"];
    for (const from of fromStatuses) {
        const result = await recordStatusTransition({
            auditRunId: input.auditRunId,
            analysisRequestId: input.analysisRequestId,
            from,
            to: "validating",
            timestampField: "validatingAt",
        });
        if (result) return true;
    }
    return false;
}

export async function completeAuditRunAnalysis(input: {
    auditRunId: string;
    analysisRequestId: string;
    result: CursorAuditResult;
}): Promise<SerializableAuditRunAnalysis | null> {
    await connectToDatabase();
    const now = new Date();

    const updated = await AuditRun.findOneAndUpdate(
        {
            _id: assertObjectId(input.auditRunId),
            "analysis.analysisRequestId": input.analysisRequestId,
            "analysis.status": { $in: ["validating", "triggered", "analyzing", "queued"] },
        },
        {
            $set: {
                "analysis.status": "completed",
                "analysis.completedAt": now,
                "analysis.result": input.result,
                "analysis.lastError": null,
                "analysis.lastErrorCode": null,
            },
            $push: {
                "analysis.statusHistory": {
                    from: "validating",
                    to: "completed",
                    at: now,
                },
            },
        },
        { new: true },
    ).lean();

    return updated ? serializeAnalysis(updated.analysis as Record<string, unknown>) : null;
}

/**
 * Atomic package-access bookkeeping.
 *
 * Uses a MongoDB aggregation update pipeline so we can:
 * - increment access count from null/undefined safely
 * - set first-accessed only when previously unset
 * - always refresh last-accessed
 *
 * Mongoose 9 requires `updatePipeline: true` for array updates (does not cast pipelines).
 */
export function buildPackageAccessUpdatePipeline(now: Date = new Date()) {
    return [
        {
            $set: {
                "analysis.packageAccessCount": {
                    $add: [{ $ifNull: ["$analysis.packageAccessCount", 0] }, 1],
                },
                "analysis.packageFirstAccessedAt": {
                    $ifNull: ["$analysis.packageFirstAccessedAt", now],
                },
                "analysis.packageLastAccessedAt": now,
            },
        },
    ];
}

export async function recordPackageAccess(input: {
    auditRunId: string;
    analysisRequestId: string;
}): Promise<void> {
    await connectToDatabase();
    const now = new Date();

    await AuditRun.findOneAndUpdate(
        {
            _id: assertObjectId(input.auditRunId),
            "analysis.analysisRequestId": input.analysisRequestId,
            "analysis.status": { $in: ACTIVE_CURSOR_ANALYSIS_STATUSES },
        },
        buildPackageAccessUpdatePipeline(now),
        { updatePipeline: true },
    );
}

export function isActiveAuditRunAnalysis(status: CursorAnalysisStatus): boolean {
    return ACTIVE_CURSOR_ANALYSIS_STATUSES.includes(status);
}

export { SerializableAuditRunAnalysis };
