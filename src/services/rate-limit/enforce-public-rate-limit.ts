import "server-only";

import {
    getClientIp,
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
