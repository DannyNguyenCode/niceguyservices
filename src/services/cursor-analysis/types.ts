import type { CursorAnalysisStatus } from "@/src/services/cursor-analysis/constants";
import type { CursorAuditResult } from "@/src/services/cursor-analysis/schemas";

export type AuditRunAnalysisFailureRecord = {
    attempt: number;
    analysisRequestId: string;
    error: string;
    errorCode?: string;
    failedAt: string;
};

export type AuditRunAnalysisStatusTransition = {
    from: CursorAnalysisStatus;
    to: CursorAnalysisStatus;
    at: string;
};

export type SerializableAuditRunAnalysis = {
    status: CursorAnalysisStatus;
    provider: string | null;
    attempt: number;
    analysisRequestId: string | null;
    queuedAt: string | null;
    triggeredAt: string | null;
    analyzingAt: string | null;
    validatingAt: string | null;
    completedAt: string | null;
    failedAt: string | null;
    promptVersion: string;
    packageVersion: string;
    externalJobId: string | null;
    lastError: string | null;
    lastErrorCode: string | null;
    failureHistory: AuditRunAnalysisFailureRecord[];
    statusHistory: AuditRunAnalysisStatusTransition[];
    packageFirstAccessedAt: string | null;
    packageLastAccessedAt: string | null;
    packageAccessCount: number;
    result: CursorAuditResult | null;
};
