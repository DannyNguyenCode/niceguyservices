import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
    AuthValidationError,
    InvalidObjectIdError,
    toSafeErrorMessage,
} from "@/src/lib/errors/audit-platform-error";
import { assertObjectId, isValidObjectId } from "@/src/lib/assert-object-id";
import {
    assertPasswordUsable,
    hashPassword,
    verifyPassword,
} from "@/src/lib/auth/password";
import {
    createAdministratorSessionToken,
    verifyAdministratorSessionToken,
} from "@/src/lib/auth/session-token";
import { isAuthSecretConfigured } from "@/src/lib/auth/middleware-auth";
import { VALID_OBJECT_ID } from "./helpers";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

describe("Phase 16 — Authentication", () => {
    describe("password validation", () => {
        it("rejects passwords shorter than 8 characters", () => {
            assert.throws(() => assertPasswordUsable("short"), AuthValidationError);
        });

        it("hashes and verifies valid passwords", () => {
            const hash = hashPassword("secure-password");
            assert.equal(verifyPassword("secure-password", hash), true);
            assert.equal(verifyPassword("wrong-password", hash), false);
        });
    });

    describe("session tokens", () => {
        it("creates and verifies administrator session tokens", async () => {
            const token = await createAdministratorSessionToken(
                {
                    sub: VALID_OBJECT_ID,
                    email: "admin@example.com",
                    name: "Admin User",
                    role: "owner",
                    maxAgeSeconds: 3600,
                },
                "test-secret-value",
            );
            const payload = await verifyAdministratorSessionToken(token, "test-secret-value");
            assert.equal(payload?.sub, VALID_OBJECT_ID);
            assert.equal(payload?.email, "admin@example.com");
        });

        it("rejects tokens signed with the wrong secret", async () => {
            const token = await createAdministratorSessionToken(
                {
                    sub: VALID_OBJECT_ID,
                    email: "admin@example.com",
                    name: "Admin User",
                    role: "owner",
                    maxAgeSeconds: 3600,
                },
                "test-secret-value",
            );
            const payload = await verifyAdministratorSessionToken(token, "other-secret");
            assert.equal(payload, null);
        });
    });

    describe("object ID validation", () => {
        it("accepts valid MongoDB object IDs", () => {
            assert.equal(isValidObjectId(VALID_OBJECT_ID), true);
            assert.doesNotThrow(() => assertObjectId(VALID_OBJECT_ID, "website ID"));
        });

        it("throws InvalidObjectIdError for malformed IDs", () => {
            assert.throws(() => assertObjectId("not-valid", "website ID"), InvalidObjectIdError);
        });
    });

    describe("auth configuration", () => {
        it("reports whether AUTH_SECRET is configured without exposing it", () => {
            delete process.env.AUTH_SECRET;
            assert.equal(isAuthSecretConfigured(), false);
            process.env.AUTH_SECRET = "local-development-secret";
            assert.equal(isAuthSecretConfigured(), true);
        });
    });

    describe("safe error messages", () => {
        it("returns platform error messages directly", () => {
            assert.equal(
                toSafeErrorMessage(new AuthValidationError("Invalid credentials.")),
                "Invalid credentials.",
            );
        });

        it("falls back for unknown errors", () => {
            assert.equal(toSafeErrorMessage("boom"), "Something went wrong.");
        });
    });
});
