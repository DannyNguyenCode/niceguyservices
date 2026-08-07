import type { RateLimitPolicy } from "@/src/services/rate-limit/rate-limit-policies";
import type {
    RateLimitProvider,
    RateLimitRequest,
    RateLimitResult,
} from "@/src/services/rate-limit/rate-limit-provider";

type SlidingEntry = {
    timestamps: number[];
};

type FixedEntry = {
    count: number;
    windowStartMs: number;
};

type TokenBucketEntry = {
    tokens: number;
    lastRefillMs: number;
};

type StoreEntry = SlidingEntry | FixedEntry | TokenBucketEntry;

function getCost(request: RateLimitRequest): number {
    return Math.max(1, request.cost ?? request.policy.cost ?? 1);
}

function buildResult(input: {
    allowed: boolean;
    policy: RateLimitPolicy;
    remaining: number;
    resetAtMs: number;
    nowMs: number;
    reason?: string;
}): RateLimitResult {
    const retryAfterSeconds = Math.max(
        1,
        Math.ceil((input.resetAtMs - input.nowMs) / 1000),
    );
    return {
        allowed: input.allowed,
        limit: input.policy.limit,
        remaining: Math.max(0, input.remaining),
        resetAt: new Date(input.resetAtMs),
        retryAfterSeconds: input.allowed ? 0 : retryAfterSeconds,
        reason: input.reason,
    };
}

export class InMemoryRateLimitProvider implements RateLimitProvider {
    private store = new Map<string, StoreEntry>();
    private lastCleanupMs = 0;

    async check(request: RateLimitRequest): Promise<RateLimitResult> {
        const nowMs = (request.now ?? new Date()).getTime();
        const cost = getCost(request);
        this.cleanupExpired(nowMs);

        if (request.policy.algorithm === "fixed-window") {
            return this.checkFixedWindow(request.key, request.policy, cost, nowMs);
        }
        if (request.policy.algorithm === "token-bucket") {
            return this.checkTokenBucket(request.key, request.policy, cost, nowMs);
        }
        return this.checkSlidingWindow(request.key, request.policy, cost, nowMs);
    }

    reset(): void {
        this.store.clear();
        this.lastCleanupMs = 0;
    }

    private cleanupExpired(nowMs: number): void {
        if (nowMs - this.lastCleanupMs < 30_000) {
            return;
        }
        this.lastCleanupMs = nowMs;
        for (const [key, entry] of this.store.entries()) {
            if ("timestamps" in entry) {
                if (entry.timestamps.length === 0) {
                    this.store.delete(key);
                }
                continue;
            }
            if ("tokens" in entry) {
                continue;
            }
            const windowMs = 24 * 60 * 60 * 1000;
            if (nowMs - entry.windowStartMs > windowMs * 2) {
                this.store.delete(key);
            }
        }
    }

    private checkSlidingWindow(
        key: string,
        policy: RateLimitPolicy,
        cost: number,
        nowMs: number,
    ): RateLimitResult {
        const windowMs = policy.windowSeconds * 1000;
        const entry = (this.store.get(key) as SlidingEntry | undefined) ?? {
            timestamps: [],
        };
        const cutoff = nowMs - windowMs;
        entry.timestamps = entry.timestamps.filter((value) => value > cutoff);
        const used = entry.timestamps.length;
        const resetAtMs = nowMs + windowMs;

        if (used + cost > policy.limit) {
            this.store.set(key, entry);
            return buildResult({
                allowed: false,
                policy,
                remaining: Math.max(0, policy.limit - used),
                resetAtMs,
                nowMs,
                reason: "sliding-window-exceeded",
            });
        }

        for (let index = 0; index < cost; index += 1) {
            entry.timestamps.push(nowMs + index);
        }
        this.store.set(key, entry);
        return buildResult({
            allowed: true,
            policy,
            remaining: policy.limit - used - cost,
            resetAtMs,
            nowMs,
        });
    }

    private checkFixedWindow(
        key: string,
        policy: RateLimitPolicy,
        cost: number,
        nowMs: number,
    ): RateLimitResult {
        const windowMs = policy.windowSeconds * 1000;
        const current = (this.store.get(key) as FixedEntry | undefined) ?? {
            count: 0,
            windowStartMs: nowMs,
        };

        if (nowMs - current.windowStartMs >= windowMs) {
            current.count = 0;
            current.windowStartMs = nowMs;
        }

        const resetAtMs = current.windowStartMs + windowMs;
        if (current.count + cost > policy.limit) {
            this.store.set(key, current);
            return buildResult({
                allowed: false,
                policy,
                remaining: Math.max(0, policy.limit - current.count),
                resetAtMs,
                nowMs,
                reason: "fixed-window-exceeded",
            });
        }

        current.count += cost;
        this.store.set(key, current);
        return buildResult({
            allowed: true,
            policy,
            remaining: policy.limit - current.count,
            resetAtMs,
            nowMs,
        });
    }

    private checkTokenBucket(
        key: string,
        policy: RateLimitPolicy,
        cost: number,
        nowMs: number,
    ): RateLimitResult {
        const burst = policy.burst ?? policy.limit;
        const refillRate = policy.limit / policy.windowSeconds;
        const entry = (this.store.get(key) as TokenBucketEntry | undefined) ?? {
            tokens: burst,
            lastRefillMs: nowMs,
        };

        const elapsedSeconds = Math.max(0, (nowMs - entry.lastRefillMs) / 1000);
        entry.tokens = Math.min(burst, entry.tokens + elapsedSeconds * refillRate);
        entry.lastRefillMs = nowMs;

        const resetAtMs = nowMs + Math.ceil((cost - entry.tokens) / refillRate) * 1000;

        if (entry.tokens < cost) {
            this.store.set(key, entry);
            return buildResult({
                allowed: false,
                policy,
                remaining: Math.floor(entry.tokens),
                resetAtMs,
                nowMs,
                reason: "token-bucket-exceeded",
            });
        }

        entry.tokens -= cost;
        this.store.set(key, entry);
        return buildResult({
            allowed: true,
            policy,
            remaining: Math.floor(entry.tokens),
            resetAtMs: nowMs + policy.windowSeconds * 1000,
            nowMs,
        });
    }
}

let sharedInMemoryProvider: InMemoryRateLimitProvider | null = null;

export function getInMemoryRateLimitProvider(): InMemoryRateLimitProvider {
    if (!sharedInMemoryProvider) {
        sharedInMemoryProvider = new InMemoryRateLimitProvider();
    }
    return sharedInMemoryProvider;
}

export function resetInMemoryRateLimitProvider(): void {
    sharedInMemoryProvider?.reset();
    sharedInMemoryProvider = new InMemoryRateLimitProvider();
}
