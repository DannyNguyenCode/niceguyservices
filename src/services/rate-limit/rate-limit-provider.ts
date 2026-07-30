import type { RateLimitPolicy } from "@/src/services/rate-limit/rate-limit-policies";

export type RateLimitRequest = {
    key: string;
    policy: RateLimitPolicy;
    cost?: number;
    now?: Date;
};

export type RateLimitResult = {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetAt: Date;
    retryAfterSeconds: number;
    reason?: string;
};

export interface RateLimitProvider {
    check(input: RateLimitRequest): Promise<RateLimitResult>;
    reset?(): Promise<void> | void;
}
