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
import { assertFileExists } from "./helpers";

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

describe("Phase 18 — Production deployment", () => {
    describe("application URL helpers", () => {
        it("builds canonical paths from APP_URL", () => {
            delete process.env.AUTH_URL;
            delete process.env.VERCEL_URL;
            delete process.env.VERCEL_ENV;
            delete process.env.APP_PUBLIC_URL;
            delete process.env.NEXT_PUBLIC_SITE_URL;
            process.env.APP_URL = "https://audit.example.com/";
            assert.equal(
                buildApplicationPath("/report/token"),
                "https://audit.example.com/report/token",
            );
        });

        it("prefers the public site URL over localhost AUTH_URL", () => {
            delete process.env.VERCEL_URL;
            delete process.env.VERCEL_ENV;
            delete process.env.APP_PUBLIC_URL;
            delete process.env.APP_URL;
            process.env.AUTH_URL = "http://localhost:3000";
            process.env.NEXT_PUBLIC_SITE_URL = "https://niceguyweb.design";
            assert.equal(
                buildApplicationPath("/api/public/pdf-download/token"),
                "https://niceguyweb.design/api/public/pdf-download/token",
            );
        });

        it("detects localhost URLs", () => {
            assert.equal(isLocalhostUrl("http://localhost:3000"), true);
            assert.equal(isLocalhostUrl("https://audit.example.com"), false);
        });

        it("rejects localhost production URLs", () => {
            delete process.env.VERCEL_URL;
            delete process.env.VERCEL_ENV;
            delete process.env.AUTH_URL;
            delete process.env.NEXT_PUBLIC_SITE_URL;
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
        it("accepts valid request IDs and generates new ones when missing", () => {
            const headers = new Headers({ "x-request-id": "req_abc12345_test" });
            assert.equal(resolveRequestId(headers), "req_abc12345_test");
            assert.match(resolveRequestId(new Headers()), /^req_/);
        });
    });

    describe("deployment tooling", () => {
        it("includes health endpoint and deploy check script", () => {
            assertFileExists("app/api/health/route.ts");
            assertFileExists("scripts/deploy-check.ts");
            assertFileExists("scripts/production-smoke-test.ts");
        });
    });

    describe("environment validation", () => {
        it("allows development configuration without production secrets", async () => {
            Object.assign(process.env, {
                NODE_ENV: "development",
                DEPLOYMENT_ENV: "development",
            });
            const { getAppEnv } = await import("@/src/config/app-env");
            const env = getAppEnv();
            assert.equal(env.deploymentEnvironment, "development");
        });
    });
});
