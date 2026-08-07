import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

describe("crawl browser evaluate", () => {
    it("loads the Playwright browser extraction script from the project root", async () => {
        await import("@/src/services/crawl-browser-evaluate");

        const sourcePath = join(process.cwd(), "src/services/crawl-browser-extract.js");
        const source = readFileSync(sourcePath, "utf8");
        assert.match(source, /function extractPageDataInBrowser/);
        assert.match(source, /function discoverLinksInBrowser/);
    });
});
