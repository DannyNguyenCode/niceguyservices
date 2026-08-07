import type { RateLimitPolicy } from "@/src/services/rate-limit/rate-limit-policies";
import type {
    RateLimitProvider,
    RateLimitRequest,
    RateLimitResult,
} from "@/src/services/rate-limit/rate-limit-provider";

const SLIDING_WINDOW_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local cost = tonumber(ARGV[4])
local member_prefix = ARGV[5]
local clear_before = now - window
redis.call('ZREMRANGEBYSCORE', key, 0, clear_before)
local count = redis.call('ZCARD', key)
if count + cost > limit then
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local reset_at = now + window
  if oldest[2] then
    reset_at = tonumber(oldest[2]) + window
  end
  return {0, limit, math.max(0, limit - count), reset_at}
end
for i = 1, cost do
  redis.call('ZADD', key, now, member_prefix .. ':' .. i .. ':' .. math.random(1000000))
end
redis.call('PEXPIRE', key, window)
return {1, limit, limit - count - cost, now + window}
`;

const FIXED_WINDOW_LUA = `
local key = KEYS[1]
local window = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local cost = tonumber(ARGV[3])
local count = tonumber(redis.call('GET', key) or '0')
if count + cost > limit then
  local ttl = redis.call('PTTL', key)
  if ttl < 0 then ttl = window end
  return {0, limit, math.max(0, limit - count), redis.call('TIME')[1] * 1000 + ttl}
end
local new_count = redis.call('INCRBY', key, cost)
if new_count == cost then
  redis.call('PEXPIRE', key, window)
end
local ttl = redis.call('PTTL', key)
return {1, limit, limit - new_count, redis.call('TIME')[1] * 1000 + ttl}
`;

function getCost(request: RateLimitRequest): number {
    return Math.max(1, request.cost ?? request.policy.cost ?? 1);
}

function toResult(policy: RateLimitPolicy, payload: number[], nowMs: number): RateLimitResult {
    const allowed = payload[0] === 1;
    const limit = payload[1] ?? policy.limit;
    const remaining = payload[2] ?? 0;
    const resetAtMs = payload[3] ?? nowMs + policy.windowSeconds * 1000;
    const retryAfterSeconds = allowed
        ? 0
        : Math.max(1, Math.ceil((resetAtMs - nowMs) / 1000));

    return {
        allowed,
        limit,
        remaining: Math.max(0, remaining),
        resetAt: new Date(resetAtMs),
        retryAfterSeconds,
        reason: allowed ? undefined : "redis-limit-exceeded",
    };
}

export class RedisRateLimitProvider implements RateLimitProvider {
    constructor(
        private readonly config: { url: string; token: string },
        private readonly fallbackProvider: RateLimitProvider,
    ) {}

    async check(request: RateLimitRequest): Promise<RateLimitResult> {
        const now = request.now ?? new Date();
        const nowMs = now.getTime();
        const cost = getCost(request);

        try {
            if (request.policy.algorithm === "fixed-window") {
                const response = await this.eval(
                    FIXED_WINDOW_LUA,
                    [request.key],
                    [
                        String(request.policy.windowSeconds * 1000),
                        String(request.policy.limit),
                        String(cost),
                    ],
                );
                return toResult(request.policy, response, nowMs);
            }

            const response = await this.eval(
                SLIDING_WINDOW_LUA,
                [request.key],
                [
                    String(nowMs),
                    String(request.policy.windowSeconds * 1000),
                    String(request.policy.limit),
                    String(cost),
                    String(nowMs),
                ],
            );
            return toResult(request.policy, response, nowMs);
        } catch (error) {
            return this.handleProviderFailure(request, error);
        }
    }

    private async handleProviderFailure(
        request: RateLimitRequest,
        error: unknown,
    ): Promise<RateLimitResult> {
        console.error("[rate-limit] Redis provider failure", {
            policyId: request.policy.id,
            environment: process.env.NODE_ENV ?? "development",
        });

        if (request.policy.failureMode === "open") {
            const now = request.now ?? new Date();
            return {
                allowed: true,
                limit: request.policy.limit,
                remaining: request.policy.limit,
                resetAt: new Date(now.getTime() + request.policy.windowSeconds * 1000),
                retryAfterSeconds: 0,
                reason: "redis-open-fallback",
            };
        }

        if (request.policy.failureMode === "fallback") {
            return this.fallbackProvider.check(request);
        }

        const now = request.now ?? new Date();
        return {
            allowed: false,
            limit: request.policy.limit,
            remaining: 0,
            resetAt: new Date(now.getTime() + request.policy.windowSeconds * 1000),
            retryAfterSeconds: request.policy.windowSeconds,
            reason: "redis-closed-failure",
        };
    }

    private async eval(
        script: string,
        keys: string[],
        args: string[],
    ): Promise<number[]> {
        const response = await fetch(this.config.url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.config.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(["EVAL", script, String(keys.length), ...keys, ...args]),
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Redis command failed with status ${response.status}`);
        }

        const payload = (await response.json()) as { result?: unknown };
        if (!Array.isArray(payload.result)) {
            throw new Error("Redis command returned an invalid payload.");
        }

        return payload.result.map((value) => Number(value));
    }
}
