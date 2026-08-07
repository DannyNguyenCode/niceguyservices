import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, it } from "node:test";
import { completePublicAuditDeliverables } from "@/src/services/public-reports/complete-public-audit-deliverables";
import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";
import type { SerializablePdfReport } from "@/src/services/pdf-reports/types";
import type { SerializablePublicReport } from "@/src/types/public-report";

function draftReport(
    overrides: Partial<SerializablePublicReport> = {},
): SerializablePublicReport {
    return {
        id: "507f1f77bcf86cd799439020",
        websiteId: "507f1f77bcf86cd799439011",
        crawlId: "507f1f77bcf86cd799439012",
        niceGuyMetricId: "507f1f77bcf86cd799439013",
        aiSummaryId: "507f1f77bcf86cd799439014",
        auditRunId: "507f1f77bcf86cd799439015",
        sourceAuditRunId: "507f1f77bcf86cd799439015",
        heroSuggestionIds: [],
        status: "draft",
        reportVersion: "public-report-v1",
        revisionNumber: 1,
        tokenHash: null,
        tokenPrefix: null,
        publicPath: null,
        title: "Website Audit",
        subtitle: null,
        settings: {} as SerializablePublicReport["settings"],
        branding: {} as SerializablePublicReport["branding"],
        sourceSnapshot: {} as SerializablePublicReport["sourceSnapshot"],
        publishedAt: null,
        unpublishedAt: null,
        archivedAt: null,
        expiresAt: null,
        viewCount: 0,
        uniqueViewEstimate: 0,
        lastViewedAt: null,
        createdAt: "2026-08-06T00:00:00.000Z",
        updatedAt: "2026-08-06T00:00:00.000Z",
        ...overrides,
    } as SerializablePublicReport;
}

function job(status: SerializableAuditJob["status"]): SerializableAuditJob {
    return { id: "job1", status } as SerializableAuditJob;
}

function pdf(id = "pdf1"): SerializablePdfReport {
    return { id, status: "complete" } as SerializablePdfReport;
}

describe("completePublicAuditDeliverables", () => {
    it("publishes a draft and generates a PDF as system automation", async () => {
        const events: string[] = [];
        let publishCalls = 0;
        let pdfCalls = 0;
        let publishActor: string | undefined;

        const result = await completePublicAuditDeliverables(
            {
                reportId: "507f1f77bcf86cd799439020",
                websiteId: "507f1f77bcf86cd799439011",
                auditRunId: "507f1f77bcf86cd799439015",
            },
            {
                getAuditJobByAuditRunId: async () => job("processing"),
                getPublicReportById: async () => draftReport(),
                getCompletedPdfReportsForPublicReport: async () => [],
                publishPublicReport: async (_id, options) => {
                    publishCalls += 1;
                    publishActor = options?.actor;
                    return {
                        success: true,
                        reportId: "507f1f77bcf86cd799439020",
                        publicUrl: "https://example.com/report/token",
                        tokenPrefix: "abcd1234",
                        revisionNumber: 1,
                        message: "published",
                    };
                },
                generatePdfReport: async (input) => {
                    pdfCalls += 1;
                    assert.equal(input.internalWorker, true);
                    assert.equal(input.publicReportId, "507f1f77bcf86cd799439020");
                    return {
                        success: true,
                        reusedExisting: false,
                        pdfReport: pdf(),
                        downloadUrl: "/api/admin/pdf-reports/pdf1/download",
                    };
                },
                log: (event) => {
                    events.push(event);
                },
            },
        );

        assert.equal(result.ok, true);
        assert.equal(result.published, true);
        assert.equal(result.pdfGenerated, true);
        assert.equal(result.pdfFailed, false);
        assert.equal(publishCalls, 1);
        assert.equal(pdfCalls, 1);
        assert.equal(publishActor, "system");
        assert.ok(events.includes("REPORT_AUTO_PUBLISH_STARTED"));
        assert.ok(events.includes("REPORT_AUTO_PUBLISHED"));
        assert.ok(events.includes("PDF_GENERATION_STARTED"));
        assert.ok(events.includes("PDF_GENERATED"));
        assert.ok(events.includes("AUDIT_DELIVERABLES_COMPLETE"));
    });

    it("is idempotent for duplicate callbacks when already published with PDF", async () => {
        let publishCalls = 0;
        let pdfCalls = 0;

        const result = await completePublicAuditDeliverables(
            {
                reportId: "507f1f77bcf86cd799439020",
                websiteId: "507f1f77bcf86cd799439011",
                auditRunId: "507f1f77bcf86cd799439015",
            },
            {
                getAuditJobByAuditRunId: async () => job("completed"),
                getPublicReportById: async () =>
                    draftReport({ status: "published", publicPath: "/report/tok" }),
                getCompletedPdfReportsForPublicReport: async () => [pdf()],
                publishPublicReport: async () => {
                    publishCalls += 1;
                    return {
                        success: true,
                        reportId: "507f1f77bcf86cd799439020",
                        publicUrl: "https://example.com/report/tok",
                        tokenPrefix: "abcd1234",
                        revisionNumber: 1,
                        message: "already",
                    };
                },
                generatePdfReport: async () => {
                    pdfCalls += 1;
                    return {
                        success: true,
                        reusedExisting: false,
                        pdfReport: pdf("pdf-new"),
                        downloadUrl: "/x",
                    };
                },
                log: () => undefined,
            },
        );

        assert.equal(result.ok, true);
        assert.equal(result.alreadyPublished, true);
        assert.equal(result.pdfReused, true);
        assert.equal(publishCalls, 0);
        assert.equal(pdfCalls, 0);
    });

    it("resumes PDF generation for an already-published report without republishing", async () => {
        let publishCalls = 0;
        let pdfCalls = 0;

        const result = await completePublicAuditDeliverables(
            {
                reportId: "507f1f77bcf86cd799439020",
                websiteId: "507f1f77bcf86cd799439011",
                auditRunId: "507f1f77bcf86cd799439015",
            },
            {
                getAuditJobByAuditRunId: async () => job("completed"),
                getPublicReportById: async () =>
                    draftReport({ status: "published", publicPath: "/report/tok" }),
                getCompletedPdfReportsForPublicReport: async () => [],
                publishPublicReport: async () => {
                    publishCalls += 1;
                    return {
                        success: false,
                        error: { code: "SHOULD_NOT_RUN", message: "no" },
                    };
                },
                generatePdfReport: async () => {
                    pdfCalls += 1;
                    return {
                        success: true,
                        reusedExisting: false,
                        pdfReport: pdf(),
                        downloadUrl: "/x",
                    };
                },
                log: () => undefined,
            },
        );

        assert.equal(result.ok, true);
        assert.equal(result.alreadyPublished, true);
        assert.equal(result.published, true);
        assert.equal(result.pdfGenerated, true);
        assert.equal(publishCalls, 0);
        assert.equal(pdfCalls, 1);
    });

    it("keeps the published web report when PDF generation fails", async () => {
        const result = await completePublicAuditDeliverables(
            {
                reportId: "507f1f77bcf86cd799439020",
                websiteId: "507f1f77bcf86cd799439011",
                auditRunId: "507f1f77bcf86cd799439015",
            },
            {
                getAuditJobByAuditRunId: async () => job("processing"),
                getPublicReportById: async () => draftReport(),
                getCompletedPdfReportsForPublicReport: async () => [],
                publishPublicReport: async () => ({
                    success: true,
                    reportId: "507f1f77bcf86cd799439020",
                    publicUrl: "https://example.com/report/tok",
                    tokenPrefix: "abcd1234",
                    revisionNumber: 1,
                    message: "published",
                }),
                generatePdfReport: async () => ({
                    success: false,
                    error: {
                        code: "PDF_STORAGE_NOT_CONFIGURED",
                        message: "Storage missing",
                        stage: "PDF_CONFIGURATION",
                    },
                }),
                log: () => undefined,
            },
        );

        assert.equal(result.ok, true);
        assert.equal(result.published, true);
        assert.equal(result.pdfFailed, true);
        assert.equal(result.pdfGenerated, false);
        assert.equal(result.error?.code, "PDF_STORAGE_NOT_CONFIGURED");
    });

    it("does not publish cancelled audits", async () => {
        let publishCalls = 0;
        const result = await completePublicAuditDeliverables(
            {
                reportId: "507f1f77bcf86cd799439020",
                websiteId: "507f1f77bcf86cd799439011",
                auditRunId: "507f1f77bcf86cd799439015",
            },
            {
                getAuditJobByAuditRunId: async () => job("cancelled"),
                getPublicReportById: async () => draftReport(),
                publishPublicReport: async () => {
                    publishCalls += 1;
                    return {
                        success: true,
                        reportId: "x",
                        publicUrl: "",
                        tokenPrefix: "",
                        revisionNumber: 1,
                        message: "",
                    };
                },
                generatePdfReport: async () => {
                    throw new Error("should not generate");
                },
                log: () => undefined,
            },
        );

        assert.equal(result.ok, false);
        assert.equal(result.error?.code, "AUDIT_CANCELLED");
        assert.equal(publishCalls, 0);
    });

    it("does not generate a PDF when publish fails", async () => {
        let pdfCalls = 0;
        const result = await completePublicAuditDeliverables(
            {
                reportId: "507f1f77bcf86cd799439020",
                websiteId: "507f1f77bcf86cd799439011",
                auditRunId: "507f1f77bcf86cd799439015",
            },
            {
                getAuditJobByAuditRunId: async () => job("processing"),
                getPublicReportById: async () => draftReport(),
                getCompletedPdfReportsForPublicReport: async () => [],
                publishPublicReport: async () => ({
                    success: false,
                    error: { code: "WEBSITE_INACTIVE", message: "inactive" },
                }),
                generatePdfReport: async () => {
                    pdfCalls += 1;
                    return {
                        success: true,
                        reusedExisting: false,
                        pdfReport: pdf(),
                        downloadUrl: "/x",
                    };
                },
                log: () => undefined,
            },
        );

        assert.equal(result.ok, false);
        assert.equal(result.published, false);
        assert.equal(pdfCalls, 0);
        assert.equal(result.error?.code, "WEBSITE_INACTIVE");
    });
});

describe("post-AI auto deliverable wiring", () => {
    it("hooks auto-publish into report_draft and resume paths without a second PDF path", async () => {
        const stageSource = await readFile(
            path.join(process.cwd(), "src/services/audit-pipeline/run-audit-stage.ts"),
            "utf8",
        );
        const resumeSource = await readFile(
            path.join(
                process.cwd(),
                "src/services/audit-pipeline/resume-audit-after-cursor.ts",
            ),
            "utf8",
        );
        const publishSource = await readFile(
            path.join(
                process.cwd(),
                "src/services/public-reports/publish-public-report.ts",
            ),
            "utf8",
        );
        const callbackSource = await readFile(
            path.join(
                process.cwd(),
                "src/services/cursor-analysis/request-cursor-analysis.ts",
            ),
            "utf8",
        );

        assert.match(stageSource, /completePublicAuditDeliverables/);
        assert.match(resumeSource, /completePublicAuditDeliverables/);
        assert.match(publishSource, /actor === "system"/);
        assert.match(publishSource, /actor:\s*"admin"|options\?\.actor \?\? "admin"/);
        assert.match(callbackSource, /authenticateAnalysisCallback/);
        assert.match(callbackSource, /resumeAuditAfterCursorCallback/);
        assert.equal(/generatePdfReport\(/.test(callbackSource), false);
        assert.equal(/uploadReportPdf\(/.test(callbackSource), false);
    });

    it("preserves secure report lookup verification", async () => {
        const lookupSource = await readFile(
            path.join(process.cwd(), "components/websiteAudit/ReportLookupForm.tsx"),
            "utf8",
        );
        assert.match(lookupSource, /verification code|6-digit/i);
        assert.match(lookupSource, /request-code|verify-code/);
    });
});
