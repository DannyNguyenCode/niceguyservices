import { NextResponse } from "next/server";
import { createRateLimitResponseFromError } from "@/src/services/rate-limit/create-rate-limit-response";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { logImportantRateLimitEvent } from "@/src/services/rate-limit/log-rate-limit-event";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

export async function handleRouteRateLimitError(
    error: unknown,
    context?: {
        policyId?: RateLimitPolicyId;
        websiteId?: string | null;
        auditRunId?: string | null;
    },
): Promise<NextResponse | null> {
    if (!isRateLimitError(error)) {
        return null;
    }

    if (context?.policyId) {
        await logImportantRateLimitEvent({
            policyId: context.policyId,
            retryAfterSeconds: error.retryAfterSeconds,
            websiteId: context.websiteId,
            auditRunId: context.auditRunId,
        });
    }

    return createRateLimitResponseFromError(error);
}
