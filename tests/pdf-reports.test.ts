import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
    calculateSnapshotChecksum,
    getPdfChecksumInput,
} from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { buildPdfRenderToken } from "@/src/services/pdf-reports/build-pdf-render-token";
import { validatePdfRenderToken } from "@/src/services/pdf-reports/validate-pdf-render-token";
import { getPdfFilename } from "@/src/services/pdf-reports/get-pdf-filename";
import { getPdfReadiness } from "@/src/services/pdf-reports/get-pdf-readiness";
import { PDF_REPORT_VERSION, PDF_RENDER_ENGINE } from "@/src/services/pdf-reports/constants";
import type { SerializablePublicReport } from "@/src/types/public-report";

function sampleReport(overrides: Partial<SerializablePublicReport> = {}): SerializablePublicReport {
    return {
        id: "507f1f77bcf86cd799439020",
        websiteId: "507f1f77bcf86cd799439011",
        crawlId: "507f1f77bcf86cd799439012",
        niceGuyMetricId: "507f1f77bcf86cd799439013",
        aiSummaryId: "507f1f77bcf86cd799439014",
        auditRunId: null,
        heroSuggestionIds: [],
        status: "draft",
        reportVersion: "public-report-v1",
        revisionNumber: 2,
        tokenHash: "hash",
        tokenPrefix: "abcd1234",
        publicPath: null,
        title: "Website Audit for Acme Plumbing",
        subtitle: "July 2026 review",
        settings: {
            showOverallScore: true,
            showScoreConfidence: true,
            showCategoryScores: true,
            showPageSpeed: true,
            showScreenshots: true,
            showStrengths: true,
            showWeaknesses: true,
            showQuickWins: true,
            showLongTermRecommendations: true,
            showPriorityPlan: true,
            showHeroSuggestions: true,
            showTechnicalDetails: true,
            showNiceGuyBranding: true,
            showContactCta: true,
        },
        branding: {
            businessName: "Acme Plumbing",
            websiteUrl: "https://acmeplumbing.example",
            normalizedDomain: "acmeplumbing.example",
            industry: "Plumbing",
            location: "Toronto, ON",
            reportPreparedBy: "Nice Guy Web Design",
            reportPreparedByUrl: "https://niceguyweb.design",
            logoUrl: null,
            accentStyle: null,
        },
        sourceSnapshot: {
            capturedAt: "2026-07-28T00:00:00.000Z",
            niceGuy: {
                overallScore: 72,
                overallConfidence: "medium",
                scoreLabel: "Good foundation",
                strongestCategory: null,
                weakestCategory: null,
                categories: [],
            },
            pageSpeed: { mobile: null, desktop: null },
            ai: {
                executiveSummary: "The website presents a clear local service offer.",
                businessImpactSummary: "Improving trust signals could increase leads.",
                strengths: [],
                weaknesses: [],
                quickWins: [],
                longTermRecommendations: [],
                priorityOrder: [],
                disclaimers: [],
            },
            screenshots: [],
            heroSuggestions: [],
        },
        publishedAt: null,
        unpublishedAt: null,
        archivedAt: null,
        expiresAt: null,
        viewCount: 12,
        uniqueViewEstimate: 0,
        lastViewedAt: null,
        createdAt: "2026-07-28T00:00:00.000Z",
        updatedAt: "2026-07-28T00:00:00.000Z",
        ...overrides,
    } as SerializablePublicReport;
}

describe("pdf snapshot checksum", () => {
    it("produces identical checksums for identical snapshots", () => {
        const first = sampleReport();
        const second = sampleReport();
        assert.equal(calculateSnapshotChecksum(first), calculateSnapshotChecksum(second));
    });

    it("changes when title changes", () => {
        const base = calculateSnapshotChecksum(sampleReport());
        const changed = calculateSnapshotChecksum(
            sampleReport({ title: "Different title" }),
        );
        assert.notEqual(base, changed);
    });

    it("changes when score changes", () => {
        const base = sampleReport();
        const changed = sampleReport({
            sourceSnapshot: {
                ...base.sourceSnapshot,
                niceGuy: { ...base.sourceSnapshot.niceGuy, overallScore: 55 },
            },
        });
        assert.notEqual(
            calculateSnapshotChecksum(base),
            calculateSnapshotChecksum(changed),
        );
    });

    it("ignores view count and token values", () => {
        const base = sampleReport();
        const changed = sampleReport({
            viewCount: 999,
            tokenHash: "other-hash",
            tokenPrefix: "zzzzzzzz",
            status: "published",
        });
        assert.equal(
            calculateSnapshotChecksum(base),
            calculateSnapshotChecksum(changed),
        );
    });

    it("uses stable key ordering", () => {
        const input = getPdfChecksumInput(sampleReport());
        const reordered = JSON.parse(JSON.stringify(input));
        assert.equal(
            calculateSnapshotChecksum(sampleReport()),
            calculateSnapshotChecksum(sampleReport()),
        );
    });
});

describe("pdf render token security", () => {
    beforeEach(() => {
        process.env.PDF_RENDER_SECRET = "test-render-secret";
    });

    it("validates a freshly built token", () => {
        const checksum = calculateSnapshotChecksum(sampleReport());
        const token = buildPdfRenderToken({
            publicReportId: "507f1f77bcf86cd799439020",
            pdfReportId: "507f1f77bcf86cd799439021",
            snapshotChecksum: checksum,
        });

        const payload = validatePdfRenderToken(token, {
            publicReportId: "507f1f77bcf86cd799439020",
            pdfReportId: "507f1f77bcf86cd799439021",
            snapshotChecksum: checksum,
        });

        assert.ok(payload);
        assert.equal(payload?.publicReportId, "507f1f77bcf86cd799439020");
    });

    it("rejects invalid signatures and malformed tokens", () => {
        const checksum = calculateSnapshotChecksum(sampleReport());
        const token = buildPdfRenderToken({
            publicReportId: "507f1f77bcf86cd799439020",
            pdfReportId: "507f1f77bcf86cd799439021",
            snapshotChecksum: checksum,
        });

        assert.equal(
            validatePdfRenderToken("not-a-token", {
                publicReportId: "507f1f77bcf86cd799439020",
                pdfReportId: "507f1f77bcf86cd799439021",
                snapshotChecksum: checksum,
            }),
            null,
        );

        const tampered = `${token.slice(0, -1)}x`;
        assert.equal(
            validatePdfRenderToken(tampered, {
                publicReportId: "507f1f77bcf86cd799439020",
                pdfReportId: "507f1f77bcf86cd799439021",
                snapshotChecksum: checksum,
            }),
            null,
        );
    });

    it("rejects wrong report, pdf, or checksum values", () => {
        const checksum = calculateSnapshotChecksum(sampleReport());
        const token = buildPdfRenderToken({
            publicReportId: "507f1f77bcf86cd799439020",
            pdfReportId: "507f1f77bcf86cd799439021",
            snapshotChecksum: checksum,
        });

        assert.equal(
            validatePdfRenderToken(token, {
                publicReportId: "wrong",
                pdfReportId: "507f1f77bcf86cd799439021",
                snapshotChecksum: checksum,
            }),
            null,
        );
    });
});

describe("pdf readiness", () => {
    beforeEach(() => {
        // React PDF no longer requires PDF_RENDER_SECRET.
        delete process.env.PDF_RENDER_SECRET;
        process.env.CLOUDINARY_CLOUD_NAME = "demo";
        process.env.CLOUDINARY_API_KEY = "demo-key";
        process.env.CLOUDINARY_API_SECRET = "demo-secret";
    });

    it("allows draft reports when snapshot is complete without PDF_RENDER_SECRET", () => {
        const readiness = getPdfReadiness({
            report: sampleReport({ status: "draft" }),
            websiteActive: true,
            hasActiveGeneration: false,
            matchingPdfId: null,
        });
        assert.equal(readiness.canGenerate, true);
        assert.equal(
            readiness.blockers.some((blocker) => blocker.code === "RENDERER_NOT_CONFIGURED"),
            false,
        );
    });

    it("blocks archived reports unless explicitly allowed", () => {
        const blocked = getPdfReadiness({
            report: sampleReport({ status: "archived" }),
            websiteActive: true,
            hasActiveGeneration: false,
            matchingPdfId: null,
        });
        assert.equal(blocked.canGenerate, false);

        const allowed = getPdfReadiness({
            report: sampleReport({ status: "archived" }),
            websiteActive: true,
            hasActiveGeneration: false,
            matchingPdfId: null,
            allowArchived: true,
        });
        assert.equal(allowed.canGenerate, true);
    });

    it("detects matching completed PDFs and active runs", () => {
        const matching = getPdfReadiness({
            report: sampleReport(),
            websiteActive: true,
            hasActiveGeneration: false,
            matchingPdfId: "507f1f77bcf86cd799439099",
        });
        assert.equal(matching.matchingPdfExists, true);

        const active = getPdfReadiness({
            report: sampleReport(),
            websiteActive: true,
            hasActiveGeneration: true,
            matchingPdfId: null,
        });
        assert.equal(active.canGenerate, false);
        assert.equal(active.blockers[0]?.code, "ALREADY_RUNNING");
    });
});

describe("pdf filename helper", () => {
    it("sanitizes business names and includes revision", () => {
        assert.equal(
            getPdfFilename({
                businessName: "Maple Leaf Plumbing!",
                normalizedDomain: "mapleleaf.example",
                revisionNumber: 2,
            }),
            "maple-leaf-plumbing-website-audit-r2.pdf",
        );
    });
});

describe("pdf constants", () => {
    it("uses the expected pdf version and React PDF engine", () => {
        assert.equal(PDF_REPORT_VERSION, "pdf-report-v1");
        assert.equal(PDF_RENDER_ENGINE, "react-pdf");
    });
});
