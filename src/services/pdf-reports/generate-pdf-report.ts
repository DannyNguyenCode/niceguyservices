import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import {
    completePdfReportRecord,
    createPdfReportRecord,
    failPdfReportRecord,
    getMatchingCompletedPdfReport,
    hasActivePdfGeneration,
    startPdfReportProcessing,
} from "@/src/data/pdf-reports";
import { getPublicReportById } from "@/src/data/public-reports";
import { getWebsiteById, updateWebsitePdfSummary } from "@/src/data/websites";
import { calculateSnapshotChecksum } from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { deletePdfAsset } from "@/src/services/pdf-reports/delete-pdf-asset";
import { getPdfFilename } from "@/src/services/pdf-reports/get-pdf-filename";
import { getPdfReadiness } from "@/src/services/pdf-reports/get-pdf-readiness";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { renderReportPdf } from "@/src/services/pdf-reports/render-report-pdf";
import { uploadReportPdf } from "@/src/services/pdf-reports/upload-report-pdf";
import { enforceAdministratorActionRateLimit } from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";
import type { SerializablePdfReport } from "@/src/services/pdf-reports/types";

export type GeneratePdfReportResult =
    | {
          success: true;
          reusedExisting: boolean;
          pdfReport: SerializablePdfReport;
          downloadUrl: string;
      }
    | {
          success: false;
          error: { code: string; message: string };
      };

function safeErrorMessage(code: string): string {
    const messages: Record<string, string> = {
        PDF_INVALID_REPORT_ID: "Invalid report ID.",
        PDF_REPORT_NOT_FOUND: "Public report not found.",
        PDF_WEBSITE_NOT_FOUND: "Website not found.",
        PDF_SOURCE_REPORT_INVALID: "Public report cannot be used for PDF generation.",
        PDF_SNAPSHOT_INCOMPLETE: "Public report snapshot is incomplete.",
        PDF_ALREADY_RUNNING: "PDF generation is already running for this report.",
        PDF_RENDER_FAILED: "PDF rendering failed.",
        PDF_RENDER_TIMEOUT: "PDF rendering timed out.",
        PDF_BROWSER_LAUNCH_FAILED: "PDF browser could not be launched.",
        PDF_INVALID_BUFFER: "Generated PDF was invalid.",
        PDF_FILE_TOO_LARGE: "Generated PDF exceeded the maximum file size.",
        PDF_UPLOAD_FAILED: "PDF upload failed.",
        PDF_SAVE_FAILED: "Unable to save PDF metadata.",
    };
    return messages[code] ?? "Unable to generate PDF.";
}

export async function generatePdfReport(
    input: {
        publicReportId: string;
        forceRegenerate?: boolean;
        allowArchived?: boolean;
    } & RateLimitedServiceOptions,
): Promise<GeneratePdfReportResult> {
    if (!input.publicReportId?.trim()) {
        return {
            success: false,
            error: { code: "PDF_INVALID_REPORT_ID", message: safeErrorMessage("PDF_INVALID_REPORT_ID") },
        };
    }

    const report = await getPublicReportById(input.publicReportId);
    if (!report) {
        return {
            success: false,
            error: { code: "PDF_REPORT_NOT_FOUND", message: safeErrorMessage("PDF_REPORT_NOT_FOUND") },
        };
    }

    const website = await getWebsiteById(report.websiteId);
    if (!website || website.deletedAt) {
        return {
            success: false,
            error: { code: "PDF_WEBSITE_NOT_FOUND", message: safeErrorMessage("PDF_WEBSITE_NOT_FOUND") },
        };
    }

    const snapshotChecksum = calculateSnapshotChecksum(report);
    const activeGeneration = await hasActivePdfGeneration(report.id);
    const matching = await getMatchingCompletedPdfReport({
        publicReportId: report.id,
        snapshotChecksum,
    });

    const readiness = getPdfReadiness({
        report,
        websiteActive: !website.deletedAt,
        hasActiveGeneration: activeGeneration,
        matchingPdfId: matching?.id ?? null,
        allowArchived: input.allowArchived,
    });

    if (!readiness.canGenerate) {
        const blocker = readiness.blockers[0];
        const code =
            blocker?.code === "ALREADY_RUNNING"
                ? "PDF_ALREADY_RUNNING"
                : blocker?.code === "SNAPSHOT_INCOMPLETE"
                  ? "PDF_SNAPSHOT_INCOMPLETE"
                  : blocker?.code === "REPORT_ARCHIVED" || blocker?.code === "REPORT_STATUS_INVALID"
                    ? "PDF_SOURCE_REPORT_INVALID"
                    : "PDF_SOURCE_REPORT_INVALID";
        return {
            success: false,
            error: { code, message: blocker?.message ?? safeErrorMessage(code) },
        };
    }

    if (matching && !input.forceRegenerate) {
        return {
            success: true,
            reusedExisting: true,
            pdfReport: matching,
            downloadUrl: `/api/admin/pdf-reports/${matching.id}/download`,
        };
    }

    await enforceAdministratorActionRateLimit({
        policyId: "pdf-generate",
        websiteId: report.websiteId,
        administratorIdentity: input.administratorIdentity,
        internalWorker: input.internalWorker,
    });

    const filename = getPdfFilename({
        businessName: report.branding.businessName,
        normalizedDomain: report.branding.normalizedDomain,
        revisionNumber: report.revisionNumber,
    });

    const pdfRecord = await createPdfReportRecord({
        websiteId: report.websiteId,
        publicReportId: report.id,
        auditRunId: report.auditRunId,
        sourceAuditRunId: report.sourceAuditRunId ?? report.auditRunId,
        sourceAuditNumber: report.sourceAuditNumber,
        snapshotChecksum,
        publicReportVersion: report.reportVersion,
        publicReportRevision: report.revisionNumber,
        reportTitle: report.title,
    });

    await updateWebsitePdfSummary(report.websiteId, "queued");
    await createActivityLog({
        websiteId: report.websiteId,
        type: "pdf-report-queued",
        actor: "system",
        metadata: {
            pdfReportId: pdfRecord.id,
            publicReportId: report.id,
            publicReportRevision: report.revisionNumber,
            pdfVersion: pdfRecord.pdfVersion,
            snapshotChecksumPrefix: snapshotChecksum.slice(0, 8),
        },
    });

    const renderStartedAt = Date.now();
    let uploadedPublicId: string | null = null;

    try {
        await startPdfReportProcessing(pdfRecord.id);
        await updateWebsitePdfSummary(report.websiteId, "processing");
        await createActivityLog({
            websiteId: report.websiteId,
            type: "pdf-report-started",
            actor: "system",
            metadata: {
                pdfReportId: pdfRecord.id,
                publicReportId: report.id,
                publicReportRevision: report.revisionNumber,
                pdfVersion: pdfRecord.pdfVersion,
            },
        });

        const rendered = await renderReportPdf({
            publicReportId: report.id,
            pdfReportId: pdfRecord.id,
            snapshotChecksum,
        });

        const uploaded = await uploadReportPdf({
            buffer: rendered.buffer,
            websiteId: report.websiteId,
            revisionNumber: report.revisionNumber,
            pdfReportId: pdfRecord.id,
            filename,
        });
        uploadedPublicId = uploaded.publicId;

        const completed = await completePdfReportRecord(pdfRecord.id, {
            file: {
                provider: uploaded.provider,
                secureUrl: uploaded.secureUrl,
                publicId: uploaded.publicId,
                resourceType: uploaded.resourceType,
                format: uploaded.format,
                filename: uploaded.filename,
                bytes: uploaded.bytes,
                pageCount: rendered.pageCount,
                checksum: uploaded.checksum,
            },
            engineVersion: rendered.engineVersion,
            pageCount: rendered.pageCount,
            durationMs: Date.now() - renderStartedAt,
        });

        if (!completed) {
            throw new Error("PDF_SAVE_FAILED");
        }

        await updateWebsitePdfSummary(report.websiteId, "complete", new Date());

        const sourceAuditRunId = report.sourceAuditRunId ?? report.auditRunId;
        if (sourceAuditRunId) {
            await registerAuditReference({
                auditRunId: sourceAuditRunId,
                resourceType: "pdf-report",
                resourceId: completed.id,
            });
        }

        await createActivityLog({
            websiteId: report.websiteId,
            type: "pdf-report-completed",
            actor: "system",
            metadata: {
                pdfReportId: completed.id,
                publicReportId: report.id,
                publicReportRevision: report.revisionNumber,
                pdfVersion: completed.pdfVersion,
                filename: completed.file?.filename,
                bytes: completed.file?.bytes,
                pageCount: completed.file?.pageCount,
                durationMs: completed.durationMs,
                snapshotChecksumPrefix: snapshotChecksum.slice(0, 8),
            },
        });

        return {
            success: true,
            reusedExisting: false,
            pdfReport: completed,
            downloadUrl: `/api/admin/pdf-reports/${completed.id}/download`,
        };
    } catch (error) {
        const code =
            error instanceof Error && error.message.startsWith("PDF_")
                ? error.message
                : "PDF_RENDER_FAILED";

        if (uploadedPublicId) {
            await deletePdfAsset(uploadedPublicId).catch(() => undefined);
        }

        await failPdfReportRecord(pdfRecord.id, {
            errorCode: code,
            errorMessage: safeErrorMessage(code),
            durationMs: Date.now() - renderStartedAt,
        });
        await updateWebsitePdfSummary(report.websiteId, "failed");
        await createActivityLog({
            websiteId: report.websiteId,
            type: "pdf-report-failed",
            actor: "system",
            metadata: {
                pdfReportId: pdfRecord.id,
                publicReportId: report.id,
                publicReportRevision: report.revisionNumber,
                pdfVersion: pdfRecord.pdfVersion,
                errorCode: code,
            },
        });

        return {
            success: false,
            error: { code, message: safeErrorMessage(code) },
        };
    }
}
