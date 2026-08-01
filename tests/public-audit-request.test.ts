import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { publicAuditRequestSchema } from "@/src/lib/website-validation";

describe("public audit request", () => {
    it("requires a valid website URL and business email", () => {
        const parsed = publicAuditRequestSchema.safeParse({
            websiteUrl: "https://example.com",
            businessEmail: "owner@example.com",
        });

        assert.equal(parsed.success, true);
        if (parsed.success) {
            assert.equal(parsed.data.businessEmail, "owner@example.com");
        }
    });

    it("rejects missing business email", () => {
        const parsed = publicAuditRequestSchema.safeParse({
            websiteUrl: "https://example.com",
            businessEmail: "",
        });

        assert.equal(parsed.success, false);
    });

    it("rejects invalid website URLs", () => {
        const parsed = publicAuditRequestSchema.safeParse({
            websiteUrl: "not-a-url",
            businessEmail: "owner@example.com",
        });

        assert.equal(parsed.success, false);
    });
});
