import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetAppEnvCacheForTests } from "@/src/config/app-env";
import { createAdministratorSessionToken } from "@/src/lib/auth/session-token";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
});

describe("session revocation", () => {
    it("rejects tokens without a session version in protected environments", async () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "production",
            AUTH_SECRET: "production-test-secret",
        });
        resetAppEnvCacheForTests();

        const { verifyAdministratorSession } = await import(
            "@/src/services/auth/administrator-session"
        );

        const token = await createAdministratorSessionToken(
            {
                sub: "507f1f77bcf86cd799439011",
                email: "admin@example.com",
                name: "Admin",
                role: "owner",
                maxAgeSeconds: 3600,
            },
            process.env.AUTH_SECRET!,
        );

        const session = await verifyAdministratorSession(token);
        assert.equal(session, null);
    });
});
