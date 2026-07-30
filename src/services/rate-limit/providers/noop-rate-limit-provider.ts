import type {
    RateLimitProvider,
    RateLimitRequest,
    RateLimitResult,
} from "@/src/services/rate-limit/rate-limit-provider";

export class NoopRateLimitProvider implements RateLimitProvider {
    async check(request: RateLimitRequest): Promise<RateLimitResult> {
        const now = request.now ?? new Date();
        return {
            allowed: true,
            limit: request.policy.limit,
            remaining: request.policy.limit,
            resetAt: new Date(now.getTime() + request.policy.windowSeconds * 1000),
            retryAfterSeconds: 0,
        };
    }
}
