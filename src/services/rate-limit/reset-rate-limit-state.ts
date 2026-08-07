import { resetRateLimitEnvCacheForTests } from "@/src/config/env";
import { resetRateLimitProviderForTests } from "@/src/services/rate-limit/get-rate-limit-provider";
import { resetInMemoryRateLimitProvider } from "@/src/services/rate-limit/providers/in-memory-rate-limit-provider";

export function resetRateLimitState(): void {
    resetInMemoryRateLimitProvider();
    resetRateLimitProviderForTests();
    resetRateLimitEnvCacheForTests();
}
