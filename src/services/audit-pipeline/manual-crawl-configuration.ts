import type { AuditConfigurationSnapshot } from "@/src/services/audit-pipeline/types";

/**
 * Manual "Run Crawl" enters the durable AuditJob pipeline with crawl + screenshots
 * only. Other stages are skipped via configuration (existing stage-plan mechanism).
 * Idempotency key differs from full audits because of this configuration hash.
 */
export const MANUAL_CRAWL_AUDIT_CONFIGURATION: Partial<AuditConfigurationSnapshot> = {
    includeScreenshots: true,
    includePageSpeed: false,
    includeNiceGuyMetrics: false,
    includeAiAnalysis: false,
    generateReportDraft: false,
};
