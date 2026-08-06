/**
 * Customer-facing copy for the public audit submit status modal.
 * Represents request scheduling only — not Crawl/PageSpeed/NiceGuy/Cursor progress.
 */
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
        title: "Your audit is underway",
        description:
            "Your request was received successfully. We're now analyzing your website and preparing your report.",
        backgroundNote:
            "You can safely leave this page — processing will continue in the background.",
        cta: "Done",
    },
    successAlreadyHandled: {
        title: "Your request was received",
        backgroundNote:
            "You can safely leave this page — processing will continue in the background.",
        cta: "Done",
    },
    errorGeneric: {
        title: "Unable to start your audit",
        description: "We couldn't start your audit right now. Please try again.",
        cta: "Try again",
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

export type PublicAuditSubmitModalPhase = "loading" | "success" | "error";

export type PublicAuditSubmitStatusView = {
    phase: PublicAuditSubmitModalPhase;
    title: string;
    description: string;
    backgroundNote: string | null;
    statusLabel: string | null;
    primaryActionLabel: string;
    /** When true, Esc/backdrop should not dismiss (in-flight request). */
    dismissible: boolean;
};

/**
 * Maps a completed public submission outcome to modal content.
 * Does not invent backend stage progress.
 */
export function derivePublicAuditSubmitStatusView(input: {
    pending: boolean;
    outcome?: PublicAuditSubmitOutcome | null;
    message?: string | null;
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
        };
    }

    if (!input.outcome || input.outcome === "validation") {
        return null;
    }

    if (input.outcome === "started") {
        return {
            phase: "success",
            title: PUBLIC_AUDIT_SUBMIT_UI.successStarted.title,
            description: PUBLIC_AUDIT_SUBMIT_UI.successStarted.description,
            backgroundNote: PUBLIC_AUDIT_SUBMIT_UI.successStarted.backgroundNote,
            statusLabel: null,
            primaryActionLabel: PUBLIC_AUDIT_SUBMIT_UI.successStarted.cta,
            dismissible: true,
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
    };
}

export function shouldOpenPublicAuditSubmitModal(input: {
    pending: boolean;
    outcome?: PublicAuditSubmitOutcome | null;
}): boolean {
    if (input.pending) return true;
    if (!input.outcome || input.outcome === "validation") return false;
    return true;
}
