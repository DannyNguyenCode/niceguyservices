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
import {
    createPdfAttemptId,
    describePdfEnvironment,
    logPdfError,
    logPdfEvent,
    logPdfStage,
} from "@/src/services/pdf-reports/pdf-diagnostics";
import {
    PdfStageError,
    classifyPdfFailure,
    getPdfAdminErrorMessage,
    type PdfStage,
} from "@/src/services/pdf-reports/pdf-stage-error";
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
          attemptId?: string;
      }
    | {
          success: false;
          error: { code: string; message: string; stage: PdfStage };
          attemptId?: string;
      };

function mapReadinessBlocker(code: string | undefined): {
    code: string;
    stage: PdfStage;
    message: string;
} {
    if (code === "ALREADY_RUNNING") {
        return {
            code: "PDF_ALREADY_RUNNING",
            stage: "INITIALIZATION",
            message: getPdfAdminErrorMessage("PDF_ALREADY_RUNNING"),
        };
    }
    if (code === "SNAPSHOT_INCOMPLETE") {
        return {
            code: "PDF_SNAPSHOT_INCOMPLETE",
            stage: "INITIALIZATION",
            message: getPdfAdminErrorMessage("PDF_SNAPSHOT_INCOMPLETE"),
        };
    }
    if (code === "RENDERER_NOT_CONFIGURED") {
        return {
            code: "PDF_CONFIGURATION_MISSING",
            stage: "PDF_CONFIGURATION",
            message: getPdfAdminErrorMessage("PDF_CONFIGURATION_MISSING"),
        };
    }
    if (code === "STORAGE_NOT_CONFIGURED") {
        return {
            code: "PDF_STORAGE_NOT_CONFIGURED",
            stage: "PDF_CONFIGURATION",
            message: getPdfAdminErrorMessage("PDF_STORAGE_NOT_CONFIGURED"),
        };
    }
    return {
        code: "PDF_SOURCE_REPORT_INVALID",
        stage: "INITIALIZATION",
        message: getPdfAdminErrorMessage("PDF_SOURCE_REPORT_INVALID"),
    };
}

export async function generatePdfReport(
    input: {
        publicReportId: string;
        forceRegenerate?: boolean;
        allowArchived?: boolean;
    } & RateLimitedServiceOptions,
): Promise<GeneratePdfReportResult> {
    const attemptId = createPdfAttemptId();
    logPdfEvent(attemptId, "request_received", {
        ...describePdfEnvironment(),
        forceRegenerate: Boolean(input.forceRegenerate),
    });

    if (!input.publicReportId?.trim()) {
        return {
            success: false,
            attemptId,
            error: {
                code: "PDF_INVALID_REPORT_ID",
                message: getPdfAdminErrorMessage("PDF_INVALID_REPORT_ID"),
                stage: "INITIALIZATION",
            },
        };
    }

    logPdfStage(attemptId, "DATABASE", { phase: "load_report" });
    const report = await getPublicReportById(input.publicReportId);
    if (!report) {
        return {
            success: false,
            attemptId,
            error: {
                code: "PDF_REPORT_NOT_FOUND",
                message: getPdfAdminErrorMessage("PDF_REPORT_NOT_FOUND"),
                stage: "DATABASE",
            },
        };
    }

    const website = await getWebsiteById(report.websiteId);
    if (!website || website.deletedAt) {
        return {
            success: false,
            attemptId,
            error: {
                code: "PDF_WEBSITE_NOT_FOUND",
                message: getPdfAdminErrorMessage("PDF_WEBSITE_NOT_FOUND"),
                stage: "DATABASE",
            },
        };
    }

    const snapshotChecksum = calculateSnapshotChecksum(report);
    const activeGeneration = await hasActivePdfGeneration(report.id);
    const matching = await getMatchingCompletedPdfReport({
        publicReportId: report.id,
        snapshotChecksum,
    });

    logPdfStage(attemptId, "PDF_CONFIGURATION", { phase: "readiness" });
    const readiness = getPdfReadiness({
        report,
        websiteActive: !website.deletedAt,
        hasActiveGeneration: activeGeneration,
        matchingPdfId: matching?.id ?? null,
        allowArchived: input.allowArchived,
    });

    if (!readiness.canGenerate) {
        const blocker = readiness.blockers[0];
        const mapped = mapReadinessBlocker(blocker?.code);
        logPdfError(attemptId, "readiness_blocked", {
            blockerCode: blocker?.code ?? null,
            code: mapped.code,
            stage: mapped.stage,
        });
        return {
            success: false,
            attemptId,
            error: {
                code: mapped.code,
                message: blocker?.message ?? mapped.message,
                stage: mapped.stage,
            },
        };
    }

    if (matching && !input.forceRegenerate) {
        logPdfEvent(attemptId, "reused_existing_pdf", {
            pdfReportIdPrefix: matching.id.slice(0, 8),
        });
        return {
            success: true,
            reusedExisting: true,
            pdfReport: matching,
            downloadUrl: `/api/admin/pdf-reports/${matching.id}/download`,
            attemptId,
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

    logPdfStage(attemptId, "DATABASE", { phase: "create_pdf_record" });
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
            pdfAttemptId: attemptId,
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
                pdfAttemptId: attemptId,
            },
        });

        const rendered = await renderReportPdf({
            publicReportId: report.id,
            pdfReportId: pdfRecord.id,
            snapshotChecksum,
            attemptId,
        });

        logPdfStage(attemptId, "STORAGE", { bytes: rendered.bytes });
        const uploaded = await uploadReportPdf({
            buffer: rendered.buffer,
            websiteId: report.websiteId,
            revisionNumber: report.revisionNumber,
            pdfReportId: pdfRecord.id,
            filename,
        });
        uploadedPublicId = uploaded.publicId;
        logPdfEvent(attemptId, "storage_uploaded", {
            bytes: uploaded.bytes,
            provider: uploaded.provider,
        });

        logPdfStage(attemptId, "DATABASE_FINALIZATION");
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
            throw new PdfStageError("PDF_SAVE_FAILED", "DATABASE_FINALIZATION");
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
                pdfAttemptId: attemptId,
            },
        });

        logPdfEvent(attemptId, "completed", {
            durationMs: Date.now() - renderStartedAt,
            bytes: completed.file?.bytes ?? null,
        });

        return {
            success: true,
            reusedExisting: false,
            pdfReport: completed,
            downloadUrl: `/api/admin/pdf-reports/${completed.id}/download`,
            attemptId,
        };
    } catch (error) {
        const classified = classifyPdfFailure(error);

        logPdfError(attemptId, "generation_failed", {
            code: classified.code,
            stage: classified.stage,
            causeName: classified.causeName,
            message: classified.message,
        });

        if (uploadedPublicId) {
            await deletePdfAsset(uploadedPublicId).catch(() => undefined);
        }

        await failPdfReportRecord(pdfRecord.id, {
            errorCode: classified.code,
            errorMessage: classified.message,
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
                errorCode: classified.code,
                failedStage: classified.stage,
                pdfAttemptId: attemptId,
            },
        });

        return {
            success: false,
            attemptId,
            error: {
                code: classified.code,
                message: classified.message,
                stage: classified.stage,
            },
        };
    }
}
