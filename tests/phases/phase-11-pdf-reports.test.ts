import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { calculateSnapshotChecksum } from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { buildPdfRenderToken } from "@/src/services/pdf-reports/build-pdf-render-token";
import { validatePdfRenderToken } from "@/src/services/pdf-reports/validate-pdf-render-token";
import { getPdfFilename } from "@/src/services/pdf-reports/get-pdf-filename";
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
            websiteUrl: "https://acme.example",
            normalizedDomain: "acme.example",
            industry: "Plumbing",
            location: "Toronto",
            reportPreparedBy: "Nice Guy Web Design",
            reportPreparedByUrl: null,
            logoUrl: null,
            accentStyle: null,
        },
        sourceSnapshot: {
            crawl: {
                id: "507f1f77bcf86cd799439012",
                status: "complete",
                completedAt: "2026-07-28T00:00:00.000Z",
                pageCount: 3,
                successfulPageCount: 3,
                failedPageCount: 0,
                version: "crawl-v1",
            },
            pageSpeed: {
                mobileAvailable: true,
                desktopAvailable: true,
            },
            niceGuy: {
                overallScore: 70,
                confidence: "medium",
                categories: [],
            },
            ai: {
                strengths: [],
                weaknesses: [],
                quickWins: [],
                longTermRecommendations: [],
            },
            screenshots: [],
            heroSuggestions: [],
        },
        publishedAt: null,
        unpublishedAt: null,
        archivedAt: null,
        expiresAt: null,
        viewCount: 0,
        uniqueViewEstimate: 0,
        lastViewedAt: null,
        createdAt: "2026-07-28T00:00:00.000Z",
        updatedAt: "2026-07-28T00:00:00.000Z",
        ...overrides,
    } as SerializablePublicReport;
}

describe("Phase 11 — PDF report generation", () => {
    describe("checksums", () => {
        it("produces identical checksums for identical snapshots", () => {
            assert.equal(
                calculateSnapshotChecksum(sampleReport()),
                calculateSnapshotChecksum(sampleReport()),
            );
        });

        it("changes checksum when title changes", () => {
            const base = calculateSnapshotChecksum(sampleReport());
            const changed = calculateSnapshotChecksum(
                sampleReport({ title: "Different title" }),
            );
            assert.notEqual(base, changed);
        });
    });

    describe("render tokens", () => {
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
        });

        it("rejects malformed tokens", () => {
            const checksum = calculateSnapshotChecksum(sampleReport());
            assert.equal(
                validatePdfRenderToken("not-a-token", {
                    publicReportId: "507f1f77bcf86cd799439020",
                    pdfReportId: "507f1f77bcf86cd799439021",
                    snapshotChecksum: checksum,
                }),
                null,
            );
        });
    });

    describe("filenames", () => {
        it("builds readable PDF filenames from business name and revision", () => {
            const filename = getPdfFilename({
                businessName: "Acme Plumbing & Co.",
                revisionNumber: 2,
            });
            assert.match(filename, /^acme-plumbing-co-website-audit-r2\.pdf$/);
        });
    });
});
