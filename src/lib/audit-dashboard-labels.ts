import type { AuditStageStatusValue } from "@/src/types/audit-dashboard";
import { ACTIVITY_LOG_TYPE_LABELS } from "@/src/schemas/enums";

export const AUDIT_STAGE_STATUS_LABELS: Record<AuditStageStatusValue, string> = {
    "not-started": "Not started",
    queued: "Queued",
    processing: "Processing",
    complete: "Complete",
    partial: "Partial",
    failed: "Failed",
    unavailable: "Unavailable",
};

export const AUDIT_STAGE_NAMES: Record<string, string> = {
    crawl: "Crawl",
    screenshots: "Screenshots",
    pageSpeed: "PageSpeed",
    niceGuy: "Nice Guy Metrics",
    aiAnalysis: "AI Analysis",
};

export function formatAuditStageStatus(status: AuditStageStatusValue): string {
    return AUDIT_STAGE_STATUS_LABELS[status] ?? status;
}

export function getActivityLabel(type: string): string {
    return (
        ACTIVITY_LOG_TYPE_LABELS[type as keyof typeof ACTIVITY_LOG_TYPE_LABELS] ??
        type.replace(/-/g, " ")
    );
}

export function pagespeedDisplayLabel(score: number | null | undefined): string {
    if (score === null || score === undefined) return "Not available";
    if (score >= 90) return "Strong";
    if (score >= 50) return "Needs improvement";
    return "Poor";
}
