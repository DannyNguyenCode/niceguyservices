import "server-only";

import { headers } from "next/headers";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { formatRateLimitRetryMessage } from "@/src/services/rate-limit/create-rate-limit-response";

export async function getRequestFromHeaders(): Promise<Request> {
    const headerStore = await headers();
    return new Request("http://rate-limit.local", { headers: headerStore });
}

export function getPublicRateLimitMessage(error: unknown): string | null {
    if (!isRateLimitError(error)) {
        return null;
    }
    return `This page was requested too many times recently. ${formatRateLimitRetryMessage(error.retryAfterSeconds)}`;
}
