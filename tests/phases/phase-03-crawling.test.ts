import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    classifyPageType,
    isBlockedCrawlPath,
    normalizeCrawlUrl,
    selectPagesToCrawl,
} from "@/src/lib/crawl-utils";
import {
    isPrivateOrReservedIp,
    parseHttpUrl,
    PublicUrlValidationError,
    toSafePublicErrorMessage,
} from "@/src/lib/validate-public-url";

describe("Phase 3 — Playwright crawling", () => {
    describe("URL parsing and SSRF guards", () => {
        it("parses http and https URLs", () => {
            const parsed = parseHttpUrl("example.com");
            assert.equal(parsed.protocol, "https:");
            assert.equal(parsed.hostname, "example.com");
        });

        it("rejects empty URLs", () => {
            assert.throws(() => parseHttpUrl(""), PublicUrlValidationError);
        });

        it("rejects credentials in URLs", () => {
            assert.throws(
                () => parseHttpUrl("https://user:pass@example.com"),
                PublicUrlValidationError,
            );
        });

        it("rejects blocked protocols", () => {
            assert.throws(() => parseHttpUrl("file:///etc/passwd"), PublicUrlValidationError);
            assert.throws(() => parseHttpUrl("javascript:alert(1)"), PublicUrlValidationError);
        });

        it("detects private IPv4 ranges", () => {
            assert.equal(isPrivateOrReservedIp("127.0.0.1"), true);
            assert.equal(isPrivateOrReservedIp("10.0.0.5"), true);
            assert.equal(isPrivateOrReservedIp("192.168.1.10"), true);
            assert.equal(isPrivateOrReservedIp("8.8.8.8"), false);
        });

        it("sanitizes unknown errors in public messages", () => {
            assert.equal(
                toSafePublicErrorMessage(new PublicUrlValidationError("Blocked.")),
                "Blocked.",
            );
            assert.equal(toSafePublicErrorMessage(new Error("secret")), "This website URL is not allowed.");
        });
    });

    describe("crawl utilities", () => {
        it("classifies common page types from paths", () => {
            assert.equal(classifyPageType({ url: "https://example.com/" }), "home");
            assert.equal(
                classifyPageType({ url: "https://example.com/contact" }),
                "contact",
            );
            assert.equal(
                classifyPageType({ url: "https://example.com/about-us" }),
                "about",
            );
        });

        it("blocks admin and login paths", () => {
            assert.equal(isBlockedCrawlPath("/wp-admin"), true);
            assert.equal(isBlockedCrawlPath("/login"), true);
            assert.equal(isBlockedCrawlPath("/contact"), false);
        });

        it("normalizes same-origin URLs and strips fragments", () => {
            const normalized = normalizeCrawlUrl(
                new URL("https://www.example.com/about#team"),
                "example.com",
            );
            assert.equal(normalized, "https://www.example.com/about");
        });

        it("rejects cross-origin URLs", () => {
            const normalized = normalizeCrawlUrl(
                new URL("https://another-business.com/page"),
                "example.com",
            );
            assert.equal(normalized, null);
        });

        it("prioritizes about, contact, and services in page selection", () => {
            const homepage = "https://example.com/";
            const selected = selectPagesToCrawl({
                homepageUrl: homepage,
                discoveredLinks: [
                    { url: "https://example.com/blog/post-1" },
                    { url: "https://example.com/contact" },
                    { url: "https://example.com/about" },
                    { url: "https://example.com/services" },
                ],
                maxPages: 4,
            });
            assert.equal(selected[0], homepage);
            assert.ok(selected.includes("https://example.com/about"));
            assert.ok(selected.includes("https://example.com/contact"));
        });
    });
});
