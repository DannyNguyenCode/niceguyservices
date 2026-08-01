import type { AuditJobStatus, AuditStageStatus } from "@/src/services/audit-pipeline/types";

const STAGE_TRANSITIONS: Record<AuditStageStatus, AuditStageStatus[]> = {
    pending: ["queued", "skipped"],
    queued: ["processing"],
    processing: ["completed", "completed_with_warnings", "failed"],
    completed: [],
    completed_with_warnings: [],
    failed: ["queued"],
    skipped: [],
};

const JOB_TRANSITIONS: Record<AuditJobStatus, AuditJobStatus[]> = {
    queued: ["processing", "cancelled"],
    processing: ["completed", "completed_with_warnings", "failed", "cancelled"],
    completed: [],
    completed_with_warnings: [],
    failed: ["queued"],
    cancelled: [],
};

export class InvalidStateTransitionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidStateTransitionError";
    }
}

export function assertStageTransition(from: AuditStageStatus, to: AuditStageStatus): void {
    if (from === to) {
        return;
    }
    const allowed = STAGE_TRANSITIONS[from];
    if (!allowed.includes(to)) {
        throw new InvalidStateTransitionError(`Invalid stage transition: ${from} -> ${to}`);
    }
}

export function assertJobTransition(from: AuditJobStatus, to: AuditJobStatus): void {
    if (from === to) {
        return;
    }
    const allowed = JOB_TRANSITIONS[from];
    if (!allowed.includes(to)) {
        throw new InvalidStateTransitionError(`Invalid job transition: ${from} -> ${to}`);
    }
}

export function isTerminalStageStatus(status: AuditStageStatus): boolean {
    return ["completed", "completed_with_warnings", "failed", "skipped"].includes(status);
}

export function isTerminalJobStatus(status: AuditJobStatus): boolean {
    return ["completed", "completed_with_warnings", "failed", "cancelled"].includes(status);
}

export function deriveJobStatusFromStages(
    stages: Array<{ required: boolean; status: AuditStageStatus }>,
): AuditJobStatus {
    const relevant = stages.filter((stage) => stage.status !== "skipped");
    const hasProcessing = relevant.some((stage) =>
        ["queued", "processing"].includes(stage.status),
    );
    if (hasProcessing) {
        return "processing";
    }

    const requiredFailed = stages.some(
        (stage) => stage.required && stage.status === "failed",
    );
    if (requiredFailed) {
        return "failed";
    }

    const hasWarnings = relevant.some((stage) => stage.status === "completed_with_warnings");
    const allTerminal = relevant.every((stage) => isTerminalStageStatus(stage.status));
    if (allTerminal) {
        return hasWarnings ? "completed_with_warnings" : "completed";
    }

    return "processing";
}
