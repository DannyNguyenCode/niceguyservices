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

describe("forceAsync + syncExecution cannot strand queued jobs", () => {
    it("does not schedule under syncExecution unless force is set", async () => {
        Object.assign(process.env, {
            NODE_ENV: "development",
            AUDIT_SYNC_EXECUTION: "true",
        });
        resetAppEnvCacheForTests();

        const { getAuditOperationFlags } = await import("@/src/config/app-env");
        const { shouldScheduleAuditWorkerKick } = await import(
            "@/src/services/audit-pipeline/schedule-audit-worker"
        );

        assert.equal(getAuditOperationFlags().syncExecution, true);
        assert.equal(shouldScheduleAuditWorkerKick(), false);
        assert.equal(shouldScheduleAuditWorkerKick({ force: false }), false);
        assert.equal(shouldScheduleAuditWorkerKick({ force: true }), true);
    });

    it("schedules by default when syncExecution is false", async () => {
        Object.assign(process.env, {
            NODE_ENV: "production",
            DEPLOYMENT_ENV: "production",
            APP_URL: "https://audit.example.com",
            APP_PUBLIC_URL: "https://audit.example.com",
            MONGODB_URI: "mongodb+srv://user:pass@cluster.mongodb.net",
            MONGODB_DB_NAME: "niceguy_audit_production",
            AUTH_SECRET: "production-auth-secret",
            PDF_RENDER_SECRET: "pdf-secret",
            CLOUDINARY_CLOUD_NAME: "cloud",
            CLOUDINARY_API_KEY: "key",
            CLOUDINARY_API_SECRET: "secret",
            GOOGLE_PAGESPEED_API_KEY: "pagespeed-key",
            INTERNAL_WORKER_SECRET: "internal-worker-secret",
            CURSOR_AUTOMATION_WEBHOOK_URL: "https://cursor.example.com/webhook",
            CURSOR_AUTOMATION_AUTH_TOKEN: "cursor-webhook-token",
            CURSOR_ANALYSIS_CALLBACK_SECRET: "callback-secret",
            AUDIT_PACKAGE_SIGNING_SECRET: "package-signing-secret",
        });
        delete process.env.AUDIT_SYNC_EXECUTION;
        resetAppEnvCacheForTests();

        const { getAuditOperationFlags } = await import("@/src/config/app-env");
        const { shouldScheduleAuditWorkerKick } = await import(
            "@/src/services/audit-pipeline/schedule-audit-worker"
        );

        assert.equal(getAuditOperationFlags().syncExecution, false);
        assert.equal(shouldScheduleAuditWorkerKick(), true);
        assert.equal(shouldScheduleAuditWorkerKick({ force: true }), true);
    });
});
