import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { getRateLimitEnv, resetRateLimitEnvCacheForTests } from "@/src/config/env";
import { checkRateLimit } from "@/src/services/rate-limit/check-rate-limit";
import { getRateLimitPolicy } from "@/src/services/rate-limit/rate-limit-policies";
import { hashRateLimitIdentifier } from "@/src/services/rate-limit/hash-rate-limit-identifier";
import {
    buildRateLimitStorageKey,
    getClientIp,
    getHashedEmailRateLimitKey,
    getHashedIpRateLimitKey,
    getPublicTokenIdentityFromRawToken,
    normalizeIpAddressForTests,
    normalizeLoginEmail,
} from "@/src/services/rate-limit/rate-limit-identity";
import { RATE_LIMIT_KEY_VERSION } from "@/src/services/rate-limit/constants";
import { requireRateLimit } from "@/src/services/rate-limit/require-rate-limit";
import { RateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { resetRateLimitState } from "@/src/services/rate-limit/reset-rate-limit-state";
import {
    calculateDemoGenerationCost,
    calculatePageSpeedCost,
    calculateScreenshotCost,
} from "@/src/services/rate-limit/cost-rules";
import { createRateLimitResponse } from "@/src/services/rate-limit/create-rate-limit-response";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    resetRateLimitState();
    process.env = {
        ...ORIGINAL_ENV,
        NODE_ENV: "test",
        RATE_LIMIT_PROVIDER: "memory",
        RATE_LIMIT_BYPASS_MODE: "disabled",
        RATE_LIMIT_HASH_SECRET: "test-hash-secret",
    };
    resetRateLimitEnvCacheForTests();
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetRateLimitState();
    resetRateLimitEnvCacheForTests();
});

describe("rate-limit policies", () => {
    it("loads valid policy configuration", () => {
        const policy = getRateLimitPolicy("crawl-start");
        assert.equal(policy.id, "crawl-start");
        assert.equal(policy.limit, 3);
        assert.equal(policy.windowSeconds, 600);
        assert.equal(policy.failureMode, "closed");
    });

    it("applies environment overrides", () => {
        process.env.RATE_LIMIT_AUDIT_START_LIMIT = "5";
        resetRateLimitEnvCacheForTests();
        const policy = getRateLimitPolicy("audit-start");
        assert.equal(policy.limit, 5);
    });
});

describe("rate-limit identity", () => {
    it("uses namespaced versioned keys without raw identifiers", () => {
        const key = buildRateLimitStorageKey("auth-login-ip", [
            getHashedIpRateLimitKey("203.0.113.10"),
        ]);
        assert.match(key, new RegExp(`^rate:${RATE_LIMIT_KEY_VERSION}:auth-login-ip:`));
        assert.doesNotMatch(key, /203\.0\.113\.10/);
    });

    it("normalizes proxy IP headers with ports and forwarded lists", () => {
        assert.equal(normalizeIpAddressForTests("203.0.113.10:54321"), "203.0.113.10");
        assert.equal(
            normalizeIpAddressForTests("203.0.113.10, 198.51.100.1"),
            "203.0.113.10",
        );
        assert.equal(normalizeIpAddressForTests("[2001:db8::1]:443"), "2001:db8::1");
    });

    it("reads client IP from trusted proxy headers on Request", () => {
        process.env.RATE_LIMIT_TRUST_PROXY_HEADERS = "true";
        const request = new Request("http://example.com", {
            headers: { "x-forwarded-for": "203.0.113.44:1234, 198.51.100.1" },
        });
        assert.equal(getClientIp(request), "203.0.113.44");
    });

    it("hashes equivalent normalized emails to the same account key", () => {
        const first = getHashedEmailRateLimitKey(normalizeLoginEmail(" Admin@Example.com "));
        const second = getHashedEmailRateLimitKey(normalizeLoginEmail("admin@example.com"));
        assert.equal(first, second);
        assert.doesNotMatch(first, /admin@example.com/i);
    });

    it("does not place raw public tokens in keys", () => {
        const token = "abcdefghijklmnopqrstuvwxyz123456";
        const identity = getPublicTokenIdentityFromRawToken(token);
        assert.doesNotMatch(identity, new RegExp(token));
    });
});

describe("in-memory provider", () => {
    it("allows requests up to the configured limit", async () => {
        const identifiers = ["admin:test", "website:site-1"];
        for (let index = 0; index < 3; index += 1) {
            const result = await checkRateLimit({
                policyId: "crawl-start",
                identifiers,
            });
            assert.equal(result.allowed, true);
        }

        const blocked = await checkRateLimit({
            policyId: "crawl-start",
            identifiers,
        });
        assert.equal(blocked.allowed, false);
        assert.ok(blocked.retryAfterSeconds >= 1);
    });

    it("supports token cost greater than one", async () => {
        const identifiers = ["admin:test", "website:site-2"];
        const first = await checkRateLimit({
            policyId: "pagespeed-run",
            identifiers,
            cost: 2,
        });
        assert.equal(first.allowed, true);

        const second = await checkRateLimit({
            policyId: "pagespeed-run",
            identifiers,
            cost: 2,
        });
        assert.equal(second.allowed, true);

        const blocked = await checkRateLimit({
            policyId: "pagespeed-run",
            identifiers,
            cost: 1,
        });
        assert.equal(blocked.allowed, false);
    });

    it("resets state between tests", async () => {
        const identifiers = ["admin:test", "website:site-3"];
        for (let index = 0; index < 3; index += 1) {
            await checkRateLimit({ policyId: "crawl-start", identifiers });
        }
        resetRateLimitState();
        const allowed = await checkRateLimit({ policyId: "crawl-start", identifiers });
        assert.equal(allowed.allowed, true);
    });
});

describe("login rate limits", () => {
    it("blocks excessive login attempts by account key", async () => {
        const identifiers = [getHashedEmailRateLimitKey(normalizeLoginEmail("unknown-user@example.com"))];

        for (let index = 0; index < 8; index += 1) {
            await requireRateLimit({
                policyId: "auth-login-account",
                identifiers,
            });
        }

        await assert.rejects(
            () => requireRateLimit({ policyId: "auth-login-account", identifiers }),
            (error: unknown) => {
                assert.ok(error instanceof RateLimitError);
                assert.equal(error.code, "RATE_LIMIT_LOGIN_EXCEEDED");
                return true;
            },
        );
    });

    it("does not store raw email in hashed account key", () => {
        const hashed = hashRateLimitIdentifier(normalizeLoginEmail("person@example.com"));
        assert.doesNotMatch(hashed, /person@example.com/);
    });
});

describe("requireRateLimit", () => {
    it("throws controlled rate-limit errors with retry metadata", async () => {
        const identifiers = ["admin:another", "website:site-4"];
        for (let index = 0; index < 3; index += 1) {
            await requireRateLimit({ policyId: "audit-start", identifiers });
        }

        await assert.rejects(
            () => requireRateLimit({ policyId: "audit-start", identifiers }),
            (error: unknown) => {
                assert.ok(error instanceof RateLimitError);
                assert.equal(error.policyId, "audit-start");
                assert.ok(error.retryAfterSeconds >= 1);
                assert.ok(error.resetAt instanceof Date);
                return true;
            },
        );
    });
});

describe("cost calculations", () => {
    it("calculates PageSpeed cost by strategy count", () => {
        assert.equal(calculatePageSpeedCost(["mobile"]), 1);
        assert.equal(calculatePageSpeedCost(["mobile", "desktop"]), 2);
    });

    it("calculates screenshot buckets server-side", () => {
        assert.equal(calculateScreenshotCost(3), 1);
        assert.equal(calculateScreenshotCost(10), 2);
        assert.equal(calculateScreenshotCost(20), 3);
    });

    it("calculates demo generation cost by page count", () => {
        assert.equal(calculateDemoGenerationCost(1), 1);
        assert.equal(calculateDemoGenerationCost(3), 2);
    });
});

describe("API response helper", () => {
    it("returns safe 429 JSON and headers", () => {
        const resetAt = new Date("2026-07-29T05:00:00.000Z");
        const response = createRateLimitResponse({
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please try again later.",
            retryAfterSeconds: 120,
            resetAt,
            limit: 3,
            remaining: 0,
        });

        assert.equal(response.status, 429);
        assert.equal(response.headers.get("Retry-After"), "120");
        assert.equal(response.headers.get("Cache-Control"), "private, no-store");
    });
});

describe("production safeguards", () => {
    it("rejects in-memory provider in production", () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "production",
            RATE_LIMIT_PROVIDER: "memory",
        });
        resetRateLimitEnvCacheForTests();

        assert.throws(
            () => getRateLimitEnv(),
            /Production requires a distributed rate-limit provider/,
        );
    });

    it("allows in-memory provider in preview without Redis credentials", () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            VERCEL_ENV: "preview",
        });
        delete process.env.RATE_LIMIT_PROVIDER;
        delete process.env.RATE_LIMIT_REDIS_URL;
        delete process.env.RATE_LIMIT_REDIS_TOKEN;
        resetRateLimitEnvCacheForTests();

        assert.equal(getRateLimitEnv().provider, "memory");
    });
});

describe("public audit submission rate limit", () => {
    it("exposes a configurable IP policy with safe defaults", () => {
        const policy = getRateLimitPolicy("public-audit-submit");
        assert.equal(policy.scope, "ip");
        assert.equal(policy.limit, 5);
        assert.equal(policy.windowSeconds, 3600);
        assert.equal(policy.failureMode, "fallback");
    });

    it("enforces the public audit submit limit", async () => {
        const identity = [getHashedIpRateLimitKey("203.0.113.10")];
        for (let i = 0; i < 5; i += 1) {
            await requireRateLimit({
                policyId: "public-audit-submit",
                identifiers: identity,
            });
        }
        await assert.rejects(
            () =>
                requireRateLimit({
                    policyId: "public-audit-submit",
                    identifiers: identity,
                }),
            (error: unknown) => error instanceof RateLimitError,
        );
    });
});
