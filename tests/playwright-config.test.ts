import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
    ensureBundledPlaywrightBrowsersPath,
    getPlaywrightLaunchOptions,
} from "@/src/lib/playwright-config";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

describe("playwright serverless configuration", () => {
    it("defaults bundled browser path on Vercel when unset", () => {
        delete process.env.PLAYWRIGHT_BROWSERS_PATH;
        process.env.VERCEL = "1";

        ensureBundledPlaywrightBrowsersPath();

        assert.equal(process.env.PLAYWRIGHT_BROWSERS_PATH, "0");
    });

    it("adds serverless chromium flags on Vercel", () => {
        process.env.VERCEL = "1";
        process.env.PLAYWRIGHT_BROWSERS_PATH = "0";

        const options = getPlaywrightLaunchOptions();

        assert.equal(options.headless, true);
        assert.ok(options.args?.includes("--no-sandbox"));
        assert.ok(options.args?.includes("--disable-dev-shm-usage"));
    });

    it("does not add serverless chromium flags during local development", () => {
        delete process.env.VERCEL;
        delete process.env.AWS_LAMBDA_FUNCTION_NAME;
        delete process.env.AWS_EXECUTION_ENV;

        const options = getPlaywrightLaunchOptions();

        assert.equal(options.args, undefined);
    });
});
