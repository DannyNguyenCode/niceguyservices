"use client";

type RateLimitErrorPayload = {
    error?: {
        code?: string;
        message?: string;
        retryAfterSeconds?: number;
        resetAt?: string;
    };
    rateLimited?: boolean;
    retryAfterSeconds?: number;
    resetAt?: string;
    message?: string;
};

export function isRateLimitResponse(
    response: Response,
    payload?: RateLimitErrorPayload | null,
): boolean {
    if (response.status === 429) {
        return true;
    }
    return Boolean(
        payload?.rateLimited ||
            payload?.error?.code?.startsWith("RATE_LIMIT"),
    );
}

export function getRateLimitMessage(
    payload?: RateLimitErrorPayload | null,
    fallback = "This action was used too many times recently.",
): string {
    if (payload?.message) {
        return payload.message;
    }
    const retryAfterSeconds =
        payload?.retryAfterSeconds ?? payload?.error?.retryAfterSeconds;
    if (retryAfterSeconds) {
        const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
        return `${fallback} Try again in approximately ${minutes} minute${minutes === 1 ? "" : "s"}.`;
    }
    return `${fallback} Please try again later.`;
}

export function getRateLimitResetLabel(payload?: RateLimitErrorPayload | null): string | null {
    const resetAt = payload?.resetAt ?? payload?.error?.resetAt;
    if (!resetAt) {
        return null;
    }
    const date = new Date(resetAt);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return `Available after ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}
