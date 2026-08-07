import "server-only";

import {
    getClientIp,
    getClientIpFromHeaders,
    getHashedEmailRateLimitKey,
    getHashedIpRateLimitKey,
    getPublicTokenIdentityFromRawToken,
} from "@/src/services/rate-limit/rate-limit-identity";
import { requireRateLimit } from "@/src/services/rate-limit/require-rate-limit";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

async function enforcePublicCompositeLimit(input: {
    policyId: RateLimitPolicyId;
    request: Request;
    tokenIdentity: string;
}): Promise<void> {
    const ip = getClientIp(input.request);
    const identifiers = [
        ip ? getHashedIpRateLimitKey(ip) : "ip:unknown",
        input.tokenIdentity,
    ];
    await requireRateLimit({
        policyId: input.policyId,
        identifiers,
    });
}

export async function enforcePublicReportViewRateLimit(input: {
    request: Request;
    rawToken: string;
}): Promise<void> {
    await enforcePublicCompositeLimit({
        policyId: "public-report-view",
        request: input.request,
        tokenIdentity: getPublicTokenIdentityFromRawToken(input.rawToken),
    });
}

export async function enforcePublicDemoViewRateLimit(input: {
    request: Request;
    rawToken: string;
}): Promise<void> {
    await enforcePublicCompositeLimit({
        policyId: "public-demo-view",
        request: input.request,
        tokenIdentity: getPublicTokenIdentityFromRawToken(input.rawToken),
    });
}

export async function enforcePublicPdfDownloadRateLimit(input: {
    request: Request;
    resourceKey: string;
}): Promise<void> {
    const ip = getClientIp(input.request);
    await requireRateLimit({
        policyId: "public-pdf-download",
        identifiers: [
            ip ? getHashedIpRateLimitKey(ip) : "ip:unknown",
            `resource:${input.resourceKey.slice(0, 16)}`,
        ],
    });
}

/**
 * Rate-limits public audit intake before MongoDB writes / orchestration.
 * Prefer passing businessEmail so IP hourly + IP daily + email daily limits all apply.
 */
export async function enforcePublicAuditSubmitRateLimit(input?: {
    businessEmail?: string;
}): Promise<void> {
    if (input?.businessEmail) {
        const { enforcePublicAuditSubmitRateLimits } = await import(
            "@/src/services/public-audit-protection/enforce-public-audit-limits"
        );
        await enforcePublicAuditSubmitRateLimits({
            businessEmail: input.businessEmail,
        });
        return;
    }

    const ip = await getClientIpFromHeaders();
    await requireRateLimit({
        policyId: "public-audit-submit",
        identifiers: [ip ? getHashedIpRateLimitKey(ip) : "ip:unknown"],
    });
}

export async function enforcePublicReportLookupRequestRateLimit(input: {
    request: Request;
    normalizedEmail: string;
}): Promise<void> {
    const ip = getClientIp(input.request);
    await requireRateLimit({
        policyId: "public-report-lookup-request-ip",
        identifiers: [ip ? getHashedIpRateLimitKey(ip) : "ip:unknown"],
    });
    await requireRateLimit({
        policyId: "public-report-lookup-request-email",
        identifiers: [getHashedEmailRateLimitKey(input.normalizedEmail)],
    });
}

export async function enforcePublicReportLookupVerifyRateLimit(input: {
    request: Request;
}): Promise<void> {
    const ip = getClientIp(input.request);
    await requireRateLimit({
        policyId: "public-report-lookup-verify-ip",
        identifiers: [ip ? getHashedIpRateLimitKey(ip) : "ip:unknown"],
    });
}

export async function enforcePublicAuditStatusRateLimit(input: {
    request: Request;
    rawToken: string;
}): Promise<void> {
    await enforcePublicCompositeLimit({
        policyId: "public-audit-status",
        request: input.request,
        tokenIdentity: getPublicTokenIdentityFromRawToken(input.rawToken),
    });
}

export async function enforcePublicAuditReportEmailRateLimit(input: {
    request: Request;
    rawToken: string;
}): Promise<void> {
    await enforcePublicCompositeLimit({
        policyId: "public-audit-report-email",
        request: input.request,
        tokenIdentity: getPublicTokenIdentityFromRawToken(input.rawToken),
    });
}
