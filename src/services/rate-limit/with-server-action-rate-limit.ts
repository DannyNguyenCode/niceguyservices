import "server-only";

import { formatRateLimitRetryMessage } from "@/src/services/rate-limit/create-rate-limit-response";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { logImportantRateLimitEvent } from "@/src/services/rate-limit/log-rate-limit-event";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

export type ServerActionRateLimitState = {
    ok: boolean;
    message?: string;
    rateLimited?: boolean;
    retryAfterSeconds?: number;
    resetAt?: string;
};

export async function withServerActionRateLimit<T extends ServerActionRateLimitState>(
    input: {
        policyId: RateLimitPolicyId;
        websiteId?: string;
        cost?: number;
        action: () => Promise<T>;
    },
): Promise<T | ServerActionRateLimitState> {
    try {
        const { enforceAdministratorActionRateLimit } = await import(
            "@/src/services/rate-limit/enforce-action-rate-limit"
        );
        await enforceAdministratorActionRateLimit({
            policyId: input.policyId,
            websiteId: input.websiteId,
            cost: input.cost,
        });
        return input.action();
    } catch (error) {
        if (!isRateLimitError(error)) {
            throw error;
        }

        await logImportantRateLimitEvent({
            policyId: input.policyId,
            retryAfterSeconds: error.retryAfterSeconds,
            websiteId: input.websiteId ?? null,
            action: input.policyId,
        });

        return {
            ok: false,
            rateLimited: true,
            retryAfterSeconds: error.retryAfterSeconds,
            resetAt: error.resetAt.toISOString(),
            message: `This action was used too many times recently. ${formatRateLimitRetryMessage(error.retryAfterSeconds)}`,
        };
    }
}
