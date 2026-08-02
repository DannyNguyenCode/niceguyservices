import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
    getPlaywrightLaunchOptions,
    resolveChromiumRuntime,
} from "@/src/lib/playwright-config";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

describe("playwright chromium configuration", () => {
    it("uses Sparticuz when PLAYWRIGHT_USE_SPARTICUZ=1", () => {
        process.env.PLAYWRIGHT_USE_SPARTICUZ = "1";

        assert.equal(resolveChromiumRuntime(), "sparticuz");
    });

    it("uses local Chromium when PLAYWRIGHT_USE_SPARTICUZ=0", () => {
        process.env.PLAYWRIGHT_USE_SPARTICUZ = "0";

        assert.equal(resolveChromiumRuntime(), "local");
    });

    it("prefers a custom executable path over Sparticuz", () => {
        process.env.PLAYWRIGHT_USE_SPARTICUZ = "1";
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = "/custom/chromium";

        assert.equal(resolveChromiumRuntime(), "local");
    });

    it("returns a custom executable path when configured", async () => {
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = "/custom/chromium";

        const options = await getPlaywrightLaunchOptions();

        assert.equal(options.executablePath, "/custom/chromium");
        assert.deepEqual(options.args, []);
    });
});
