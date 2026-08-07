import { NextResponse } from "next/server";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";

export function createRateLimitResponse(error: {
    code: string;
    message: string;
    retryAfterSeconds: number;
    resetAt: Date;
    limit?: number;
    remaining?: number;
}): NextResponse {
    const headers = new Headers({
        "Cache-Control": "private, no-store",
        "Retry-After": String(Math.max(1, error.retryAfterSeconds)),
        "RateLimit-Limit": String(error.limit ?? 0),
        "RateLimit-Remaining": String(Math.max(0, error.remaining ?? 0)),
        "RateLimit-Reset": String(Math.floor(error.resetAt.getTime() / 1000)),
    });

    return NextResponse.json(
        {
            error: {
                code: error.code,
                message: error.message,
                retryAfterSeconds: error.retryAfterSeconds,
                resetAt: error.resetAt.toISOString(),
            },
        },
        { status: 429, headers },
    );
}

export function createRateLimitResponseFromError(error: unknown): NextResponse | null {
    if (!isRateLimitError(error)) {
        return null;
    }
    return createRateLimitResponse({
        code: error.code,
        message: error.message,
        retryAfterSeconds: error.retryAfterSeconds,
        resetAt: error.resetAt,
        limit: error.limit,
        remaining: error.remaining,
    });
}

export function formatRateLimitRetryMessage(retryAfterSeconds: number): string {
    const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
    if (minutes === 1) {
        return "Try again in approximately 1 minute.";
    }
    return `Try again in approximately ${minutes} minutes.`;
}
