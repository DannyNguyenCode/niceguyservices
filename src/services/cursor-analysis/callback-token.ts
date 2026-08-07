import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import {
    getCallbackAuthTokenTtlMs,
    getCursorAnalysisConfig,
} from "@/src/services/cursor-analysis/config";

export type CallbackAuthTokenPayload = {
    auditId: string;
    analysisRequestId: string;
    expiresAt: number;
};

export type CallbackTokenVerificationError =
    | "CALLBACK_TOKEN_INVALID"
    | "CALLBACK_TOKEN_EXPIRED"
    | "CALLBACK_TOKEN_AUDIT_MISMATCH"
    | "CALLBACK_TOKEN_REQUEST_MISMATCH";

function readCallbackSigningSecret(): string {
    const secret = getCursorAnalysisConfig().callbackSecret;
    if (!secret) {
        throw new Error("CURSOR_ANALYSIS_CALLBACK_SECRET is not configured.");
    }
    return secret;
}

function signPayload(encodedPayload: string): string {
    return createHmac("sha256", readCallbackSigningSecret())
        .update(encodedPayload)
        .digest("base64url");
}

export function buildCallbackAuthToken(input: {
    auditId: string;
    analysisRequestId: string;
    ttlMs?: number;
}): string {
    const payload: CallbackAuthTokenPayload = {
        auditId: input.auditId,
        analysisRequestId: input.analysisRequestId,
        expiresAt: Date.now() + (input.ttlMs ?? getCallbackAuthTokenTtlMs()),
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = signPayload(encodedPayload);
    return `${encodedPayload}.${signature}`;
}

export function verifyCallbackAuthToken(
    token: string,
    expectedAuditId: string,
    expectedAnalysisRequestId?: string,
): CallbackAuthTokenPayload {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) {
        throw new Error("CALLBACK_TOKEN_INVALID");
    }

    const expectedSignature = signPayload(encodedPayload);
    const provided = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
        throw new Error("CALLBACK_TOKEN_INVALID");
    }

    let payload: CallbackAuthTokenPayload;
    try {
        payload = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf8"),
        ) as CallbackAuthTokenPayload;
    } catch {
        throw new Error("CALLBACK_TOKEN_INVALID");
    }

    if (!payload.auditId || !payload.analysisRequestId || !payload.expiresAt) {
        throw new Error("CALLBACK_TOKEN_INVALID");
    }

    if (payload.auditId !== expectedAuditId) {
        throw new Error("CALLBACK_TOKEN_AUDIT_MISMATCH");
    }

    if (
        expectedAnalysisRequestId &&
        payload.analysisRequestId !== expectedAnalysisRequestId
    ) {
        throw new Error("CALLBACK_TOKEN_REQUEST_MISMATCH");
    }

    if (Date.now() > payload.expiresAt) {
        throw new Error("CALLBACK_TOKEN_EXPIRED");
    }

    return payload;
}
