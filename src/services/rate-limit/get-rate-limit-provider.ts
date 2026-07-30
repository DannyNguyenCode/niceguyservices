import { getRateLimitEnv, getRateLimitRedisConfig, isRateLimitBypassActive } from "@/src/config/env";
import type { RateLimitProvider } from "@/src/services/rate-limit/rate-limit-provider";
import { getInMemoryRateLimitProvider } from "@/src/services/rate-limit/providers/in-memory-rate-limit-provider";
import { NoopRateLimitProvider } from "@/src/services/rate-limit/providers/noop-rate-limit-provider";
import { RedisRateLimitProvider } from "@/src/services/rate-limit/providers/redis-rate-limit-provider";

let provider: RateLimitProvider | null = null;

export function getRateLimitProvider(): RateLimitProvider {
    if (isRateLimitBypassActive()) {
        return new NoopRateLimitProvider();
    }

    if (!provider) {
        const env = getRateLimitEnv();
        const memory = getInMemoryRateLimitProvider();

        if (env.provider === "noop") {
            provider = new NoopRateLimitProvider();
        } else if (env.provider === "redis") {
            const redisConfig = getRateLimitRedisConfig();
            if (!redisConfig) {
                throw new Error("Redis rate-limit provider is not configured.");
            }
            provider = new RedisRateLimitProvider(redisConfig, memory);
        } else {
            provider = memory;
        }
    }

    return provider;
}

export function resetRateLimitProviderForTests(): void {
    provider = null;
}
