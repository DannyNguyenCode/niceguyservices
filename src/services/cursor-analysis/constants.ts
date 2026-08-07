export const CURSOR_ANALYSIS_STATUSES = [
    "not_started",
    "queued",
    "triggered",
    "analyzing",
    "validating",
    "completed",
    "failed",
    "retry_pending",
] as const;

export type CursorAnalysisStatus = (typeof CURSOR_ANALYSIS_STATUSES)[number];

/** Statuses where the signed package endpoint may serve the audit package. */
export const PACKAGE_ACCESS_STATUSES: CursorAnalysisStatus[] = [
    "queued",
    "triggered",
    "analyzing",
    "validating",
];

export const ACTIVE_CURSOR_ANALYSIS_STATUSES: CursorAnalysisStatus[] = [
    "queued",
    "triggered",
    "analyzing",
    "validating",
];

export const TERMINAL_CURSOR_ANALYSIS_STATUSES: CursorAnalysisStatus[] = [
    "completed",
    "failed",
];

export const CURSOR_ANALYSIS_PROVIDER = "cursor-automation";
export const MOCK_ANALYSIS_PROVIDER = "mock";
export const CURSOR_ANALYSIS_METHOD = "cursor-automation";
export const CURSOR_ANALYSIS_EVENT = "audit.analysis.requested";
export const CURSOR_ANALYSIS_SCHEMA_VERSION = "1.1";
export const CURSOR_ANALYSIS_DEFAULT_PACKAGE_VERSION = "1.1";
export const CURSOR_ANALYSIS_DEFAULT_PROMPT_VERSION = "1.1";

export const ANALYSIS_ERROR_CODES = {
    ANALYSIS_CALLBACK_TIMEOUT: "ANALYSIS_CALLBACK_TIMEOUT",
    ANALYSIS_QUEUED_TIMEOUT: "ANALYSIS_QUEUED_TIMEOUT",
    CURSOR_ANALYSIS_NOT_CONFIGURED: "CURSOR_ANALYSIS_NOT_CONFIGURED",
    PROVIDER_NOT_CONFIGURED: "PROVIDER_NOT_CONFIGURED",
    TRIGGER_FAILED: "TRIGGER_FAILED",
    INVALID_RESULT: "INVALID_RESULT",
} as const;
