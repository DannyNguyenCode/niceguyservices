import "server-only";

import { getAuditJobByAuditRunId } from "@/src/data/audit-jobs";
import { getCompletedPdfReportsForPublicReport } from "@/src/data/pdf-reports";
import {
    getLatestPublicReportForAuditRun,
    getPublicReportById,
} from "@/src/data/public-reports";
import { generatePdfReport } from "@/src/services/pdf-reports/generate-pdf-report";
import { publishPublicReport } from "@/src/services/public-reports/publish-public-report";
import type { SerializableAuditJob } from "@/src/services/audit-pipeline/types";
import type { SerializablePdfReport } from "@/src/services/pdf-reports/types";
import type { SerializablePublicReport } from "@/src/types/public-report";

export type CompletePublicAuditDeliverablesResult = {
    ok: boolean;
    reportId: string;
    published: boolean;
    alreadyPublished: boolean;
    pdfGenerated: boolean;
    pdfReused: boolean;
    pdfFailed: boolean;
    error?: { code: string; message: string };
};

export type CompletePublicAuditDeliverablesDeps = {
    getAuditJobByAuditRunId?: (
        auditRunId: string,
    ) => Promise<SerializableAuditJob | null>;
    getPublicReportById?: (id: string) => Promise<SerializablePublicReport | null>;
    getLatestPublicReportForAuditRun?: (
        auditRunId: string,
    ) => Promise<SerializablePublicReport | null>;
    getCompletedPdfReportsForPublicReport?: (
        publicReportId: string,
    ) => Promise<SerializablePdfReport[]>;
    publishPublicReport?: typeof publishPublicReport;
    generatePdfReport?: typeof generatePdfReport;
    log?: (event: string, payload: Record<string, unknown>) => void;
};

function defaultLog(event: string, payload: Record<string, unknown>): void {
    console.info("[public-audit-deliverables]", JSON.stringify({ event, ...payload }));
}

/**
 * After a validated AI analysis produces a report draft:
 * publish the public report (system actor) and generate its PDF.
 *
 * Idempotent: safe under duplicate Cursor callbacks / worker retries.
 * PDF failure does not unpublish the web report.
 */
export async function completePublicAuditDeliverables(
    input: {
        reportId: string;
        websiteId: string;
        auditRunId: string;
    },
    deps: CompletePublicAuditDeliverablesDeps = {},
): Promise<CompletePublicAuditDeliverablesResult> {
    const getJob = deps.getAuditJobByAuditRunId ?? getAuditJobByAuditRunId;
    const getReport = deps.getPublicReportById ?? getPublicReportById;
    const getLatestReport =
        deps.getLatestPublicReportForAuditRun ?? getLatestPublicReportForAuditRun;
    const getPdfs =
        deps.getCompletedPdfReportsForPublicReport ?? getCompletedPdfReportsForPublicReport;
    const publish = deps.publishPublicReport ?? publishPublicReport;
    const generatePdf = deps.generatePdfReport ?? generatePdfReport;
    const log = deps.log ?? defaultLog;

    const baseLog = {
        reportId: input.reportId,
        websiteId: input.websiteId,
        auditRunId: input.auditRunId,
    };

    const job = await getJob(input.auditRunId);
    if (job?.status === "cancelled") {
        log("REPORT_AUTO_PUBLISH_SKIPPED", {
            ...baseLog,
            reason: "AUDIT_CANCELLED",
        });
        return {
            ok: false,
            reportId: input.reportId,
            published: false,
            alreadyPublished: false,
            pdfGenerated: false,
            pdfReused: false,
            pdfFailed: false,
            error: {
                code: "AUDIT_CANCELLED",
                message: "Audit was cancelled; report will not be published.",
            },
        };
    }

    let report = await getReport(input.reportId);
    if (!report) {
        report = await getLatestReport(input.auditRunId);
    }
    if (!report) {
        log("REPORT_AUTO_PUBLISH_FAILED", {
            ...baseLog,
            errorCode: "REPORT_NOT_FOUND",
        });
        return {
            ok: false,
            reportId: input.reportId,
            published: false,
            alreadyPublished: false,
            pdfGenerated: false,
            pdfReused: false,
            pdfFailed: false,
            error: { code: "REPORT_NOT_FOUND", message: "Report not found." },
        };
    }

    const alreadyPublished = report.status === "published";

    if (!alreadyPublished) {
        log("REPORT_AUTO_PUBLISH_STARTED", baseLog);
        const publishResult = await publish(report.id, { actor: "system" });
        if (!publishResult.success) {
            log("REPORT_AUTO_PUBLISH_FAILED", {
                ...baseLog,
                errorCode: publishResult.error.code,
            });
            return {
                ok: false,
                reportId: report.id,
                published: false,
                alreadyPublished: false,
                pdfGenerated: false,
                pdfReused: false,
                pdfFailed: false,
                error: publishResult.error,
            };
        }
        log("REPORT_AUTO_PUBLISHED", {
            ...baseLog,
            reportId: publishResult.reportId,
            revisionNumber: publishResult.revisionNumber,
            actor: "system",
        });
    } else {
        log("REPORT_AUTO_PUBLISH_IDEMPOTENT", {
            ...baseLog,
            reason: "ALREADY_PUBLISHED",
        });
    }

    const existingPdfs = await getPdfs(report.id);
    if (existingPdfs.length > 0) {
        log("PDF_REUSED", {
            ...baseLog,
            pdfReportId: existingPdfs[0]?.id,
        });
        log("AUDIT_DELIVERABLES_COMPLETE", {
            ...baseLog,
            published: true,
            pdfGenerated: true,
            pdfReused: true,
        });
        return {
            ok: true,
            reportId: report.id,
            published: true,
            alreadyPublished,
            pdfGenerated: true,
            pdfReused: true,
            pdfFailed: false,
        };
    }

    log("PDF_GENERATION_STARTED", baseLog);
    const pdfResult = await generatePdf({
        publicReportId: report.id,
        internalWorker: true,
        auditRunId: input.auditRunId,
    });

    if (!pdfResult.success) {
        log("PDF_GENERATION_FAILED", {
            ...baseLog,
            errorCode: pdfResult.error.code,
            stage: pdfResult.error.stage,
        });
        return {
            ok: true,
            reportId: report.id,
            published: true,
            alreadyPublished,
            pdfGenerated: false,
            pdfReused: false,
            pdfFailed: true,
            error: {
                code: pdfResult.error.code,
                message: pdfResult.error.message,
            },
        };
    }

    log(pdfResult.reusedExisting ? "PDF_REUSED" : "PDF_GENERATED", {
        ...baseLog,
        pdfReportId: pdfResult.pdfReport.id,
    });
    log("PDF_STORED", {
        ...baseLog,
        pdfReportId: pdfResult.pdfReport.id,
        status: pdfResult.pdfReport.status,
    });
    log("AUDIT_DELIVERABLES_COMPLETE", {
        ...baseLog,
        published: true,
        pdfGenerated: true,
        pdfReused: pdfResult.reusedExisting,
    });

    return {
        ok: true,
        reportId: report.id,
        published: true,
        alreadyPublished,
        pdfGenerated: true,
        pdfReused: pdfResult.reusedExisting,
        pdfFailed: false,
    };
}
