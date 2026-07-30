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
        });

        const { getAppEnv } = await import("@/src/config/app-env");
        assert.throws(() => getAppEnv(), /MONGODB_URI/);
    });
});
