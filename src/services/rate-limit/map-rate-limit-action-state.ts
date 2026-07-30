import { formatRateLimitRetryMessage } from "@/src/services/rate-limit/create-rate-limit-response";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { logImportantRateLimitEvent } from "@/src/services/rate-limit/log-rate-limit-event";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

export type ActionRateLimitState = {
    ok: false;
    rateLimited: true;
    message: string;
    retryAfterSeconds: number;
    resetAt: string;
};

export async function mapRateLimitErrorToActionState(
    error: unknown,
    context?: {
        policyId?: RateLimitPolicyId;
        websiteId?: string | null;
    },
): Promise<ActionRateLimitState | null> {
    if (!isRateLimitError(error)) {
        return null;
    }

    if (context?.policyId) {
        await logImportantRateLimitEvent({
            policyId: context.policyId,
            retryAfterSeconds: error.retryAfterSeconds,
            websiteId: context.websiteId ?? null,
            action: context.policyId,
        });
    }

    return {
        ok: false,
        rateLimited: true,
        retryAfterSeconds: error.retryAfterSeconds,
        resetAt: error.resetAt.toISOString(),
        message: `This action was used too many times recently. ${formatRateLimitRetryMessage(error.retryAfterSeconds)}`,
    };
}
