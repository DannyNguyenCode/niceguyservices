import { buildRateLimitStorageKey } from "@/src/services/rate-limit/rate-limit-identity";
import { getRateLimitProvider } from "@/src/services/rate-limit/get-rate-limit-provider";
import { getRateLimitPolicy } from "@/src/services/rate-limit/rate-limit-policies";
import type { RateLimitResult } from "@/src/services/rate-limit/rate-limit-provider";
import type { RateLimitPolicyId } from "@/src/validation/rate-limit";

export async function checkRateLimit(input: {
    policyId: RateLimitPolicyId;
    identifiers: string[];
    cost?: number;
    now?: Date;
}): Promise<RateLimitResult> {
    const policy = getRateLimitPolicy(input.policyId);
    const key = buildRateLimitStorageKey(policy.id, input.identifiers);
    const provider = getRateLimitProvider();
    return provider.check({
        key,
        policy,
        cost: input.cost,
        now: input.now,
    });
}
