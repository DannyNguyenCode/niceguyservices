import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetAppEnvCacheForTests } from "@/src/config/app-env";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    resetAppEnvCacheForTests();
});

describe("audit sync execution defaults", () => {
    it("runs crawls synchronously on preview by default", async () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "preview",
            MONGODB_URI: "mongodb+srv://user:pass@cluster.mongodb.net",
            MONGODB_DB_NAME: "niceguy_audit_preview",
            AUTH_SECRET: "preview-auth-secret",
        });

        const { getAuditOperationFlags } = await import("@/src/config/app-env");
        assert.equal(getAuditOperationFlags().syncExecution, true);
    });

    it("keeps production audits queued unless AUDIT_SYNC_EXECUTION is set", async () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "production",
            APP_URL: "https://audit.example.com",
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

        const { getAuditOperationFlags } = await import("@/src/config/app-env");
        assert.equal(getAuditOperationFlags().syncExecution, false);
    });

    it("allows production sync execution via AUDIT_SYNC_EXECUTION", async () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "production",
            APP_URL: "https://audit.example.com",
            MONGODB_URI: "mongodb+srv://user:pass@cluster.mongodb.net",
            MONGODB_DB_NAME: "niceguy_audit_production",
            AUTH_SECRET: "production-auth-secret",
            PDF_RENDER_SECRET: "pdf-secret",
            CLOUDINARY_CLOUD_NAME: "cloud",
            CLOUDINARY_API_KEY: "key",
            CLOUDINARY_API_SECRET: "secret",
            GOOGLE_PAGESPEED_API_KEY: "pagespeed-key",
            AI_API_KEY: "ai-key",
            AUDIT_SYNC_EXECUTION: "true",
        });

        const { getAuditOperationFlags } = await import("@/src/config/app-env");
        assert.equal(getAuditOperationFlags().syncExecution, true);
    });
});
