import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import {
    getAuditPackageTokenTtlMs,
    getCursorAnalysisConfig,
} from "@/src/services/cursor-analysis/config";
import {
    applyVercelAutomationBypass,
    VERCEL_PROTECTION_BYPASS_QUERY_PARAM,
} from "@/src/services/cursor-analysis/vercel-automation-bypass";

export type AuditPackageTokenPayload = {
    auditId: string;
    analysisRequestId: string;
    expiresAt: number;
};

/** Explicit package-token failure codes for safe HTTP + server diagnostics. */
export const AUDIT_PACKAGE_TOKEN_ERROR_CODES = {
    MISSING: "AUDIT_PACKAGE_TOKEN_MISSING",
    MALFORMED: "AUDIT_PACKAGE_TOKEN_MALFORMED",
    DECODE_FAILED: "AUDIT_PACKAGE_TOKEN_DECODE_FAILED",
    SIGNATURE_INVALID: "AUDIT_PACKAGE_TOKEN_SIGNATURE_INVALID",
    EXPIRED: "AUDIT_PACKAGE_TOKEN_EXPIRED",
    AUDIT_MISMATCH: "AUDIT_PACKAGE_TOKEN_AUDIT_MISMATCH",
    REQUEST_MISMATCH: "AUDIT_PACKAGE_TOKEN_REQUEST_MISMATCH",
    SIGNING_SECRET_MISSING: "AUDIT_PACKAGE_SIGNING_SECRET_MISSING",
    INTERNAL_ERROR: "AUDIT_PACKAGE_TOKEN_INTERNAL_ERROR",
} as const;

export type AuditPackageTokenErrorCode =
    (typeof AUDIT_PACKAGE_TOKEN_ERROR_CODES)[keyof typeof AUDIT_PACKAGE_TOKEN_ERROR_CODES];

export class AuditPackageTokenError extends Error {
    readonly code: AuditPackageTokenErrorCode;
    readonly status: number;
    readonly publicMessage: string;

    constructor(
        code: AuditPackageTokenErrorCode,
        publicMessage: string,
        status: number = 401,
    ) {
        super(code);
        this.name = "AuditPackageTokenError";
        this.code = code;
        this.publicMessage = publicMessage;
        this.status = status;
    }
}

export type DeploymentIdentityDiagnostics = {
    vercelEnv: string | null;
    vercelUrlHostname: string | null;
    vercelGitCommitSha: string | null;
    vercelDeploymentId: string | null;
};

type SecretDiagnostics = {
    signingSecretConfigured: boolean;
    signingSecretLength: number | null;
    signingSecretFingerprint: string | null;
};

function logPackageTokenEvent(
    tag: string,
    fields: Record<string, unknown>,
    level: "info" | "error" = "info",
): void {
    const payload = JSON.stringify(fields);
    if (level === "error") {
        console.error(`[${tag}]`, payload);
        return;
    }
    console.info(`[${tag}]`, payload);
}

/** Official Vercel runtime identity fields when present. Never invent missing vars. */
export function getDeploymentIdentityDiagnostics(): DeploymentIdentityDiagnostics {
    const vercelUrl = process.env.VERCEL_URL?.trim() || null;
    let vercelUrlHostname: string | null = null;
    if (vercelUrl) {
        try {
            vercelUrlHostname = new URL(
                vercelUrl.includes("://") ? vercelUrl : `https://${vercelUrl}`,
            ).hostname;
        } catch {
            vercelUrlHostname = vercelUrl;
        }
    }

    return {
        vercelEnv: process.env.VERCEL_ENV?.trim() || null,
        vercelUrlHostname,
        vercelGitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA?.trim() || null,
        vercelDeploymentId: process.env.VERCEL_DEPLOYMENT_ID?.trim() || null,
    };
}

/**
 * Non-reversible diagnostic fingerprint of a secret (SHA-256 hex, first 8 chars).
 * Safe to compare across generator/verifier deployments; never recovers the secret.
 */
export function fingerprintSigningSecret(secret: string): string {
    return createHash("sha256").update(secret, "utf8").digest("hex").slice(0, 8);
}

export function getPackageSigningSecretDiagnostics(): SecretDiagnostics {
    const secret = getCursorAnalysisConfig().packageSigningSecret;
    if (!secret) {
        return {
            signingSecretConfigured: false,
            signingSecretLength: null,
            signingSecretFingerprint: null,
        };
    }
    return {
        signingSecretConfigured: true,
        signingSecretLength: secret.length,
        signingSecretFingerprint: fingerprintSigningSecret(secret),
    };
}

function readPackageSigningSecret(): string {
    const secret = getCursorAnalysisConfig().packageSigningSecret;
    if (!secret) {
        throw new AuditPackageTokenError(
            AUDIT_PACKAGE_TOKEN_ERROR_CODES.SIGNING_SECRET_MISSING,
            "Package signing is not configured.",
            500,
        );
    }
    return secret;
}

function signPayload(encodedPayload: string, secret: string): string {
    return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function appPublicUrlHostname(): string | null {
    const publicAppUrl = getCursorAnalysisConfig().publicAppUrl;
    if (!publicAppUrl) return null;
    try {
        return new URL(publicAppUrl).hostname;
    } catch {
        return null;
    }
}

export function buildAuditPackageToken(input: {
    auditId: string;
    analysisRequestId: string;
    ttlMs?: number;
}): string {
    const secret = readPackageSigningSecret();
    const ttlMs = input.ttlMs ?? getAuditPackageTokenTtlMs();
    const generatedAt = Date.now();
    const expiresAt = generatedAt + ttlMs;
    const payload: AuditPackageTokenPayload = {
        auditId: input.auditId,
        analysisRequestId: input.analysisRequestId,
        expiresAt,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = signPayload(encodedPayload, secret);
    const token = `${encodedPayload}.${signature}`;
    const deployment = getDeploymentIdentityDiagnostics();
    const secretDiagnostics = getPackageSigningSecretDiagnostics();

    logPackageTokenEvent("AUDIT_PACKAGE_TOKEN_GENERATED", {
        auditId: input.auditId,
        analysisRequestId: input.analysisRequestId,
        generatedAt,
        expiresAt,
        ttlSeconds: Math.floor(ttlMs / 1000),
        ttlMs,
        currentUnixTimestampMs: generatedAt,
        timestampUnit: "milliseconds",
        tokenLength: token.length,
        ...secretDiagnostics,
        appPublicUrlHostname: appPublicUrlHostname(),
        ...deployment,
    });

    return token;
}

export function verifyAuditPackageToken(
    token: string,
    expectedAuditId: string,
    expectedAnalysisRequestId?: string,
): AuditPackageTokenPayload {
    const deployment = getDeploymentIdentityDiagnostics();
    const secretDiagnostics = getPackageSigningSecretDiagnostics();
    const currentUnixTimestampMs = Date.now();

    try {
        if (!token?.trim()) {
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_MISSING",
                {
                    expectedAuditId,
                    expectedAnalysisRequestId: expectedAnalysisRequestId ?? null,
                    receivedTokenLength: 0,
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.MISSING,
                "Package token is required.",
            );
        }

        logPackageTokenEvent("AUDIT_PACKAGE_TOKEN_PRESENT", {
            expectedAuditId,
            expectedAnalysisRequestId: expectedAnalysisRequestId ?? null,
            receivedTokenLength: token.length,
            currentUnixTimestampMs,
            ...secretDiagnostics,
            ...deployment,
        });

        const parts = token.split(".");
        if (parts.length !== 2 || !parts[0] || !parts[1]) {
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_MALFORMED",
                {
                    expectedAuditId,
                    expectedAnalysisRequestId: expectedAnalysisRequestId ?? null,
                    receivedTokenLength: token.length,
                    partCount: parts.length,
                    hasEncodedPayload: Boolean(parts[0]),
                    hasSignaturePart: Boolean(parts[1]),
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.MALFORMED,
                "Package token is malformed.",
            );
        }

        const [encodedPayload, signature] = parts;

        let secret: string;
        try {
            secret = readPackageSigningSecret();
        } catch (error) {
            if (error instanceof AuditPackageTokenError) {
                logPackageTokenEvent(
                    "AUDIT_PACKAGE_SIGNING_SECRET_MISSING",
                    {
                        expectedAuditId,
                        expectedAnalysisRequestId: expectedAnalysisRequestId ?? null,
                        ...secretDiagnostics,
                        ...deployment,
                    },
                    "error",
                );
                throw error;
            }
            throw error;
        }

        const expectedSignature = signPayload(encodedPayload, secret);
        logPackageTokenEvent("AUDIT_PACKAGE_SIGNATURE_CALCULATED", {
            expectedAuditId,
            expectedAnalysisRequestId: expectedAnalysisRequestId ?? null,
            receivedTokenLength: token.length,
            providedSignatureLength: signature.length,
            expectedSignatureLength: expectedSignature.length,
            ...secretDiagnostics,
            ...deployment,
        });

        const provided = Buffer.from(signature);
        const expected = Buffer.from(expectedSignature);
        if (provided.length !== expected.length) {
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_SIGNATURE_INVALID",
                {
                    auditId: expectedAuditId,
                    analysisRequestId: expectedAnalysisRequestId ?? null,
                    tokenLength: token.length,
                    reason: "signature_length_mismatch",
                    providedSignatureLength: provided.length,
                    expectedSignatureLength: expected.length,
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.SIGNATURE_INVALID,
                "Invalid package token.",
            );
        }

        if (!timingSafeEqual(provided, expected)) {
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_SIGNATURE_INVALID",
                {
                    auditId: expectedAuditId,
                    analysisRequestId: expectedAnalysisRequestId ?? null,
                    tokenLength: token.length,
                    reason: "hmac_mismatch",
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.SIGNATURE_INVALID,
                "Invalid package token.",
            );
        }

        logPackageTokenEvent("AUDIT_PACKAGE_SIGNATURE_VALID", {
            expectedAuditId,
            expectedAnalysisRequestId: expectedAnalysisRequestId ?? null,
            receivedTokenLength: token.length,
            ...secretDiagnostics,
            ...deployment,
        });

        let payload: AuditPackageTokenPayload;
        try {
            payload = JSON.parse(
                Buffer.from(encodedPayload, "base64url").toString("utf8"),
            ) as AuditPackageTokenPayload;
        } catch {
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_DECODE_FAILED",
                {
                    expectedAuditId,
                    expectedAnalysisRequestId: expectedAnalysisRequestId ?? null,
                    receivedTokenLength: token.length,
                    encodedPayloadLength: encodedPayload.length,
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.DECODE_FAILED,
                "Package token could not be decoded.",
            );
        }

        if (
            typeof payload.auditId !== "string" ||
            typeof payload.analysisRequestId !== "string" ||
            typeof payload.expiresAt !== "number" ||
            !Number.isFinite(payload.expiresAt)
        ) {
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_MALFORMED",
                {
                    expectedAuditId,
                    expectedAnalysisRequestId: expectedAnalysisRequestId ?? null,
                    receivedTokenLength: token.length,
                    reason: "invalid_payload_structure",
                    hasAuditId: typeof payload.auditId === "string",
                    hasAnalysisRequestId: typeof payload.analysisRequestId === "string",
                    expiresAtType: typeof payload.expiresAt,
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.MALFORMED,
                "Package token is malformed.",
            );
        }

        logPackageTokenEvent("AUDIT_PACKAGE_TOKEN_STRUCTURE_VALID", {
            auditId: payload.auditId,
            analysisRequestId: payload.analysisRequestId,
            expiresAt: payload.expiresAt,
            timestampUnit: "milliseconds",
            currentUnixTimestampMs,
            ...secretDiagnostics,
            ...deployment,
        });

        if (payload.auditId !== expectedAuditId) {
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_AUDIT_MISMATCH",
                {
                    expectedAuditId,
                    tokenAuditId: payload.auditId,
                    analysisRequestId: payload.analysisRequestId,
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.AUDIT_MISMATCH,
                "Package token does not match audit.",
            );
        }

        logPackageTokenEvent("AUDIT_PACKAGE_AUDIT_ID_VALID", {
            auditId: payload.auditId,
            analysisRequestId: payload.analysisRequestId,
        });

        if (!payload.analysisRequestId) {
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_MALFORMED",
                {
                    expectedAuditId,
                    reason: "missing_analysis_request_id",
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.MALFORMED,
                "Package token is malformed.",
            );
        }

        if (
            expectedAnalysisRequestId &&
            payload.analysisRequestId !== expectedAnalysisRequestId
        ) {
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_REQUEST_MISMATCH",
                {
                    auditId: payload.auditId,
                    expectedAnalysisRequestId,
                    tokenAnalysisRequestId: payload.analysisRequestId,
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.REQUEST_MISMATCH,
                "Package token does not match analysis request.",
            );
        }

        logPackageTokenEvent("AUDIT_PACKAGE_REQUEST_ID_VALID", {
            auditId: payload.auditId,
            analysisRequestId: payload.analysisRequestId,
            expectedAnalysisRequestIdChecked: Boolean(expectedAnalysisRequestId),
        });

        if (currentUnixTimestampMs > payload.expiresAt) {
            const differenceSeconds = Math.floor(
                (currentUnixTimestampMs - payload.expiresAt) / 1000,
            );
            logPackageTokenEvent(
                "AUDIT_PACKAGE_TOKEN_EXPIRED",
                {
                    auditId: payload.auditId,
                    analysisRequestId: payload.analysisRequestId,
                    expiresAt: payload.expiresAt,
                    currentUnixTimestampMs,
                    differenceSeconds,
                    timestampUnit: "milliseconds",
                    ...secretDiagnostics,
                    ...deployment,
                },
                "error",
            );
            throw new AuditPackageTokenError(
                AUDIT_PACKAGE_TOKEN_ERROR_CODES.EXPIRED,
                "Package token expired.",
            );
        }

        logPackageTokenEvent("AUDIT_PACKAGE_TOKEN_NOT_EXPIRED", {
            auditId: payload.auditId,
            analysisRequestId: payload.analysisRequestId,
            expiresAt: payload.expiresAt,
            currentUnixTimestampMs,
            remainingSeconds: Math.floor((payload.expiresAt - currentUnixTimestampMs) / 1000),
            timestampUnit: "milliseconds",
        });

        logPackageTokenEvent("AUDIT_PACKAGE_TOKEN_VALID", {
            auditId: payload.auditId,
            analysisRequestId: payload.analysisRequestId,
            expiresAt: payload.expiresAt,
            receivedTokenLength: token.length,
            ...secretDiagnostics,
            ...deployment,
        });

        return payload;
    } catch (error) {
        if (error instanceof AuditPackageTokenError) {
            throw error;
        }

        logPackageTokenEvent(
            "AUDIT_PACKAGE_TOKEN_INTERNAL_ERROR",
            {
                expectedAuditId,
                expectedAnalysisRequestId: expectedAnalysisRequestId ?? null,
                receivedTokenLength: token?.length ?? 0,
                errorName: error instanceof Error ? error.name : "unknown",
                ...secretDiagnostics,
                ...deployment,
            },
            "error",
        );
        throw new AuditPackageTokenError(
            AUDIT_PACKAGE_TOKEN_ERROR_CODES.INTERNAL_ERROR,
            "Package token verification failed.",
            500,
        );
    }
}

/** Safe metadata about a package URL — never includes token or bypass secret values. */
export function inspectPackageUrlDiagnostics(packageUrl: string): {
    hostname: string | null;
    pathname: string | null;
    hasPackageToken: boolean;
    packageTokenLength: number | null;
    hasVercelProtectionBypass: boolean;
    queryParameterNames: string[];
} {
    try {
        const parsed = new URL(packageUrl);
        const token = parsed.searchParams.get("token");
        return {
            hostname: parsed.hostname,
            pathname: parsed.pathname,
            hasPackageToken: token !== null && token.length > 0,
            packageTokenLength: token?.length ?? null,
            hasVercelProtectionBypass: parsed.searchParams.has(
                VERCEL_PROTECTION_BYPASS_QUERY_PARAM,
            ),
            queryParameterNames: [...parsed.searchParams.keys()],
        };
    } catch {
        return {
            hostname: null,
            pathname: null,
            hasPackageToken: false,
            packageTokenLength: null,
            hasVercelProtectionBypass: false,
            queryParameterNames: [],
        };
    }
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
    const urlBeforeBypass = `${base}/api/audits/${encodeURIComponent(input.auditId)}/analysis-package?token=${encodeURIComponent(token)}`;
    const beforeDiagnostics = inspectPackageUrlDiagnostics(urlBeforeBypass);

    const url = applyVercelAutomationBypass(urlBeforeBypass);
    const afterDiagnostics = inspectPackageUrlDiagnostics(url);
    const deployment = getDeploymentIdentityDiagnostics();

    const tokenPreserved =
        beforeDiagnostics.packageTokenLength === afterDiagnostics.packageTokenLength &&
        beforeDiagnostics.hasPackageToken === afterDiagnostics.hasPackageToken;

    logPackageTokenEvent("AUDIT_PACKAGE_URL_CREATED", {
        auditId: input.auditId,
        analysisRequestId: input.analysisRequestId,
        hostname: afterDiagnostics.hostname,
        pathname: afterDiagnostics.pathname,
        hasPackageToken: afterDiagnostics.hasPackageToken,
        hasVercelProtectionBypass: afterDiagnostics.hasVercelProtectionBypass,
        queryParameterNames: afterDiagnostics.queryParameterNames,
        tokenLength: afterDiagnostics.packageTokenLength,
        tokenLengthBeforeBypass: beforeDiagnostics.packageTokenLength,
        tokenPreservedAcrossBypass: tokenPreserved,
        appPublicUrlHostname: appPublicUrlHostname(),
        ...deployment,
    });

    if (!tokenPreserved) {
        logPackageTokenEvent(
            "AUDIT_PACKAGE_URL_TOKEN_MUTATED",
            {
                auditId: input.auditId,
                analysisRequestId: input.analysisRequestId,
                tokenLengthBeforeBypass: beforeDiagnostics.packageTokenLength,
                tokenLengthAfterBypass: afterDiagnostics.packageTokenLength,
                ...deployment,
            },
            "error",
        );
    }

    return url;
}

export function buildAnalysisCallbackUrl(input: {
    auditId: string;
    publicBaseUrl: string;
}): string {
    const base = input.publicBaseUrl.replace(/\/$/, "");
    const url = `${base}/api/audits/${encodeURIComponent(input.auditId)}/analysis-callback`;
    return applyVercelAutomationBypass(url);
}

/** Safe webhook-ready diagnostics immediately before Cursor receives the package URL. */
export function logCursorWebhookPackageReady(input: {
    auditId: string;
    analysisRequestId: string;
    packageUrl: string;
    callbackUrl: string;
}): void {
    const packageDiagnostics = inspectPackageUrlDiagnostics(input.packageUrl);
    const callbackDiagnostics = inspectPackageUrlDiagnostics(input.callbackUrl);
    const deployment = getDeploymentIdentityDiagnostics();

    logPackageTokenEvent("CURSOR_WEBHOOK_PACKAGE_READY", {
        auditId: input.auditId,
        analysisRequestId: input.analysisRequestId,
        packageUrlHostname: packageDiagnostics.hostname,
        packageUrlPathname: packageDiagnostics.pathname,
        hasPackageToken: packageDiagnostics.hasPackageToken,
        packageTokenLength: packageDiagnostics.packageTokenLength,
        hasPreviewBypass: packageDiagnostics.hasVercelProtectionBypass,
        packageQueryParameterNames: packageDiagnostics.queryParameterNames,
        callbackUrlHostname: callbackDiagnostics.hostname,
        callbackUrlPathname: callbackDiagnostics.pathname,
        ...deployment,
    });
}
