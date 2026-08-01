import type {
    AUDIT_PIPELINE_STAGES,
    AUDIT_STAGE_STATUSES,
    ACTIVE_AUDIT_JOB_STATUSES,
    TERMINAL_AUDIT_JOB_STATUSES,
} from "@/src/services/audit-pipeline/constants";

export type AuditPipelineStageName = (typeof AUDIT_PIPELINE_STAGES)[number];

export type AuditJobStatus =
    | (typeof ACTIVE_AUDIT_JOB_STATUSES)[number]
    | (typeof TERMINAL_AUDIT_JOB_STATUSES)[number];

export type AuditStageStatus = (typeof AUDIT_STAGE_STATUSES)[number];

export type AuditConfigurationSnapshot = {
    crawlMaxPages: number | null;
    crawlMaxDepth: number | null;
    includeScreenshots: boolean;
    includePageSpeed: boolean;
    includeNiceGuyMetrics: boolean;
    includeAiAnalysis: boolean;
    generateReportDraft: boolean;
    pageSpeedStrategies: Array<"mobile" | "desktop">;
    configurationVersion: string;
};

export type AuditStageState = {
    status: AuditStageStatus;
    attempt: number;
    startedAt: Date | null;
    heartbeatAt: Date | null;
    completedAt: Date | null;
    errorCode: string | null;
    errorMessage: string | null;
};

export type SanitizedJobError = {
    code: string;
    message: string;
    retryable: boolean;
};

export type SerializableAuditJob = {
    id: string;
    websiteId: string;
    auditRunId: string;
    idempotencyKey: string;
    status: AuditJobStatus;
    currentStage: AuditPipelineStageName | null;
    progressPercent: number;
    attempt: number;
    maxAttempts: number;
    queuedAt: string;
    startedAt: string | null;
    heartbeatAt: string | null;
    completedAt: string | null;
    failedAt: string | null;
    cancelledAt: string | null;
    error: SanitizedJobError | null;
    configuration: AuditConfigurationSnapshot;
    packageVersion: string;
    stages: Record<AuditPipelineStageName, AuditStageState>;
    reportDraftId: string | null;
    createdAt: string;
    updatedAt: string;
};

export type AuditExecutionContext = {
    jobId: string;
    auditRunId: string;
    websiteId: string;
    configuration: AuditConfigurationSnapshot;
    attempt: number;
};

export type AuditStageResult = {
    status: Extract<AuditStageStatus, "completed" | "completed_with_warnings" | "failed" | "skipped">;
    errorCode?: string | null;
    errorMessage?: string | null;
    retryable?: boolean;
};
