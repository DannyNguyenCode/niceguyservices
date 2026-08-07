import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { assertFileExists } from "./helpers";

describe("Phase 5 — Crawl and screenshot integration", () => {
    it("documents development-friendly crawl defaults in config source", () => {
        const source = readFileSync("src/lib/crawl-config.ts", "utf8");
        assert.match(source, /CRAWL_MAX_PAGES.*20/);
        assert.match(source, /CRAWL_MAX_DEPTH.*3/);
        assert.match(source, /width: 1440/);
        assert.match(source, /height: 1000/);
        assert.match(source, /width: 390/);
        assert.match(source, /height: 844/);
    });

    it("includes crawl orchestration entry points", () => {
        assertFileExists("src/services/run-website-crawl.ts");
        assertFileExists("src/services/website-crawler.ts");
        assertFileExists("src/services/screenshot-capture.ts");
        assertFileExists("app/api/admin/websites/[id]/crawl/route.ts");
    });

    it("documents playwright verification commands", () => {
        assertFileExists("playwright.config.ts");
        assertFileExists("scripts/check-playwright.ts");
        assertFileExists("scripts/install-playwright.mjs");
        assertFileExists("tests/playwright/setup.spec.ts");
    });
});
