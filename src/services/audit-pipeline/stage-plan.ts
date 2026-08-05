import "server-only";

import type { AuditConfigurationSnapshot, AuditPipelineStageName } from "@/src/services/audit-pipeline/types";
import { AUDIT_PIPELINE_STAGES } from "@/src/services/audit-pipeline/constants";

export function resolveEnabledPipelineStages(
    configuration: AuditConfigurationSnapshot,
): AuditPipelineStageName[] {
    const stages: AuditPipelineStageName[] = ["preflight", "crawl"];

    if (configuration.includeScreenshots) {
        stages.push("screenshots");
    }

    if (configuration.includePageSpeed) {
        if (configuration.pageSpeedStrategies.includes("mobile")) {
            stages.push("pagespeed_mobile");
        }
        if (configuration.pageSpeedStrategies.includes("desktop")) {
            stages.push("pagespeed_desktop");
        }
    }

    if (configuration.includeNiceGuyMetrics) {
        stages.push("niceguy");
    }

    if (configuration.includeAiAnalysis) {
        stages.push("ai_analysis");
    }

    stages.push("finalize");

    if (configuration.generateReportDraft) {
        stages.push("report_draft");
    }

    return stages;
}

export function isStageRequired(
    stage: AuditPipelineStageName,
    configuration: AuditConfigurationSnapshot,
): boolean {
    switch (stage) {
        case "preflight":
        case "crawl":
        case "niceguy":
            return true;
        case "screenshots":
            return false;
        case "pagespeed_mobile":
        case "pagespeed_desktop":
            return false;
        case "ai_analysis":
            return false;
        case "finalize":
        case "report_draft":
            return false;
        default:
            return false;
    }
}

export function computePipelineProgress(
    configuration: AuditConfigurationSnapshot,
    stages: Record<AuditPipelineStageName, { status: string }>,
): number {
    const enabled = resolveEnabledPipelineStages(configuration);
    if (enabled.length === 0) {
        return 0;
    }

    const completed = enabled.filter((stage) =>
        ["completed", "completed_with_warnings", "skipped"].includes(stages[stage]?.status ?? ""),
    ).length;

    return Math.round((completed / enabled.length) * 100);
}

export function hasWaitingPipelineStage(
    stages: Record<AuditPipelineStageName, { status: string }>,
): boolean {
    return Object.values(stages).some((stage) => stage.status === "waiting_for_external");
}

export function getNextPipelineStage(input: {
    configuration: AuditConfigurationSnapshot;
    stages: Record<AuditPipelineStageName, { status: string }>;
}): AuditPipelineStageName | null {
    const enabled = resolveEnabledPipelineStages(input.configuration);
    for (const stage of enabled) {
        const status = input.stages[stage]?.status ?? "pending";
        // Asynchronous external wait pauses the pipeline; do not re-select the waiting stage.
        if (status === "waiting_for_external") {
            return null;
        }
        if (
            !["completed", "completed_with_warnings", "skipped", "failed"].includes(status)
        ) {
            return stage;
        }
    }
    return null;
}

export function markSkippedStages(
    configuration: AuditConfigurationSnapshot,
): AuditPipelineStageName[] {
    const enabled = new Set(resolveEnabledPipelineStages(configuration));
    return AUDIT_PIPELINE_STAGES.filter((stage) => !enabled.has(stage));
}
