import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetAppEnvCacheForTests } from "@/src/config/app-env";
import { resetRateLimitEnvCacheForTests } from "@/src/config/env";
import { resetRateLimitState } from "@/src/services/rate-limit/reset-rate-limit-state";
import { POST as loginPost } from "@/app/api/auth/login/route";

const ORIGINAL_ENV = { ...process.env };

function configureAuthEnv(): void {
    Object.assign(process.env, {
        NODE_ENV: "test",
        DEPLOYMENT_ENV: "test",
        AUTH_SECRET: "integration-test-auth-secret",
        MONGODB_URI: "mongodb://127.0.0.1:1/test?serverSelectionTimeoutMS=500&connectTimeoutMS=500",
        RATE_LIMIT_PROVIDER: "memory",
        RATE_LIMIT_BYPASS_MODE: "disabled",
        RATE_LIMIT_HASH_SECRET: "integration-test-hash-secret",
        RATE_LIMIT_TRUST_PROXY_HEADERS: "true",
    });
    resetAppEnvCacheForTests();
    resetRateLimitEnvCacheForTests();
    resetRateLimitState();
}

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    configureAuthEnv();
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
    resetRateLimitEnvCacheForTests();
    resetRateLimitState();
});

describe("login route integration", () => {
    it("returns 503 when authentication is not configured in preview", async () => {
        process.env.DEPLOYMENT_ENV = "preview";
        delete process.env.AUTH_SECRET;
        resetAppEnvCacheForTests();

        const response = await loginPost(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email: "admin@example.com", password: "password" }),
            }),
        );
        assert.equal(response.status, 503);
    });

    it("returns the same response for unknown accounts and invalid passwords", async () => {
        const unknown = await loginPost(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    email: "missing@example.com",
                    password: "wrong-password-1",
                }),
            }),
        );
        const invalid = await loginPost(
            new Request("http://localhost/api/auth/login", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "x-forwarded-for": "203.0.113.44",
                },
                body: JSON.stringify({
                    email: "admin@example.com",
                    password: "wrong-password-1",
                }),
            }),
        );

        assert.equal(unknown.status, 401);
        assert.equal(invalid.status, 401);
        const unknownBody = (await unknown.json()) as { error?: string };
        const invalidBody = (await invalid.json()) as { error?: string };
        assert.equal(unknownBody.error, invalidBody.error);
    });

    it("returns 429 with Retry-After when the IP login limit is exceeded", async () => {
        const requestInit = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-forwarded-for": "203.0.113.99",
            },
            body: JSON.stringify({
                email: "someone@example.com",
                password: "wrong-password-1",
            }),
        } as const;

        let lastStatus = 0;
        for (let attempt = 0; attempt < 12; attempt += 1) {
            const response = await loginPost(
                new Request("http://localhost/api/auth/login", requestInit),
            );
            lastStatus = response.status;
            if (response.status === 429) {
                assert.ok(response.headers.get("retry-after"));
                break;
            }
        }
        assert.equal(lastStatus, 429);
    });
});
