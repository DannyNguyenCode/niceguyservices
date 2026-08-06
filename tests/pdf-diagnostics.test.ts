import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    createPdfAttemptId,
    looksLikeVercelProtectionPage,
    sanitizeErrorMessage,
    sanitizeNavigationTarget,
    urlContainsSensitiveQuery,
} from "@/src/services/pdf-reports/pdf-diagnostics";
import {
    PdfStageError,
    classifyPdfFailure,
    classifyPrintHttpStatus,
    getPdfAdminErrorMessage,
} from "@/src/services/pdf-reports/pdf-stage-error";

describe("pdf stage error classification", () => {
    it("maps Chromium launch failure", () => {
        const classified = classifyPdfFailure(
            new PdfStageError("PDF_CHROMIUM_LAUNCH_FAILED", "CHROMIUM_LAUNCH"),
        );
        assert.equal(classified.code, "PDF_CHROMIUM_LAUNCH_FAILED");
        assert.equal(classified.stage, "CHROMIUM_LAUNCH");
    });

    it("maps print navigation failure", () => {
        const classified = classifyPdfFailure(
            new PdfStageError("PDF_PRINT_NAVIGATION_FAILED", "PRINT_NAVIGATION"),
        );
        assert.equal(classified.code, "PDF_PRINT_NAVIGATION_FAILED");
        assert.equal(classified.stage, "PRINT_NAVIGATION");
    });

    it("maps print route 401/403 to unauthorized", () => {
        assert.equal(classifyPrintHttpStatus(401), "PDF_PRINT_ROUTE_UNAUTHORIZED");
        assert.equal(classifyPrintHttpStatus(403), "PDF_PRINT_ROUTE_UNAUTHORIZED");
        const classified = classifyPdfFailure(
            new PdfStageError("PDF_PRINT_ROUTE_UNAUTHORIZED", "PRINT_ROUTE_HTTP"),
        );
        assert.equal(classified.code, "PDF_PRINT_ROUTE_UNAUTHORIZED");
    });

    it("maps print route 404", () => {
        assert.equal(classifyPrintHttpStatus(404), "PDF_PRINT_ROUTE_NOT_FOUND");
    });

    it("maps print route 500", () => {
        assert.equal(classifyPrintHttpStatus(500), "PDF_PRINT_ROUTE_SERVER_ERROR");
        assert.equal(classifyPrintHttpStatus(502), "PDF_PRINT_ROUTE_SERVER_ERROR");
    });

    it("maps report-ready timeout", () => {
        const classified = classifyPdfFailure(
            new PdfStageError("PDF_REPORT_READY_TIMEOUT", "REPORT_READY"),
        );
        assert.equal(classified.code, "PDF_REPORT_READY_TIMEOUT");
        assert.equal(classified.stage, "REPORT_READY");
    });

    it("maps page.pdf failure", () => {
        const classified = classifyPdfFailure(
            new PdfStageError("PDF_BUFFER_RENDER_FAILED", "PDF_RENDER"),
        );
        assert.equal(classified.code, "PDF_BUFFER_RENDER_FAILED");
    });

    it("maps Cloudinary/storage failure separately from render", () => {
        const classified = classifyPdfFailure(
            new PdfStageError("PDF_STORAGE_FAILED", "STORAGE"),
        );
        assert.equal(classified.code, "PDF_STORAGE_FAILED");
        assert.equal(classified.stage, "STORAGE");
        assert.notEqual(classified.code, "PDF_RENDER_FAILED");
    });

    it("falls back unknown errors to PDF_RENDER_FAILED", () => {
        const classified = classifyPdfFailure(new Error("boom"));
        assert.equal(classified.code, "PDF_RENDER_FAILED");
        assert.equal(classified.stage, "PDF_RENDER");
    });

    it("preserves legacy PDF_ message codes", () => {
        const classified = classifyPdfFailure(new Error("PDF_UPLOAD_FAILED"));
        assert.equal(classified.code, "PDF_UPLOAD_FAILED");
        assert.equal(classified.stage, "STORAGE");
    });

    it("provides safe admin messages without secrets", () => {
        const message = getPdfAdminErrorMessage("PDF_VERCEL_PROTECTION_BLOCKED");
        assert.match(message, /deployment protection/i);
        assert.equal(message.includes("secret"), false);
        assert.equal(message.includes("token"), false);
    });
});

describe("pdf diagnostic sanitization", () => {
    it("redacts report id from print pathname", () => {
        const sanitized = sanitizeNavigationTarget(
            "https://preview.example.vercel.app/internal/reports/507f1f77bcf86cd799439020/print?renderToken=abc.def",
        );
        assert.equal(sanitized.host, "preview.example.vercel.app");
        assert.equal(sanitized.pathname, "/internal/reports/[redacted]/print");
    });

    it("detects sensitive query keys without exposing values", () => {
        assert.equal(
            urlContainsSensitiveQuery(
                "https://example.com/print?renderToken=super-secret-token",
            ),
            true,
        );
        assert.equal(
            urlContainsSensitiveQuery(
                "https://example.com/print?x-vercel-protection-bypass=bypass-secret",
            ),
            true,
        );
        assert.equal(urlContainsSensitiveQuery("https://example.com/print"), false);
    });

    it("sanitizes error messages that include tokens", () => {
        const sanitized = sanitizeErrorMessage(
            "Failed https://x.vercel.app/print?renderToken=abc.def&x-vercel-protection-bypass=sekrit",
        );
        assert.ok(sanitized);
        assert.equal(sanitized!.includes("sekrit"), false);
        assert.equal(sanitized!.includes("abc.def"), false);
    });

    it("creates opaque attempt ids", () => {
        const id = createPdfAttemptId();
        assert.match(id, /^[a-f0-9]{8}$/);
    });

    it("detects Vercel protection indicators", () => {
        assert.equal(
            looksLikeVercelProtectionPage({
                status: 401,
                title: "Authentication Required",
            }),
            true,
        );
        assert.equal(
            looksLikeVercelProtectionPage({
                status: 200,
                title: "Website Audit Report",
                finalUrl: "https://preview.example.vercel.app/internal/reports/x/print",
            }),
            false,
        );
    });
});
