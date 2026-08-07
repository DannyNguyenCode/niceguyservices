import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetRateLimitEnvCacheForTests } from "@/src/config/env";
import { getRateLimitPolicy } from "@/src/services/rate-limit/rate-limit-policies";
import {
    buildRateLimitStorageKey,
    getHashedEmailRateLimitKey,
    getHashedIpRateLimitKey,
    getPublicTokenIdentityFromRawToken,
    normalizeLoginEmail,
} from "@/src/services/rate-limit/rate-limit-identity";
import { RATE_LIMIT_KEY_VERSION } from "@/src/services/rate-limit/constants";
import { requireRateLimit } from "@/src/services/rate-limit/require-rate-limit";
import { RateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { resetRateLimitState } from "@/src/services/rate-limit/reset-rate-limit-state";

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

describe("Phase 17 — Rate limiting", () => {
    describe("policies", () => {
        it("loads crawl-start policy with closed failure mode", () => {
            const policy = getRateLimitPolicy("crawl-start");
            assert.equal(policy.id, "crawl-start");
            assert.equal(policy.failureMode, "closed");
        });

        it("applies environment overrides", () => {
            process.env.RATE_LIMIT_AUDIT_START_LIMIT = "5";
            resetRateLimitEnvCacheForTests();
            const policy = getRateLimitPolicy("audit-start");
            assert.equal(policy.limit, 5);
        });
    });

    describe("identity hashing", () => {
        it("uses namespaced keys without raw identifiers", () => {
            const key = buildRateLimitStorageKey("auth-login-ip", [
                getHashedIpRateLimitKey("203.0.113.10"),
            ]);
            assert.match(key, new RegExp(`^rate:${RATE_LIMIT_KEY_VERSION}:auth-login-ip:`));
            assert.doesNotMatch(key, /203\.0\.113\.10/);
        });

        it("hashes equivalent normalized emails to the same key", () => {
            const first = getHashedEmailRateLimitKey(normalizeLoginEmail(" Admin@Example.com "));
            const second = getHashedEmailRateLimitKey(normalizeLoginEmail("admin@example.com"));
            assert.equal(first, second);
        });

        it("does not place raw public tokens in keys", () => {
            const token = "abcdefghijklmnopqrstuvwxyz123456";
            const identity = getPublicTokenIdentityFromRawToken(token);
            assert.doesNotMatch(identity, new RegExp(token));
        });
    });

    describe("enforcement", () => {
        it("throws RateLimitError when limits are exceeded", async () => {
            const identifiers = ["admin:another", "website:site-4"];
            for (let index = 0; index < 3; index += 1) {
                await requireRateLimit({ policyId: "audit-start", identifiers });
            }
            await assert.rejects(
                () => requireRateLimit({ policyId: "audit-start", identifiers }),
                RateLimitError,
            );
        });
    });
});
