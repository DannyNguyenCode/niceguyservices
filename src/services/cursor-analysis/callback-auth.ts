import "server-only";

import type { CursorAnalysisStatus } from "@/src/services/cursor-analysis/constants";
import {
    buildCallbackAuthToken,
    verifyCallbackAuthToken,
    type CallbackAuthTokenPayload,
} from "@/src/services/cursor-analysis/callback-token";
import { getCursorAnalysisConfig } from "@/src/services/cursor-analysis/config";

export type CallbackAuthResult =
    | { ok: true; payload: CallbackAuthTokenPayload }
    | { ok: false; code: string; message: string };

export type CallbackTokenMatchResult =
    | { ok: true; kind: "proceed" }
    | { ok: true; kind: "duplicate" }
    | { ok: false; code: string; message: string };

function mapTokenError(error: unknown): CallbackAuthResult {
    const code =
        error instanceof Error ? error.message : "CALLBACK_TOKEN_INVALID";
    switch (code) {
        case "CALLBACK_TOKEN_EXPIRED":
            return {
                ok: false,
                code,
                message: "Callback authentication token has expired.",
            };
        case "CALLBACK_TOKEN_AUDIT_MISMATCH":
            return {
                ok: false,
                code,
                message: "Callback authentication token does not match this audit.",
            };
        case "CALLBACK_TOKEN_REQUEST_MISMATCH":
            return {
                ok: false,
                code,
                message: "Callback authentication token does not match this analysis request.",
            };
        default:
            return {
                ok: false,
                code: "CALLBACK_TOKEN_INVALID",
                message: "Callback authentication token is invalid.",
            };
    }
}

/**
 * Verifies a request-specific callback token signed with CURSOR_ANALYSIS_CALLBACK_SECRET.
 * The permanent secret never leaves the application side.
 */
export function authenticateAnalysisCallback(input: {
    providedToken: string | null;
    auditId: string;
    bodyAnalysisRequestId?: string;
}): CallbackAuthResult {
    if (!getCursorAnalysisConfig().callbackSecret) {
        return {
            ok: false,
            code: "UNAUTHORIZED",
            message: "Callback authentication is not configured.",
        };
    }

    if (!input.providedToken?.trim()) {
        return {
            ok: false,
            code: "UNAUTHORIZED",
            message: "Callback authentication token header is required.",
        };
    }

    try {
        const payload = verifyCallbackAuthToken(
            input.providedToken.trim(),
            input.auditId,
            input.bodyAnalysisRequestId,
        );
        return { ok: true, payload };
    } catch (error) {
        return mapTokenError(error);
    }
}

export function createCallbackAuthTokenForRequest(input: {
    auditId: string;
    analysisRequestId: string;
}): string {
    return buildCallbackAuthToken(input);
}

/**
 * Ensures the verified token belongs to the current or idempotently completed attempt.
 */
export function validateCallbackTokenAgainstAnalysis(input: {
    tokenPayload: CallbackAuthTokenPayload;
    activeAnalysisRequestId: string | null;
    status: CursorAnalysisStatus;
    hasExistingResult: boolean;
}): CallbackTokenMatchResult {
    if (!input.activeAnalysisRequestId) {
        return {
            ok: false,
            code: "NO_ACTIVE_REQUEST",
            message: "No analysis request is registered for this audit.",
        };
    }

    if (input.tokenPayload.analysisRequestId !== input.activeAnalysisRequestId) {
        return {
            ok: false,
            code: "STALE_CALLBACK",
            message: "Callback token belongs to a previous analysis attempt.",
        };
    }

    if (input.status === "completed" && input.hasExistingResult) {
        return { ok: true, kind: "duplicate" };
    }

    if (input.status === "failed" || input.status === "retry_pending") {
        return {
            ok: false,
            code: "CALLBACK_TOKEN_REUSED",
            message: "Callback token is no longer valid for this analysis attempt.",
        };
    }

    return { ok: true, kind: "proceed" };
}
