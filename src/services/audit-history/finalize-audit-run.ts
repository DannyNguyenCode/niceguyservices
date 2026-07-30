import "server-only";

import { getAuditRunById, updateAuditRunCompletion, finalizeAuditRunRecord } from "@/src/data/audit-runs";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import { buildAuditSummary } from "@/src/services/audit-history/build-audit-summary";
import { CURRENT_ELIGIBLE_AUDIT_STATUSES } from "@/src/services/audit-history/constants";
import type { AuditRunStatus, SerializableAuditRun } from "@/src/services/audit-history/types";

export class AuditFinalizationError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "AuditFinalizationError";
        this.code = code;
    }
}

function determineOverallStatus(
    auditRun: SerializableAuditRun,
): AuditRunStatus {
    const { completion, configuration } = auditRun;

    if (completion.crawl === "failed" || completion.crawl === "not-started") {
        return "failed";
    }

    const enabledStages: Array<keyof SerializableAuditRun["completion"]> = ["crawl"];
    if (configuration.includeScreenshots) enabledStages.push("screenshots");
    if (configuration.includePageSpeed) enabledStages.push("pageSpeed");
    if (configuration.includeNiceGuyMetrics) enabledStages.push("metrics");
    if (configuration.includeAiAnalysis) enabledStages.push("ai");

    const stageResults = enabledStages.map((stage) => completion[stage]);
    const hasFailure = stageResults.some((value) => value === "failed");
    const hasPartial = stageResults.some((value) => value === "partial");
    const allComplete = stageResults.every(
        (value) => value === "complete" || value === "skipped",
    );

    if (hasFailure && completion.crawl !== "complete") {
        return "failed";
    }
    if (allComplete && !hasPartial) {
        return "complete";
    }
    if (completion.crawl === "complete") {
        return "partial";
    }
    return "failed";
}

export async function finalizeAuditRun(input: {
    auditRunId: string;
}): Promise<SerializableAuditRun> {
    const auditRun = await getAuditRunById(input.auditRunId);
    if (!auditRun) {
        throw new AuditFinalizationError("AUDIT_HISTORY_AUDIT_NOT_FOUND", "Audit run not found.");
    }

    if (["complete", "partial", "failed", "cancelled", "archived"].includes(auditRun.status)) {
        throw new AuditFinalizationError(
            "AUDIT_HISTORY_ALREADY_FINALIZED",
            "Audit run is already finalized.",
        );
    }

    const summary = await buildAuditSummary(input.auditRunId);
    const status = determineOverallStatus(auditRun);
    const makeCurrent = CURRENT_ELIGIBLE_AUDIT_STATUSES.includes(
        status as (typeof CURRENT_ELIGIBLE_AUDIT_STATUSES)[number],
    );

    const finalized = await finalizeAuditRunRecord({
        auditRunId: input.auditRunId,
        status,
        summary,
        completedAt: new Date(),
        makeCurrent,
    });

    if (!finalized) {
        throw new AuditFinalizationError(
            "AUDIT_HISTORY_FINALIZATION_FAILED",
            "Unable to finalize audit run.",
        );
    }

    const eventType =
        status === "complete"
            ? "audit-run-completed"
            : status === "partial"
              ? "audit-run-partial"
              : "audit-run-failed";

    const startedAt = auditRun.startedAt ? new Date(auditRun.startedAt).getTime() : null;
    const durationMs = startedAt ? Date.now() - startedAt : null;

    await createActivityEvent({
        websiteId: auditRun.websiteId,
        auditRunId: auditRun.id,
        eventType: eventType,
        title: `Audit ${auditRun.auditNumber} ${status}`,
        description: `Audit run ${auditRun.auditNumber} finalized as ${status}.`,
        actor: { type: "system" },
        metadata: {
            auditRunId: auditRun.id,
            auditNumber: auditRun.auditNumber,
            status,
            overallScore: summary.overallScore,
            warningCount: summary.warningCount,
            errorCount: summary.errorCount,
            durationMs,
            auditSchemaVersion: auditRun.versions.auditSchemaVersion,
        },
    });

    await createActivityEvent({
        websiteId: auditRun.websiteId,
        auditRunId: auditRun.id,
        eventType: "audit-run-finalized",
        title: `Audit ${auditRun.auditNumber} finalized`,
        description: `Audit run ${auditRun.auditNumber} summary stored.`,
        actor: { type: "system" },
        metadata: {
            auditRunId: auditRun.id,
            auditNumber: auditRun.auditNumber,
            status,
        },
    });

    return finalized;
}

export async function updateAuditRunStage(
    auditRunId: string,
    stage: keyof SerializableAuditRun["completion"],
    value: SerializableAuditRun["completion"][keyof SerializableAuditRun["completion"]],
    status?: AuditRunStatus,
): Promise<void> {
    await updateAuditRunCompletion(auditRunId, { [stage]: value }, status);
}
