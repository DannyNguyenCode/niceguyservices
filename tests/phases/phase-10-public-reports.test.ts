import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    generateReportToken,
    hashReportToken,
    isValidReportTokenFormat,
} from "@/src/services/public-reports/hash-report-token";
import {
    isScreenshotPathAllowed,
    sanitizeReportText,
} from "@/src/services/public-reports/screenshot-selection";
import {
    isPublicReportAccessible,
    isReportExpired,
    PublicReportValidationError,
} from "@/src/services/public-reports/validate-public-report-sources";
import { MIN_REPORT_TOKEN_LENGTH } from "@/src/lib/public-report-config";

describe("Phase 10 — Public audit report", () => {
    describe("report tokens", () => {
        it("generates secure tokens and stores only hashes", () => {
            const first = generateReportToken();
            const second = generateReportToken();
            assert.notEqual(first.rawToken, second.rawToken);
            assert.equal(first.tokenHash, hashReportToken(first.rawToken));
            assert.ok(first.rawToken.length >= MIN_REPORT_TOKEN_LENGTH);
            assert.equal(isValidReportTokenFormat(first.rawToken), true);
        });

        it("rejects short or malformed tokens", () => {
            assert.equal(isValidReportTokenFormat("short"), false);
            assert.equal(isValidReportTokenFormat(""), false);
        });
    });

    describe("screenshot and text safety", () => {
        it("blocks private route screenshots", () => {
            assert.equal(isScreenshotPathAllowed("https://example.com/login"), false);
            assert.equal(isScreenshotPathAllowed("https://example.com/services"), true);
        });

        it("sanitizes report text", () => {
            const sanitized = sanitizeReportText("<script>alert(1)</script> Hello");
            assert.equal(sanitized.includes("<script>"), false);
            assert.ok(sanitized.includes("Hello"));
        });
    });

    describe("report accessibility", () => {
        it("detects expired published reports", () => {
            assert.equal(isReportExpired("2020-01-01T00:00:00.000Z"), true);
            assert.equal(isPublicReportAccessible({ status: "draft", expiresAt: null }), false);
            assert.equal(
                isPublicReportAccessible({
                    status: "published",
                    expiresAt: "2099-01-01T00:00:00.000Z",
                }),
                true,
            );
        });

        it("throws validation errors with safe messages", () => {
            const error = new PublicReportValidationError("REPORT_NOT_PUBLISHED", "Report is not published.");
            assert.equal(error.message, "Report is not published.");
            assert.equal(error.code, "REPORT_NOT_PUBLISHED");
        });
    });
});
