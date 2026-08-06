import "server-only";

import type { AuditConfigurationSnapshot, AuditPipelineStageName } from "@/src/services/audit-pipeline/types";
import { AUDIT_PIPELINE_STAGES } from "@/src/services/audit-pipeline/constants";

const TERMINAL_OK = new Set(["completed", "completed_with_warnings", "skipped"]);

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

/**
 * Explicit dependency graph for concurrent orchestration.
 *
 * Crawl and PageSpeed both depend only on preflight (may overlap).
 * NiceGuy depends on crawl completion — not PageSpeed.
 * Cursor (ai_analysis) waits for all configured evidence stages to be terminal;
 * the evidence barrier then validates persisted evidence before triggering.
 */
export function getStageDependencies(
    stage: AuditPipelineStageName,
    configuration: AuditConfigurationSnapshot,
): AuditPipelineStageName[] {
    switch (stage) {
        case "preflight":
            return [];
        case "crawl":
            return ["preflight"];
        case "screenshots":
            return ["crawl"];
        case "pagespeed_mobile":
        case "pagespeed_desktop":
            // Independent of crawl completion — may run concurrently with crawl.
            return ["preflight"];
        case "niceguy":
            return ["crawl"];
        case "ai_analysis": {
            const deps: AuditPipelineStageName[] = ["crawl"];
            if (configuration.includeScreenshots) deps.push("screenshots");
            if (configuration.includePageSpeed) {
                if (configuration.pageSpeedStrategies.includes("mobile")) {
                    deps.push("pagespeed_mobile");
                }
                if (configuration.pageSpeedStrategies.includes("desktop")) {
                    deps.push("pagespeed_desktop");
                }
            }
            if (configuration.includeNiceGuyMetrics) deps.push("niceguy");
            return deps;
        }
        case "finalize":
            return configuration.includeAiAnalysis ? ["ai_analysis"] : ["crawl"];
        case "report_draft":
            return ["finalize"];
        default:
            return [];
    }
}

function isDependencySatisfied(
    stage: AuditPipelineStageName,
    status: string,
    configuration: AuditConfigurationSnapshot,
): boolean {
    if (TERMINAL_OK.has(status)) {
        return true;
    }
    // Required upstream failures block dependents.
    if (status === "failed" && isStageRequired(stage, configuration)) {
        return false;
    }
    // Optional upstream failures (e.g. screenshots warnings path) still unblock
    // dependents so the evidence barrier can decide on Cursor.
    if (status === "failed" && !isStageRequired(stage, configuration)) {
        return true;
    }
    return false;
}

export function areStageDependenciesMet(input: {
    stage: AuditPipelineStageName;
    configuration: AuditConfigurationSnapshot;
    stages: Record<AuditPipelineStageName, { status: string }>;
}): boolean {
    const deps = getStageDependencies(input.stage, input.configuration);
    return deps.every((dep) => {
        const status = input.stages[dep]?.status ?? "pending";
        return isDependencySatisfied(dep, status, input.configuration);
    });
}

export function isStageRequired(
    stage: AuditPipelineStageName,
    _configuration: AuditConfigurationSnapshot,
): boolean {
    void _configuration;
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

function isRunnableStageStatus(status: string): boolean {
    // Failed stages are not auto-retried in the same pipeline invocation.
    // `retryFailedAuditJob` resets them to pending before requeue.
    return status === "pending" || status === "queued";
}

/**
 * Returns all enabled stages whose dependencies are met and that still need work.
 * Multiple stages may be ready simultaneously (e.g. crawl + pagespeed after preflight).
 */
export function getReadyPipelineStages(input: {
    configuration: AuditConfigurationSnapshot;
    stages: Record<AuditPipelineStageName, { status: string }>;
}): AuditPipelineStageName[] {
    const enabled = resolveEnabledPipelineStages(input.configuration);
    const ready: AuditPipelineStageName[] = [];

    for (const stage of enabled) {
        const status = input.stages[stage]?.status ?? "pending";
        if (status === "waiting_for_external") {
            return [];
        }
        if (status === "processing") {
            // Already running in this wave / prior invocation — do not re-select.
            continue;
        }
        if (!isRunnableStageStatus(status)) {
            continue;
        }
        if (
            !areStageDependenciesMet({
                stage,
                configuration: input.configuration,
                stages: input.stages,
            })
        ) {
            continue;
        }

        // Required upstream failed → do not start this stage.
        const deps = getStageDependencies(stage, input.configuration);
        const requiredDepFailed = deps.some((dep) => {
            const depStatus = input.stages[dep]?.status ?? "pending";
            return depStatus === "failed" && isStageRequired(dep, input.configuration);
        });
        if (requiredDepFailed) {
            continue;
        }

        ready.push(stage);
    }

    return ready;
}

/** @deprecated Prefer getReadyPipelineStages for concurrent orchestration. */
export function getNextPipelineStage(input: {
    configuration: AuditConfigurationSnapshot;
    stages: Record<AuditPipelineStageName, { status: string }>;
}): AuditPipelineStageName | null {
    return getReadyPipelineStages(input)[0] ?? null;
}

export function markSkippedStages(
    configuration: AuditConfigurationSnapshot,
): AuditPipelineStageName[] {
    const enabled = new Set(resolveEnabledPipelineStages(configuration));
    return AUDIT_PIPELINE_STAGES.filter((stage) => !enabled.has(stage));
}

export function hasBlockingRequiredFailure(input: {
    configuration: AuditConfigurationSnapshot;
    stages: Record<AuditPipelineStageName, { status: string }>;
}): AuditPipelineStageName | null {
    for (const stage of resolveEnabledPipelineStages(input.configuration)) {
        if (
            isStageRequired(stage, input.configuration) &&
            input.stages[stage]?.status === "failed"
        ) {
            return stage;
        }
    }
    return null;
}
