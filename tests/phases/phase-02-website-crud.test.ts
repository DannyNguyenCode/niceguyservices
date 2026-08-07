import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { NormalizeDomainError } from "@/src/lib/errors/audit-platform-error";
import { normalizeWebsiteUrl, tryNormalizeWebsiteUrl } from "@/src/lib/normalize-domain";
import { createWebsiteSchema, formatZodErrors } from "@/src/lib/website-validation";

describe("Phase 2 — MongoDB and website CRUD", () => {
    describe("URL normalization", () => {
        it("normalizes common business URL formats", () => {
            const result = normalizeWebsiteUrl("https://www.example.com/contact");
            assert.equal(result.normalizedDomain, "example.com");
            assert.equal(result.normalizedUrl, "https://example.com");
        });

        it("adds https when protocol is missing", () => {
            const result = normalizeWebsiteUrl("example.com");
            assert.equal(result.normalizedUrl, "https://example.com");
        });

        it("throws NormalizeDomainError for empty input", () => {
            assert.throws(() => normalizeWebsiteUrl(""), NormalizeDomainError);
        });

        it("throws for invalid protocols", () => {
            assert.throws(
                () => normalizeWebsiteUrl("ftp://example.com"),
                (error: unknown) =>
                    error instanceof NormalizeDomainError &&
                    error.message.includes("http or https"),
            );
        });

        it("throws for hostnames without a dot", () => {
            assert.throws(() => normalizeWebsiteUrl("https://localhost"), NormalizeDomainError);
        });

        it("returns null from tryNormalizeWebsiteUrl on failure", () => {
            assert.equal(tryNormalizeWebsiteUrl("not-valid"), null);
        });
    });

    describe("create website schema", () => {
        it("accepts a valid website payload", () => {
            const parsed = createWebsiteSchema.safeParse({
                businessName: "Acme Plumbing",
                websiteUrl: "https://acmeplumbing.example",
                businessEmail: "owner@acme.example",
                source: "manual-prospect-research",
            });
            assert.equal(parsed.success, true);
        });

        it("rejects missing website URL", () => {
            const parsed = createWebsiteSchema.safeParse({
                websiteUrl: "",
                source: "manual-prospect-research",
            });
            assert.equal(parsed.success, false);
            if (!parsed.success) {
                const errors = formatZodErrors(parsed.error);
                assert.ok(errors.websiteUrl);
            }
        });

        it("rejects invalid email", () => {
            const parsed = createWebsiteSchema.safeParse({
                websiteUrl: "https://example.com",
                businessEmail: "not-an-email",
                source: "manual-prospect-research",
            });
            assert.equal(parsed.success, false);
        });

        it("rejects invalid source enum", () => {
            const parsed = createWebsiteSchema.safeParse({
                websiteUrl: "https://example.com",
                source: "invalid-source",
            });
            assert.equal(parsed.success, false);
        });
    });
});
