import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isValidEmail, isValidHttpUrl } from "@/lib/websiteAudit/validation";
import { assertFileExists } from "./helpers";

describe("Phase 1 — Project foundation", () => {
    describe("public form validation (UI-only, no backend)", () => {
        it("accepts valid http and https URLs", () => {
            assert.equal(isValidHttpUrl("https://example.com"), true);
            assert.equal(isValidHttpUrl("http://example.com/path"), true);
        });

        it("rejects invalid URLs", () => {
            assert.equal(isValidHttpUrl(""), false);
            assert.equal(isValidHttpUrl("not-a-url"), false);
            assert.equal(isValidHttpUrl("ftp://example.com"), false);
            assert.equal(isValidHttpUrl("javascript:alert(1)"), false);
        });

        it("validates optional email format", () => {
            assert.equal(isValidEmail("name@business.com"), true);
            assert.equal(isValidEmail("invalid"), false);
            assert.equal(isValidEmail("@missing.com"), false);
        });
    });

    describe("required routes and layouts exist", () => {
        it("includes public landing page", () => {
            assertFileExists("app/(main)/work/website-audit/page.tsx");
            assertFileExists("components/websiteAudit/WebsiteAuditLandingPage.tsx");
            assertFileExists("components/websiteAudit/WebsiteAuditForm.tsx");
        });

        it("includes administrator dashboard shell", () => {
            assertFileExists("app/dashboard/layout.tsx");
            assertFileExists("app/dashboard/page.tsx");
            assertFileExists("app/dashboard/websites/page.tsx");
            assertFileExists("app/dashboard/websites/new/page.tsx");
            assertFileExists("app/dashboard/websites/[id]/page.tsx");
        });
    });
});
