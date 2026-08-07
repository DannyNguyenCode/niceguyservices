import type {
    AuditJobStatus,
    AuditPipelineStageName,
    AuditStageStatus,
    SerializableAuditJob,
} from "@/src/services/audit-pipeline/types";
import { isTerminalJobStatus } from "@/src/services/audit-pipeline/state";

/**
 * Customer-facing progress stages for the public audit status UI.
 * Derived only from persisted AuditJob stage state — never faked timers.
 */
export const PUBLIC_AUDIT_CUSTOMER_STAGES = [
    "request",
    "crawl",
    "performance",
    "ux_conversion",
    "ai_review",
    "report",
] as const;

export type PublicAuditCustomerStageId = (typeof PUBLIC_AUDIT_CUSTOMER_STAGES)[number];

export type PublicAuditCustomerStageState =
    | "complete"
    | "processing"
    | "pending"
    | "failed";

export type PublicAuditOverallStatus =
    | "accepted"
    | "processing"
    | "complete"
    | "failed";

export type PublicAuditCustomerStageView = {
    id: PublicAuditCustomerStageId;
    label: string;
    description: string;
    state: PublicAuditCustomerStageState;
};

export type PublicAuditProgressView = {
    status: PublicAuditOverallStatus;
    currentStage: PublicAuditCustomerStageId | null;
    domain: string;
    stages: PublicAuditCustomerStageView[];
    message: string;
    /**
     * Direct report URL is never returned from the status poll.
     * Completion actions use separate status-token-scoped endpoints.
     */
    reportAvailable: boolean;
    /** When true, customer may use report lookup and/or completion actions. */
    useReportLookup: boolean;
    /** Whether a completed PDF exists for the published report. */
    pdfReady: boolean;
};

export type PublicAuditDeliverableEvidence = {
    /** Secure web report is published and available via email verification. */
    reportPublished: boolean;
    /** PDF generated successfully (informational; not required for customer complete). */
    pdfReady: boolean;
};

const STAGE_META: Record<
    PublicAuditCustomerStageId,
    { label: string; pendingDescription: string; processingDescription: string }
> = {
    request: {
        label: "Request received",
        pendingDescription: "Waiting",
        processingDescription: "Receiving your request",
    },
    crawl: {
        label: "Website crawl",
        pendingDescription: "Waiting",
        processingDescription: "Website structure and pages analyzed",
    },
    performance: {
        label: "Performance analysis",
        pendingDescription: "Waiting",
        processingDescription: "Testing speed and responsiveness",
    },
    ux_conversion: {
        label: "UX & conversion analysis",
        pendingDescription: "Waiting",
        processingDescription: "Reviewing clarity, trust, and conversion signals",
    },
    ai_review: {
        label: "AI review",
        pendingDescription: "Waiting",
        processingDescription: "Our AI is reviewing your website",
    },
    report: {
        label: "Preparing report",
        pendingDescription: "Waiting",
        processingDescription: "Assembling your audit findings",
    },
};

const PIPELINE_GROUPS: Record<PublicAuditCustomerStageId, AuditPipelineStageName[]> = {
    request: [],
    crawl: ["preflight", "crawl", "screenshots"],
    performance: ["pagespeed_mobile", "pagespeed_desktop"],
    ux_conversion: ["niceguy"],
    ai_review: ["ai_analysis"],
    report: ["finalize", "report_draft"],
};

function isSuccessStatus(status: AuditStageStatus): boolean {
    return status === "completed" || status === "completed_with_warnings" || status === "skipped";
}

function isActiveStatus(status: AuditStageStatus): boolean {
    return (
        status === "queued" ||
        status === "processing" ||
        status === "waiting_for_external"
    );
}

function relevantStatuses(
    job: SerializableAuditJob,
    pipelineStages: AuditPipelineStageName[],
): AuditStageStatus[] {
    return pipelineStages
        .map((name) => job.stages[name]?.status ?? "pending")
        .filter((status) => status !== "skipped");
}

function aggregateCustomerStageState(
    job: SerializableAuditJob,
    stageId: PublicAuditCustomerStageId,
    deliverables?: PublicAuditDeliverableEvidence,
): PublicAuditCustomerStageState {
    if (stageId === "request") {
        return "complete";
    }

    const pipelineStages = PIPELINE_GROUPS[stageId];
    const statuses = relevantStatuses(job, pipelineStages);

    // Stage not configured (all skipped / empty) → treat as complete so the UI advances.
    if (statuses.length === 0) {
        return "complete";
    }

    if (statuses.some((status) => status === "failed")) {
        return "failed";
    }

    if (statuses.every(isSuccessStatus)) {
        // Report group stays "processing" until the web report is published.
        if (stageId === "report" && deliverables && !deliverables.reportPublished) {
            return "processing";
        }
        return "complete";
    }

    if (statuses.some(isActiveStatus)) {
        return "processing";
    }

    // Job queued / claimed but this group not started yet.
    if (job.status === "queued" && stageId === "crawl") {
        return "processing";
    }

    // Pipeline finished stages but publish/PDF deliverables still pending.
    if (
        stageId === "report" &&
        deliverables &&
        !deliverables.reportPublished &&
        isTerminalJobStatus(job.status) &&
        job.status !== "failed" &&
        job.status !== "cancelled"
    ) {
        return "processing";
    }

    return "pending";
}

function normalizeToSingleProcessing(
    states: PublicAuditCustomerStageState[],
): PublicAuditCustomerStageState[] {
    let foundProcessing = false;
    return states.map((state) => {
        if (state !== "processing") {
            return state;
        }
        if (foundProcessing) {
            return "pending";
        }
        foundProcessing = true;
        return "processing";
    });
}

function overallStatusFromJob(
    jobStatus: AuditJobStatus,
    stageStates: PublicAuditCustomerStageState[],
    deliverables?: PublicAuditDeliverableEvidence,
): PublicAuditOverallStatus {
    if (jobStatus === "failed" || jobStatus === "cancelled") {
        return "failed";
    }
    if (stageStates.some((state) => state === "failed")) {
        return "failed";
    }
    // Customer-complete only when the published web report exists.
    if (
        (jobStatus === "completed" || jobStatus === "completed_with_warnings") &&
        deliverables?.reportPublished
    ) {
        return "complete";
    }
    if (jobStatus === "completed" || jobStatus === "completed_with_warnings") {
        // Job terminal but publish not done yet — still preparing report.
        return "processing";
    }
    if (jobStatus === "queued") {
        return "accepted";
    }
    return "processing";
}

function messageFor(input: {
    status: PublicAuditOverallStatus;
    currentStage: PublicAuditCustomerStageId | null;
}): string {
    if (input.status === "failed") {
        return "We couldn't complete the audit this time.";
    }
    if (input.status === "complete") {
        return "Your audit is complete. Use Retrieve your report on this page with the email you submitted.";
    }
    if (input.status === "accepted") {
        return "Your audit has started.";
    }

    switch (input.currentStage) {
        case "crawl":
            return "We're crawling your website.";
        case "performance":
            return "We're testing your website's performance.";
        case "ux_conversion":
            return "We're analyzing UX and conversion signals.";
        case "ai_review":
            return "Our AI is reviewing your website.";
        case "report":
            return "We're preparing your report.";
        default:
            return "Your audit is in progress.";
    }
}

/**
 * Maps persisted AuditJob state → sanitized customer progress.
 * Pure function — safe to unit test without MongoDB.
 */
export function mapAuditJobToPublicProgress(input: {
    job: SerializableAuditJob;
    normalizedDomain: string;
    deliverables?: PublicAuditDeliverableEvidence;
}): PublicAuditProgressView {
    const deliverables = input.deliverables ?? {
        reportPublished: false,
        pdfReady: false,
    };

    const rawStates = PUBLIC_AUDIT_CUSTOMER_STAGES.map((id) =>
        aggregateCustomerStageState(input.job, id, deliverables),
    );

    let stageStates = rawStates;
    if (input.job.status === "failed" || input.job.status === "cancelled") {
        // Keep completed stages; mark the first incomplete stage as failed; leave the rest pending.
        let markedFailure = false;
        stageStates = rawStates.map((state) => {
            if (state === "complete") return "complete";
            if (!markedFailure) {
                markedFailure = true;
                return "failed";
            }
            return "pending";
        });
    } else if (
        !isTerminalJobStatus(input.job.status) ||
        (isTerminalJobStatus(input.job.status) && !deliverables.reportPublished)
    ) {
        stageStates = normalizeToSingleProcessing(rawStates);
    }

    const stages: PublicAuditCustomerStageView[] = PUBLIC_AUDIT_CUSTOMER_STAGES.map(
        (id, index) => {
            const state = stageStates[index] ?? "pending";
            const meta = STAGE_META[id];
            const description =
                state === "processing"
                    ? meta.processingDescription
                    : state === "complete"
                      ? meta.processingDescription
                      : meta.pendingDescription;
            return {
                id,
                label: meta.label,
                description,
                state,
            };
        },
    );

    const currentStage =
        stages.find((stage) => stage.state === "processing" || stage.state === "failed")?.id ??
        null;

    const status = overallStatusFromJob(input.job.status, stageStates, deliverables);

    return {
        status: status === "accepted" && currentStage ? "processing" : status,
        currentStage:
            status === "complete"
                ? null
                : status === "failed"
                  ? currentStage
                  : currentStage ?? "crawl",
        domain: input.normalizedDomain,
        stages,
        message: messageFor({
            status: status === "accepted" && currentStage ? "processing" : status,
            currentStage,
        }),
        reportAvailable: false,
        useReportLookup: status === "complete",
        pdfReady: deliverables.pdfReady && status === "complete",
    };
}
