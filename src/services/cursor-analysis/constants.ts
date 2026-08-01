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

export const ACTIVE_CURSOR_ANALYSIS_STATUSES: CursorAnalysisStatus[] = [
    "queued",
    "triggered",
    "analyzing",
    "validating",
];

export const CURSOR_ANALYSIS_PROVIDER = "cursor-automation";
export const CURSOR_ANALYSIS_METHOD = "cursor-automation-poc";
export const CURSOR_ANALYSIS_EVENT = "audit.ready_for_analysis";
export const CURSOR_ANALYSIS_SCHEMA_VERSION = "1.0";
