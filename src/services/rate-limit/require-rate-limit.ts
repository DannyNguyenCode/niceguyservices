import { checkRateLimit } from "@/src/services/rate-limit/check-rate-limit";
import { RATE_LIMIT_ERROR_CODES } from "@/src/services/rate-limit/constants";
import {
    RateLimitError,
    toRateLimitError,
} from "@/src/services/rate-limit/rate-limit-error";
import type { RateLimitResult } from "@/src/services/rate-limit/rate-limit-provider";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

const POLICY_ERROR_CODES: Partial<Record<RateLimitPolicyId, string>> = {
    "auth-login-ip": RATE_LIMIT_ERROR_CODES.LOGIN_EXCEEDED,
    "auth-login-account": RATE_LIMIT_ERROR_CODES.LOGIN_EXCEEDED,
    "public-report-view": RATE_LIMIT_ERROR_CODES.PUBLIC_RESOURCE_EXCEEDED,
    "public-demo-view": RATE_LIMIT_ERROR_CODES.PUBLIC_RESOURCE_EXCEEDED,
    "public-pdf-download": RATE_LIMIT_ERROR_CODES.PUBLIC_RESOURCE_EXCEEDED,
    "pagespeed-global-daily": RATE_LIMIT_ERROR_CODES.BUDGET_EXCEEDED,
    "ai-analysis-global-daily": RATE_LIMIT_ERROR_CODES.BUDGET_EXCEEDED,
};

export async function requireRateLimit(input: {
    policyId: RateLimitPolicyId;
    identifiers: string[];
    cost?: number;
    now?: Date;
}): Promise<RateLimitResult> {
    if (!input.identifiers.length || input.identifiers.some((value) => !value.trim())) {
        throw new RateLimitError({
            code: RATE_LIMIT_ERROR_CODES.INVALID_IDENTITY,
            policyId: input.policyId,
            retryAfterSeconds: 60,
            resetAt: new Date(Date.now() + 60_000),
            message: "Unable to process this request.",
        });
    }

    const result = await checkRateLimit(input);
    if (!result.allowed) {
        const code =
            POLICY_ERROR_CODES[input.policyId] ?? RATE_LIMIT_ERROR_CODES.ACTION_EXCEEDED;
        throw toRateLimitError(input.policyId, result, code);
    }

    return result;
}
