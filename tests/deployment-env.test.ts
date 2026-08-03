import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetAppEnvCacheForTests } from "@/src/config/app-env";
import { resetRateLimitEnvCacheForTests } from "@/src/config/env";
import {
    assertProductionApplicationUrl,
    buildApplicationPath,
    isLocalhostUrl,
} from "@/src/lib/application-url";
import { resolveRequestId } from "@/src/lib/request-id";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
    resetRateLimitEnvCacheForTests();
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
    resetRateLimitEnvCacheForTests();
});

describe("application URL helper", () => {
    it("builds canonical paths from APP_URL", () => {
        process.env.APP_URL = "https://audit.example.com/";
        assert.equal(buildApplicationPath("/report/token"), "https://audit.example.com/report/token");
    });

    it("detects localhost URLs", () => {
        assert.equal(isLocalhostUrl("http://localhost:3000"), true);
        assert.equal(isLocalhostUrl("https://audit.example.com"), false);
    });

    it("rejects localhost production URLs", () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            APP_URL: "http://localhost:3000",
        });
        assert.throws(
            () => assertProductionApplicationUrl(),
            /Production APP_URL cannot use localhost/,
        );
    });
});

describe("request IDs", () => {
    it("accepts valid request IDs and rejects invalid values", () => {
        const headers = new Headers({ "x-request-id": "req_abc12345_test" });
        assert.equal(resolveRequestId(headers), "req_abc12345_test");

        const generated = resolveRequestId(new Headers());
        assert.match(generated, /^req_/);
    });
});

describe("deployment environment validation", () => {
    it("allows development configuration without production secrets", async () => {
        Object.assign(process.env, {
            NODE_ENV: "development",
            DEPLOYMENT_ENV: "development",
        });
        const { getAppEnv } = await import("@/src/config/app-env");
        const env = getAppEnv();
        assert.equal(env.deploymentEnvironment, "development");
    });

    it("requires MongoDB and provider secrets in production", async () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "production",
            APP_URL: "https://audit.example.com",
            NEXT_PUBLIC_SITE_URL: "https://audit.example.com",
            MONGODB_URI: "mongodb+srv://user:pass@cluster.mongodb.net",
            MONGODB_DB_NAME: "niceguy_audit_production",
            AUTH_SECRET: "production-auth-secret",
            PDF_RENDER_SECRET: "pdf-secret",
            CLOUDINARY_CLOUD_NAME: "cloud",
            CLOUDINARY_API_KEY: "key",
            CLOUDINARY_API_SECRET: "secret",
            GOOGLE_PAGESPEED_API_KEY: "pagespeed-key",
            AI_API_KEY: "ai-key",
        });

        const { getAppEnv } = await import("@/src/config/app-env");
        const env = getAppEnv();
        assert.equal(env.deploymentEnvironment, "production");
    });

    it("fails production validation when MongoDB URI is missing", async () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "production",
            APP_URL: "https://audit.example.com",
            AUTH_SECRET: "production-auth-secret",
        });
        delete process.env.MONGODB_URI;
        delete process.env.MONGODB_DB_NAME;

        const { getAppEnv } = await import("@/src/config/app-env");
        assert.throws(() => getAppEnv(), /MONGODB_URI/);
    });

    it("requires preview-safe MongoDB configuration", async () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "preview",
            MONGODB_URI: "mongodb+srv://user:pass@cluster.mongodb.net",
            MONGODB_DB_NAME: "niceguy_audit_production",
            AUTH_SECRET: "preview-auth-secret",
        });

        const { getAppEnv } = await import("@/src/config/app-env");
        assert.throws(() => getAppEnv(), /Preview deployments must not use production MongoDB/);
    });

    it("enables crawl and screenshots in preview while keeping paid providers opt-in", async () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "preview",
            MONGODB_URI: "mongodb+srv://user:pass@cluster.mongodb.net",
            MONGODB_DB_NAME: "niceguy_audit_preview",
            AUTH_SECRET: "preview-auth-secret",
        });

        const { getAppEnv, getAuditOperationFlags } = await import("@/src/config/app-env");
        getAppEnv();
        const flags = getAuditOperationFlags();
        assert.equal(flags.crawlEnabled, true);
        assert.equal(flags.screenshotEnabled, true);
        assert.equal(flags.cloudinaryUploadsEnabled, true);
        assert.equal(flags.pageSpeedEnabled, false);
        assert.equal(flags.aiGenerationEnabled, false);
        assert.equal(flags.syncExecution, true);
    });
});
