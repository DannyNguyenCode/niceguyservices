/**
 * Customer-facing copy and helpers for the public audit submit + progress UI.
 */
import type {
    PublicAuditCustomerStageId,
    PublicAuditCustomerStageState,
    PublicAuditOverallStatus,
} from "@/src/services/public-audit-status/map-public-audit-progress";
import {
    PUBLIC_AUDIT_STATUS_POLL_BACKOFF_FACTOR,
    PUBLIC_AUDIT_STATUS_POLL_INTERVAL_MS,
    PUBLIC_AUDIT_STATUS_POLL_MAX_INTERVAL_MS,
    PUBLIC_AUDIT_STATUS_SESSION_STORAGE_KEY,
} from "@/src/services/public-audit-status/constants";

export const PUBLIC_AUDIT_SUBMIT_UI = {
    buttonIdle: "Submit audit request",
    buttonPending: "Starting audit...",
    loading: {
        title: "Preparing your audit",
        description:
            "We're validating your website and starting your audit. This should only take a moment.",
        status: "Starting audit...",
    },
    successStarted: {
        title: "Your audit has started",
        description: "We're analyzing your website and preparing your report.",
        backgroundNote:
            "You don't need to keep this page open. When your report is published, retrieve it on this page with the email you submitted.",
        cta: "Close",
    },
    successAlreadyHandled: {
        title: "Your request was received",
        backgroundNote:
            "You don't need to keep this page open. If a review is already underway for this website, that work will continue.",
        cta: "Close",
    },
    successComplete: {
        title: "Your audit is complete",
        description:
            "Your website audit finished successfully. Use Retrieve your report on this page with the email you submitted once your report is published.",
        backgroundNote: null,
        cta: "Close",
    },
    errorGeneric: {
        title: "Unable to start your audit",
        description: "We couldn't start your audit right now. Please try again.",
        cta: "Try again",
    },
    errorFailed: {
        title: "We couldn't complete the audit this time",
        description:
            "Something went wrong while analyzing your website. Please try again later, or contact us if you need help.",
        cta: "Close",
    },
    errorRateLimited: {
        title: "Unable to start your audit",
        cta: "Close",
    },
} as const;

export type PublicAuditSubmitOutcome =
    | "validation"
    | "rate_limited"
    | "error"
    | "started"
    | "already_in_progress"
    | "received";

export type PublicAuditSubmitModalPhase =
    | "loading"
    | "progress"
    | "success"
    | "error";

export type PublicAuditProgressStageView = {
    id: PublicAuditCustomerStageId;
    label: string;
    description: string;
    state: PublicAuditCustomerStageState;
};

export type PublicAuditSubmitStatusView = {
    phase: PublicAuditSubmitModalPhase;
    title: string;
    description: string;
    backgroundNote: string | null;
    statusLabel: string | null;
    primaryActionLabel: string;
    /** When true, Esc/backdrop should not dismiss (in-flight request). */
    dismissible: boolean;
    domain: string | null;
    stages: PublicAuditProgressStageView[] | null;
    overallStatus: PublicAuditOverallStatus | null;
};

export type PersistedPublicAuditStatusSession = {
    statusToken: string;
    domain: string;
    savedAt: string;
};

export function derivePublicAuditSubmitStatusView(input: {
    pending: boolean;
    outcome?: PublicAuditSubmitOutcome | null;
    message?: string | null;
    domain?: string | null;
    progress?: {
        status: PublicAuditOverallStatus;
        message: string;
        domain: string;
        stages: PublicAuditProgressStageView[];
    } | null;
}): PublicAuditSubmitStatusView | null {
    if (input.pending) {
        return {
            phase: "loading",
            title: PUBLIC_AUDIT_SUBMIT_UI.loading.title,
            description: PUBLIC_AUDIT_SUBMIT_UI.loading.description,
            backgroundNote: null,
            statusLabel: PUBLIC_AUDIT_SUBMIT_UI.loading.status,
            primaryActionLabel: "",
            dismissible: false,
            domain: input.domain ?? null,
            stages: null,
            overallStatus: null,
        };
    }

    if (input.progress) {
        if (input.progress.status === "complete") {
            return {
                phase: "success",
                title: PUBLIC_AUDIT_SUBMIT_UI.successComplete.title,
                description: PUBLIC_AUDIT_SUBMIT_UI.successComplete.description,
                backgroundNote: PUBLIC_AUDIT_SUBMIT_UI.successComplete.backgroundNote,
                statusLabel: null,
                primaryActionLabel: PUBLIC_AUDIT_SUBMIT_UI.successComplete.cta,
                dismissible: true,
                domain: input.progress.domain,
                stages: input.progress.stages,
                overallStatus: "complete",
            };
        }

        if (input.progress.status === "failed") {
            return {
                phase: "error",
                title: PUBLIC_AUDIT_SUBMIT_UI.errorFailed.title,
                description: PUBLIC_AUDIT_SUBMIT_UI.errorFailed.description,
                backgroundNote: null,
                statusLabel: null,
                primaryActionLabel: PUBLIC_AUDIT_SUBMIT_UI.errorFailed.cta,
                dismissible: true,
                domain: input.progress.domain,
                stages: input.progress.stages,
                overallStatus: "failed",
            };
        }

        return {
            phase: "progress",
            title: PUBLIC_AUDIT_SUBMIT_UI.successStarted.title,
            description: input.progress.message || PUBLIC_AUDIT_SUBMIT_UI.successStarted.description,
            backgroundNote: PUBLIC_AUDIT_SUBMIT_UI.successStarted.backgroundNote,
            statusLabel: null,
            primaryActionLabel: PUBLIC_AUDIT_SUBMIT_UI.successStarted.cta,
            dismissible: true,
            domain: input.progress.domain,
            stages: input.progress.stages,
            overallStatus: input.progress.status,
        };
    }

    if (!input.outcome || input.outcome === "validation") {
        return null;
    }

    if (input.outcome === "started") {
        return {
            phase: "progress",
            title: PUBLIC_AUDIT_SUBMIT_UI.successStarted.title,
            description: PUBLIC_AUDIT_SUBMIT_UI.successStarted.description,
            backgroundNote: PUBLIC_AUDIT_SUBMIT_UI.successStarted.backgroundNote,
            statusLabel: null,
            primaryActionLabel: PUBLIC_AUDIT_SUBMIT_UI.successStarted.cta,
            dismissible: true,
            domain: input.domain ?? null,
            stages: null,
            overallStatus: "accepted",
        };
    }

    if (input.outcome === "already_in_progress") {
        return {
            phase: "success",
            title: PUBLIC_AUDIT_SUBMIT_UI.successAlreadyHandled.title,
            description:
                input.message?.trim() ||
                "Your audit request has been received. If a review is already in progress or was recently completed for this website, we will continue with that work.",
            backgroundNote: PUBLIC_AUDIT_SUBMIT_UI.successAlreadyHandled.backgroundNote,
            statusLabel: null,
            primaryActionLabel: PUBLIC_AUDIT_SUBMIT_UI.successAlreadyHandled.cta,
            dismissible: true,
            domain: input.domain ?? null,
            stages: null,
            overallStatus: null,
        };
    }

    if (input.outcome === "rate_limited") {
        return {
            phase: "error",
            title: PUBLIC_AUDIT_SUBMIT_UI.errorRateLimited.title,
            description:
                input.message?.trim() || "Too many audit requests. Please try again later.",
            backgroundNote: null,
            statusLabel: null,
            primaryActionLabel: PUBLIC_AUDIT_SUBMIT_UI.errorRateLimited.cta,
            dismissible: true,
            domain: null,
            stages: null,
            overallStatus: null,
        };
    }

    if (input.outcome === "received") {
        return {
            phase: "error",
            title: PUBLIC_AUDIT_SUBMIT_UI.errorGeneric.title,
            description: PUBLIC_AUDIT_SUBMIT_UI.errorGeneric.description,
            backgroundNote: null,
            statusLabel: null,
            primaryActionLabel: PUBLIC_AUDIT_SUBMIT_UI.errorGeneric.cta,
            dismissible: true,
            domain: input.domain ?? null,
            stages: null,
            overallStatus: null,
        };
    }

    return {
        phase: "error",
        title: PUBLIC_AUDIT_SUBMIT_UI.errorGeneric.title,
        description:
            input.message?.trim() || PUBLIC_AUDIT_SUBMIT_UI.errorGeneric.description,
        backgroundNote: null,
        statusLabel: null,
        primaryActionLabel: PUBLIC_AUDIT_SUBMIT_UI.errorGeneric.cta,
        dismissible: true,
        domain: null,
        stages: null,
        overallStatus: null,
    };
}

export function shouldOpenPublicAuditSubmitModal(input: {
    pending: boolean;
    outcome?: PublicAuditSubmitOutcome | null;
    hasProgressSession?: boolean;
}): boolean {
    if (input.pending) return true;
    if (input.hasProgressSession) return true;
    if (!input.outcome || input.outcome === "validation") return false;
    return true;
}

export function shouldStopPublicAuditStatusPolling(
    status: PublicAuditOverallStatus | null | undefined,
): boolean {
    return status === "complete" || status === "failed";
}

export function nextPublicAuditPollIntervalMs(currentMs: number): number {
    return Math.min(
        Math.round(currentMs * PUBLIC_AUDIT_STATUS_POLL_BACKOFF_FACTOR),
        PUBLIC_AUDIT_STATUS_POLL_MAX_INTERVAL_MS,
    );
}

export {
    PUBLIC_AUDIT_STATUS_POLL_INTERVAL_MS,
    PUBLIC_AUDIT_STATUS_SESSION_STORAGE_KEY,
};

export function readPersistedPublicAuditStatusSession(): PersistedPublicAuditStatusSession | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.sessionStorage.getItem(PUBLIC_AUDIT_STATUS_SESSION_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as PersistedPublicAuditStatusSession;
        if (
            !parsed ||
            typeof parsed.statusToken !== "string" ||
            parsed.statusToken.length < 32 ||
            typeof parsed.domain !== "string"
        ) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

export function persistPublicAuditStatusSession(input: {
    statusToken: string;
    domain: string;
}): void {
    if (typeof window === "undefined") return;
    const payload: PersistedPublicAuditStatusSession = {
        statusToken: input.statusToken,
        domain: input.domain,
        savedAt: new Date().toISOString(),
    };
    window.sessionStorage.setItem(
        PUBLIC_AUDIT_STATUS_SESSION_STORAGE_KEY,
        JSON.stringify(payload),
    );
}

export function clearPersistedPublicAuditStatusSession(): void {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(PUBLIC_AUDIT_STATUS_SESSION_STORAGE_KEY);
}
