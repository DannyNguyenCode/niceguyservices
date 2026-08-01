import { CRAWL_CONFIG } from "@/src/lib/crawl-config";

export const AUDIT_CONFIGURATION_VERSION = "audit-config-v1";
export const AUDIT_JOB_PACKAGE_VERSION = "audit-job-v1";
export const AUDIT_PIPELINE_SCHEMA_VERSION = "audit-pipeline-v1";

export const AUDIT_PIPELINE_STAGES = [
    "preflight",
    "crawl",
    "screenshots",
    "pagespeed_mobile",
    "pagespeed_desktop",
    "niceguy",
    "ai_analysis",
    "finalize",
    "report_draft",
] as const;

export type AuditPipelineStageName = (typeof AUDIT_PIPELINE_STAGES)[number];

export const ACTIVE_AUDIT_JOB_STATUSES = ["queued", "processing"] as const;
export const TERMINAL_AUDIT_JOB_STATUSES = [
    "completed",
    "completed_with_warnings",
    "failed",
    "cancelled",
] as const;

export const AUDIT_STAGE_STATUSES = [
    "pending",
    "queued",
    "processing",
    "completed",
    "completed_with_warnings",
    "failed",
    "skipped",
] as const;

export const DEFAULT_AUDIT_CONFIGURATION = {
    crawlMaxPages: CRAWL_CONFIG.maxPages,
    crawlMaxDepth: CRAWL_CONFIG.maxDepth,
    includeScreenshots: true,
    includePageSpeed: true,
    includeNiceGuyMetrics: true,
    includeAiAnalysis: true,
    generateReportDraft: true,
    pageSpeedStrategies: ["mobile", "desktop"] as Array<"mobile" | "desktop">,
    configurationVersion: AUDIT_CONFIGURATION_VERSION,
};

export const AUDIT_PREFLIGHT_TIMEOUT_MS = Number.parseInt(
    process.env.AUDIT_PREFLIGHT_TIMEOUT_MS ?? "15000",
    10,
);

export const AUDIT_JOB_MAX_ATTEMPTS = Number.parseInt(
    process.env.AUDIT_JOB_MAX_ATTEMPTS ?? "3",
    10,
);
