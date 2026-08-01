import "server-only";

import crypto from "node:crypto";
import mongoose from "mongoose";
import { connectToDatabase } from "@/src/lib/mongodb";
import { AuditRun } from "@/src/models/AuditRun";
import { getAuditRunById } from "@/src/data/audit-runs";
import type { CursorAnalysisStatus } from "@/src/services/cursor-analysis/constants";
import { ACTIVE_CURSOR_ANALYSIS_STATUSES } from "@/src/services/cursor-analysis/constants";
import type { CursorAuditResult } from "@/src/services/cursor-analysis/schemas";
import type { SerializableAuditRunAnalysis } from "@/src/services/cursor-analysis/types";

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
                  failedAt: toIsoString(record.failedAt) ?? new Date(0).toISOString(),
              };
          })
        : [];

    return {
        status: (analysis.status as CursorAnalysisStatus) ?? "not_started",
        provider: analysis.provider ? String(analysis.provider) : null,
        attempt: Number(analysis.attempt ?? 0),
        analysisRequestId: analysis.analysisRequestId ? String(analysis.analysisRequestId) : null,
        triggeredAt: toIsoString(analysis.triggeredAt),
        completedAt: toIsoString(analysis.completedAt),
        promptVersion: String(analysis.promptVersion ?? "1.0"),
        packageVersion: String(analysis.packageVersion ?? "1.0"),
        externalJobId: analysis.externalJobId ? String(analysis.externalJobId) : null,
        lastError: analysis.lastError ? String(analysis.lastError) : null,
        failureHistory,
        result: (analysis.result as CursorAuditResult | null) ?? null,
    };
}

export function createAnalysisRequestId(): string {
    return crypto.randomUUID();
}

export async function getAuditRunAnalysis(
    auditRunId: string,
): Promise<SerializableAuditRunAnalysis | null> {
    const auditRun = await getAuditRunById(auditRunId);
    if (!auditRun?.analysis) {
        return {
            status: "not_started",
            provider: null,
            attempt: 0,
            analysisRequestId: null,
            triggeredAt: null,
            completedAt: null,
            promptVersion: "1.0",
            packageVersion: "1.0",
            externalJobId: null,
            lastError: null,
            failureHistory: [],
            result: null,
        };
    }
    return auditRun.analysis;
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
                "analysis.triggeredAt": null,
                "analysis.completedAt": null,
                "analysis.promptVersion": input.promptVersion,
                "analysis.packageVersion": input.packageVersion,
                "analysis.externalJobId": null,
                "analysis.lastError": null,
                "analysis.result": null,
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
    await connectToDatabase();
    const updated = await AuditRun.findOneAndUpdate(
        {
            _id: assertObjectId(input.auditRunId),
            "analysis.analysisRequestId": input.analysisRequestId,
            "analysis.status": "queued",
        },
        {
            $set: {
                "analysis.status": "triggered",
                "analysis.triggeredAt": new Date(),
                "analysis.externalJobId": input.externalJobId ?? null,
            },
        },
        { new: true },
    ).lean();

    return updated ? serializeAnalysis(updated.analysis as Record<string, unknown>) : null;
}

export async function markAuditRunAnalysisFailed(input: {
    auditRunId: string;
    analysisRequestId: string;
    error: string;
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

    const attempt = Number((existing.analysis as { attempt?: number })?.attempt ?? 0);
    const updated = await AuditRun.findOneAndUpdate(
        {
            _id: assertObjectId(input.auditRunId),
            "analysis.analysisRequestId": input.analysisRequestId,
        },
        {
            $set: {
                "analysis.status": status,
                "analysis.lastError": sanitizedError,
            },
            $push: {
                "analysis.failureHistory": {
                    attempt,
                    analysisRequestId: input.analysisRequestId,
                    error: sanitizedError,
                    failedAt: new Date(),
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
    await connectToDatabase();
    const result = await AuditRun.findOneAndUpdate(
        {
            _id: assertObjectId(input.auditRunId),
            "analysis.analysisRequestId": input.analysisRequestId,
            "analysis.status": { $in: ["triggered", "analyzing", "queued"] },
        },
        { $set: { "analysis.status": "validating" } },
    );
    return Boolean(result);
}

export async function completeAuditRunAnalysis(input: {
    auditRunId: string;
    analysisRequestId: string;
    result: CursorAuditResult;
}): Promise<SerializableAuditRunAnalysis | null> {
    await connectToDatabase();
    const updated = await AuditRun.findOneAndUpdate(
        {
            _id: assertObjectId(input.auditRunId),
            "analysis.analysisRequestId": input.analysisRequestId,
            "analysis.status": { $in: ["validating", "triggered", "analyzing", "queued"] },
        },
        {
            $set: {
                "analysis.status": "completed",
                "analysis.completedAt": new Date(),
                "analysis.result": input.result,
                "analysis.lastError": null,
            },
        },
        { new: true },
    ).lean();

    return updated ? serializeAnalysis(updated.analysis as Record<string, unknown>) : null;
}

export function isActiveAuditRunAnalysis(status: CursorAnalysisStatus): boolean {
    return ACTIVE_CURSOR_ANALYSIS_STATUSES.includes(status);
}
