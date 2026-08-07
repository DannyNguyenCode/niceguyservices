import "server-only";

import {
    getHashedEmailRateLimitKey,
    getHashedIpRateLimitKey,
    normalizeLoginEmail,
} from "@/src/services/rate-limit/rate-limit-identity";
import { requireRateLimit } from "@/src/services/rate-limit/require-rate-limit";
import { RATE_LIMIT_ERROR_CODES } from "@/src/services/rate-limit/constants";
import { RateLimitError } from "@/src/services/rate-limit/rate-limit-error";

export async function enforceLoginRateLimits(input: {
    email: string;
    ip: string | null;
}): Promise<void> {
    if (input.ip) {
        await requireRateLimit({
            policyId: "auth-login-ip",
            identifiers: [getHashedIpRateLimitKey(input.ip)],
        });
    }

    const normalizedEmail = normalizeLoginEmail(input.email);
    if (!normalizedEmail) {
        throw new RateLimitError({
            code: RATE_LIMIT_ERROR_CODES.INVALID_IDENTITY,
            policyId: "auth-login-account",
            retryAfterSeconds: 60,
            resetAt: new Date(Date.now() + 60_000),
            message: "Unable to process this request.",
        });
    }

    await requireRateLimit({
        policyId: "auth-login-account",
        identifiers: [getHashedEmailRateLimitKey(normalizedEmail)],
    });
}

export async function enforceLoginRateLimitsFromRequest(input: {
    email: string;
    request: Request;
}): Promise<void> {
    const { getClientIp } = await import("@/src/services/rate-limit/rate-limit-identity");
    await enforceLoginRateLimits({
        email: input.email,
        ip: getClientIp(input.request),
    });
}
