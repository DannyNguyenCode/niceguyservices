import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import {
    getAuditPackageTokenTtlMs,
    getCursorAnalysisConfig,
} from "@/src/services/cursor-analysis/config";
import { applyVercelAutomationBypass } from "@/src/services/cursor-analysis/vercel-automation-bypass";

export type AuditPackageTokenPayload = {
    auditId: string;
    analysisRequestId: string;
    expiresAt: number;
};

function readPackageSigningSecret(): string {
    const secret = getCursorAnalysisConfig().packageSigningSecret;
    if (!secret) {
        throw new Error("AUDIT_PACKAGE_SIGNING_SECRET is not configured.");
    }
    return secret;
}

function signPayload(encodedPayload: string): string {
    return createHmac("sha256", readPackageSigningSecret())
        .update(encodedPayload)
        .digest("base64url");
}

export function buildAuditPackageToken(input: {
    auditId: string;
    analysisRequestId: string;
    ttlMs?: number;
}): string {
    const payload: AuditPackageTokenPayload = {
        auditId: input.auditId,
        analysisRequestId: input.analysisRequestId,
        expiresAt: Date.now() + (input.ttlMs ?? getAuditPackageTokenTtlMs()),
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = signPayload(encodedPayload);
    return `${encodedPayload}.${signature}`;
}

export function verifyAuditPackageToken(
    token: string,
    expectedAuditId: string,
    expectedAnalysisRequestId?: string,
): AuditPackageTokenPayload {
    const [encodedPayload, signature] = token.split(".");
    if (!encodedPayload || !signature) {
        throw new Error("AUDIT_PACKAGE_TOKEN_INVALID");
    }

    const expectedSignature = signPayload(encodedPayload);
    const provided = Buffer.from(signature);
    const expected = Buffer.from(expectedSignature);
    if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
        throw new Error("AUDIT_PACKAGE_TOKEN_INVALID");
    }

    let payload: AuditPackageTokenPayload;
    try {
        payload = JSON.parse(
            Buffer.from(encodedPayload, "base64url").toString("utf8"),
        ) as AuditPackageTokenPayload;
    } catch {
        throw new Error("AUDIT_PACKAGE_TOKEN_INVALID");
    }

    if (payload.auditId !== expectedAuditId) {
        throw new Error("AUDIT_PACKAGE_TOKEN_AUDIT_MISMATCH");
    }
    if (!payload.analysisRequestId) {
        throw new Error("AUDIT_PACKAGE_TOKEN_INVALID");
    }
    if (expectedAnalysisRequestId && payload.analysisRequestId !== expectedAnalysisRequestId) {
        throw new Error("AUDIT_PACKAGE_TOKEN_REQUEST_MISMATCH");
    }
    if (Date.now() > payload.expiresAt) {
        throw new Error("AUDIT_PACKAGE_TOKEN_EXPIRED");
    }

    return payload;
}

export function buildSignedPackageUrl(input: {
    auditId: string;
    analysisRequestId: string;
    publicBaseUrl: string;
}): string {
    const token = buildAuditPackageToken({
        auditId: input.auditId,
        analysisRequestId: input.analysisRequestId,
    });
    const base = input.publicBaseUrl.replace(/\/$/, "");
    const url = `${base}/api/audits/${encodeURIComponent(input.auditId)}/analysis-package?token=${encodeURIComponent(token)}`;
    return applyVercelAutomationBypass(url);
}

export function buildAnalysisCallbackUrl(input: {
    auditId: string;
    publicBaseUrl: string;
}): string {
    const base = input.publicBaseUrl.replace(/\/$/, "");
    const url = `${base}/api/audits/${encodeURIComponent(input.auditId)}/analysis-callback`;
    return applyVercelAutomationBypass(url);
}
