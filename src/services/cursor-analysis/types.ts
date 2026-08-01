import type { CursorAnalysisStatus } from "@/src/services/cursor-analysis/constants";
import type { CursorAuditResult } from "@/src/services/cursor-analysis/schemas";

export type AuditRunAnalysisFailureRecord = {
    attempt: number;
    analysisRequestId: string;
    error: string;
    failedAt: string;
};

export type SerializableAuditRunAnalysis = {
    status: CursorAnalysisStatus;
    provider: string | null;
    attempt: number;
    analysisRequestId: string | null;
    triggeredAt: string | null;
    completedAt: string | null;
    promptVersion: string;
    packageVersion: string;
    externalJobId: string | null;
    lastError: string | null;
    failureHistory: AuditRunAnalysisFailureRecord[];
    result: CursorAuditResult | null;
};
