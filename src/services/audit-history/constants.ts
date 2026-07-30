export const AUDIT_RUN_SCHEMA_VERSION = "audit-run-v1";

export const ACTIVE_AUDIT_RUN_STATUSES = [
    "queued",
    "crawling",
    "collecting-screenshots",
    "collecting-pagespeed",
    "calculating-metrics",
    "generating-ai-analysis",
] as const;

export const FINAL_AUDIT_RUN_STATUSES = [
    "complete",
    "partial",
    "failed",
    "cancelled",
] as const;

export const CURRENT_ELIGIBLE_AUDIT_STATUSES = ["complete", "partial"] as const;
