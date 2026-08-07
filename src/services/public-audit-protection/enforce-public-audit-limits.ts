import "server-only";

import { PUBLIC_AUDIT_RATE_LIMITED_MESSAGE } from "@/src/services/public-audit-protection/constants";
import {
    getClientIpFromHeaders,
    getHashedEmailRateLimitKey,
    getHashedIpRateLimitKey,
    normalizeLoginEmail,
} from "@/src/services/rate-limit/rate-limit-identity";
import { requireRateLimit } from "@/src/services/rate-limit/require-rate-limit";

/**
 * Enforce layered IP + email rate limits for PUBLIC customer audit submissions.
 * Uses hashed identifiers only. Order: IP/hour → IP/day → email/24h.
 */
export async function enforcePublicAuditSubmitRateLimits(input: {
    businessEmail: string;
}): Promise<void> {
    const ip = await getClientIpFromHeaders();
    const ipKey = ip ? getHashedIpRateLimitKey(ip) : "ip:unknown";
    const emailKey = getHashedEmailRateLimitKey(
        normalizeLoginEmail(input.businessEmail),
    );

    await requireRateLimit({
        policyId: "public-audit-submit",
        identifiers: [ipKey],
    });
    await requireRateLimit({
        policyId: "public-audit-submit-ip-day",
        identifiers: [ipKey],
    });
    await requireRateLimit({
        policyId: "public-audit-submit-email",
        identifiers: [emailKey],
    });
}

export { PUBLIC_AUDIT_RATE_LIMITED_MESSAGE };
