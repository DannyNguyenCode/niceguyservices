import { RATE_LIMIT_ERROR_CODES } from "@/src/services/rate-limit/constants";
import type { RateLimitResult } from "@/src/services/rate-limit/rate-limit-provider";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

export class RateLimitError extends Error {
    code: string;
    policyId: RateLimitPolicyId | string;
    retryAfterSeconds: number;
    resetAt: Date;
    limit?: number;
    remaining?: number;

    constructor(input: {
        code?: string;
        message?: string;
        policyId: RateLimitPolicyId | string;
        retryAfterSeconds: number;
        resetAt: Date;
        limit?: number;
        remaining?: number;
    }) {
        super(input.message ?? "Too many requests. Please try again later.");
        this.name = "RateLimitError";
        this.code = input.code ?? RATE_LIMIT_ERROR_CODES.EXCEEDED;
        this.policyId = input.policyId;
        this.retryAfterSeconds = input.retryAfterSeconds;
        this.resetAt = input.resetAt;
        this.limit = input.limit;
        this.remaining = input.remaining;
    }
}

export function toRateLimitError(
    policyId: RateLimitPolicyId | string,
    result: RateLimitResult,
    code: string = RATE_LIMIT_ERROR_CODES.EXCEEDED,
): RateLimitError {
    return new RateLimitError({
        code,
        policyId,
        retryAfterSeconds: result.retryAfterSeconds,
        resetAt: result.resetAt,
        limit: result.limit,
        remaining: result.remaining,
        message: "Too many requests. Please try again later.",
    });
}

export function isRateLimitError(error: unknown): error is RateLimitError {
    return error instanceof RateLimitError;
}
