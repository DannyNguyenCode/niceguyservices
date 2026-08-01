import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
    isAuthenticationConfigured,
    isProtectedDeploymentEnvironment,
    resolveAuthSecretForRuntime,
} from "@/src/lib/auth/auth-requirements";
import { requireAdministratorApiAccess } from "@/src/lib/auth/api-auth";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

describe("authentication fail-closed", () => {
    it("treats preview and production as protected deployments", () => {
        process.env.DEPLOYMENT_ENV = "preview";
        assert.equal(isProtectedDeploymentEnvironment(), true);
        process.env.DEPLOYMENT_ENV = "production";
        assert.equal(isProtectedDeploymentEnvironment(), true);
        process.env.DEPLOYMENT_ENV = "development";
        assert.equal(isProtectedDeploymentEnvironment(), false);
    });

    it("does not configure auth in preview without AUTH_SECRET", () => {
        process.env.DEPLOYMENT_ENV = "preview";
        delete process.env.AUTH_SECRET;
        assert.equal(isAuthenticationConfigured(), false);
    });

    it("returns 503 for protected admin API access without auth configuration", async () => {
        process.env.DEPLOYMENT_ENV = "preview";
        delete process.env.AUTH_SECRET;
        const response = await requireAdministratorApiAccess(
            new Request("https://audit.example.com/api/admin/websites"),
        );
        assert.ok(response instanceof Response);
        assert.equal(response.status, 503);
        const body = (await response.json()) as {
            error?: { code?: string };
        };
        assert.equal(body.error?.code, "AUTH_CONFIGURATION_UNAVAILABLE");
    });

    it("allows development fallback secret only in development", () => {
        Object.assign(process.env, {
            NODE_ENV: "development",
            DEPLOYMENT_ENV: "development",
            AUTH_SECRET: "local-development-auth-secret-only",
        });
        assert.equal(resolveAuthSecretForRuntime(), "local-development-auth-secret-only");

        process.env.DEPLOYMENT_ENV = "preview";
        process.env.AUTH_SECRET = "local-development-auth-secret-only";
        assert.equal(resolveAuthSecretForRuntime(), undefined);
    });
});
