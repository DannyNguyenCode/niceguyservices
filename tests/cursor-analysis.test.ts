import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
    resetCursorAnalysisConfigForTests,
    getCursorAnalysisConfig,
} from "@/src/services/cursor-analysis/config";
import {
    buildAuditPackageToken,
    verifyAuditPackageToken,
} from "@/src/services/cursor-analysis/package-token";
import { calculateCursorAnalysisReadiness } from "@/src/services/cursor-analysis/readiness";
import {
    cursorAuditPackageSchema,
    cursorAuditResultSchema,
    validateCursorAuditPackage,
    validateCursorAuditResult,
} from "@/src/services/cursor-analysis/schemas";

describe("cursor analysis schemas", () => {
    it("accepts the example package fixture", () => {
        const example = JSON.parse(
            readFileSync("audit-agent/examples/example-package.json", "utf8"),
        );
        assert.doesNotThrow(() => validateCursorAuditPackage(example));
    });

    it("accepts the example result fixture", () => {
        const example = JSON.parse(
            readFileSync("audit-agent/examples/example-result.json", "utf8"),
        );
        assert.doesNotThrow(() => validateCursorAuditResult(example));
    });

    it("rejects invalid overall scores", () => {
        const example = JSON.parse(
            readFileSync("audit-agent/examples/example-result.json", "utf8"),
        );
        example.overallScore = 120;
        assert.equal(cursorAuditResultSchema.safeParse(example).success, false);
    });

    it("rejects unknown evidence sources", () => {
        const example = JSON.parse(
            readFileSync("audit-agent/examples/example-result.json", "utf8"),
        );
        example.issues[0].sources = ["made-up-source"];
        assert.equal(cursorAuditResultSchema.safeParse(example).success, false);
    });

    it("rejects missing required package fields", () => {
        const parsed = cursorAuditPackageSchema.safeParse({
            schemaVersion: "1.0",
            auditId: "audit_1",
        });
        assert.equal(parsed.success, false);
    });
});

describe("cursor analysis package token", () => {
    it("round-trips a valid token", () => {
        process.env.AUDIT_PACKAGE_SIGNING_SECRET = "test-package-secret";
        resetCursorAnalysisConfigForTests();

        const token = buildAuditPackageToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });

        const payload = verifyAuditPackageToken(token, "audit_123");
        assert.equal(payload.analysisRequestId, "req_456");
    });

    it("rejects tampered tokens", () => {
        process.env.AUDIT_PACKAGE_SIGNING_SECRET = "test-package-secret";
        resetCursorAnalysisConfigForTests();

        const token = buildAuditPackageToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });

        const tampered = `${token}x`;
        assert.throws(() => verifyAuditPackageToken(tampered, "audit_123"));
    });

    it("rejects expired tokens", () => {
        process.env.AUDIT_PACKAGE_SIGNING_SECRET = "test-package-secret";
        resetCursorAnalysisConfigForTests();

        const token = buildAuditPackageToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: -1_000,
        });

        assert.throws(() => verifyAuditPackageToken(token, "audit_123"));
    });

    it("rejects audit ID mismatches", () => {
        process.env.AUDIT_PACKAGE_SIGNING_SECRET = "test-package-secret";
        resetCursorAnalysisConfigForTests();

        const token = buildAuditPackageToken({
            auditId: "audit_123",
            analysisRequestId: "req_456",
            ttlMs: 60_000,
        });

        assert.throws(() => verifyAuditPackageToken(token, "audit_other"));
    });
});

describe("cursor analysis readiness", () => {
    it("reports missing inputs for incomplete audits", () => {
        const readiness = calculateCursorAnalysisReadiness({
            auditId: "audit_1",
            website: {
                id: "website_1",
                businessName: "Example",
                industry: "",
            } as never,
            crawl: null,
            screenshots: [],
            pageSpeed: { mobile: null, desktop: null },
            niceGuy: null,
        });

        assert.equal(readiness.ready, false);
        assert.ok(readiness.missing.includes("crawl"));
        assert.ok(readiness.missing.includes("screenshots.desktop"));
    });
});

describe("cursor analysis config", () => {
    it("defaults provider to openai when unset", () => {
        delete process.env.AI_ANALYSIS_PROVIDER;
        delete process.env.AI_PROVIDER;
        resetCursorAnalysisConfigForTests();
        assert.equal(getCursorAnalysisConfig().provider, "openai");
    });
});
