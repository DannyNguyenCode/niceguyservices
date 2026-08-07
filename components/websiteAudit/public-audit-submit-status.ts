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
            "Your audit will continue automatically even if you leave this page. Come back anytime and enter your email to securely retrieve your audit when it is ready.",
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
            "Your website audit finished successfully. Use Retrieve your report on this page with the email you submitted.",
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

export type WebsiteAuditInlinePhase =
    | "form"
    | "submitting"
    | "progress"
    | "complete"
    | "failed";

export function deriveWebsiteAuditInlinePhase(input: {
    pending: boolean;
    statusToken: string | null;
    progressStatus: PublicAuditOverallStatus | null | undefined;
}): WebsiteAuditInlinePhase {
    if (input.pending && !input.statusToken) return "submitting";
    if (!input.statusToken) return "form";
    if (input.progressStatus === "complete") return "complete";
    if (input.progressStatus === "failed") return "failed";
    return "progress";
}

export function websiteAuditSectionCopy(phase: WebsiteAuditInlinePhase): {
    label: string;
    title: string;
    description: string;
} {
    switch (phase) {
        case "progress":
            return {
                label: "Audit in progress",
                title: "We're auditing your website",
                description:
                    "Your audit is running automatically. You can leave this page and come back later.",
            };
        case "submitting":
            // Keep request framing until the backend accepts — no intermediate screen.
            return {
                label: "Start your audit",
                title: "Request a website audit",
                description:
                    "Enter your website URL and business email to start your website audit.",
            };
        case "complete":
            return {
                label: "Audit complete",
                title: "Your website audit is ready",
                description: "Choose how you want to open your results.",
            };
        case "failed":
            return {
                label: "Audit interrupted",
                title: "We couldn't complete your audit",
                description:
                    "Something interrupted the audit while we were analyzing your website.",
            };
        default:
            return {
                label: "Start your audit",
                title: "Request a website audit",
                description:
                    "Enter your website URL and business email to start your website audit.",
            };
    }
}

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

/**
 * Whether a submit outcome warrants an inline status message (errors / acknowledgements).
 * Progress itself is shown in the audit section — there is no customer progress modal.
 */
export function shouldShowPublicAuditSubmitFeedback(input: {
    pending: boolean;
    outcome?: PublicAuditSubmitOutcome | null;
}): boolean {
    if (input.pending) return false;
    if (!input.outcome || input.outcome === "validation" || input.outcome === "started") {
        return false;
    }
    return true;
}

/** @deprecated Use shouldShowPublicAuditSubmitFeedback — progress modal was removed. */
export function shouldOpenPublicAuditSubmitModal(input: {
    pending: boolean;
    outcome?: PublicAuditSubmitOutcome | null;
    hasProgressSession?: boolean;
}): boolean {
    return shouldShowPublicAuditSubmitFeedback({
        pending: input.pending,
        outcome: input.outcome,
    });
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
