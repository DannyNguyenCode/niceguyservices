import "server-only";

import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import { AuditReportDocument } from "@/components/audit-report-pdf/AuditReportDocument";
import { getPublicReportById } from "@/src/data/public-reports";
import { buildAuditPdfViewModel } from "@/src/services/pdf-reports/build-pdf-view-model";
import { PDF_RENDER_ENGINE } from "@/src/services/pdf-reports/constants";
import {
    createPdfAttemptId,
    describePdfEnvironment,
    logPdfError,
    logPdfEvent,
    logPdfStage,
    sanitizeErrorMessage,
} from "@/src/services/pdf-reports/pdf-diagnostics";
import { PdfStageError } from "@/src/services/pdf-reports/pdf-stage-error";
import { getPdfMaxRetries } from "@/src/services/pdf-reports/env";

export async function renderReportPdf(input: {
    publicReportId: string;
    pdfReportId: string;
    snapshotChecksum: string;
    attemptId?: string;
}): Promise<{
    buffer: Buffer;
    bytes: number;
    pageCount: number | null;
    engine: string;
    engineVersion: string | null;
    durationMs: number;
    attemptId: string;
}> {
    const attemptId = input.attemptId ?? createPdfAttemptId();
    const startedAt = Date.now();
    const envInfo = describePdfEnvironment();

    logPdfEvent(attemptId, "render_starting", {
        ...envInfo,
        engine: PDF_RENDER_ENGINE,
        pdfReportIdPrefix: input.pdfReportId.slice(0, 8),
        snapshotChecksumPrefix: input.snapshotChecksum.slice(0, 8),
    });

    const maxAttempts = getPdfMaxRetries() + 1;
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
            logPdfStage(attemptId, "DATA_LOAD", {
                attempt: attempt + 1,
                maxAttempts,
            });

            const report = await getPublicReportById(input.publicReportId);
            if (!report) {
                throw new PdfStageError("PDF_DATA_LOAD_FAILED", "DATA_LOAD", {
                    message: "Public report not found while building PDF view model.",
                });
            }

            let model;
            try {
                model = await buildAuditPdfViewModel({ report, attemptId });
            } catch (error) {
                if (error instanceof PdfStageError) throw error;
                throw new PdfStageError("PDF_DATA_INVALID", "DATA_LOAD", {
                    cause: error,
                    message: sanitizeErrorMessage(
                        error instanceof Error ? error.message : "Invalid PDF source data",
                    ),
                });
            }

            logPdfStage(attemptId, "REACT_PDF_RENDER", {
                hasDesktopScreenshot: Boolean(model.desktopScreenshot),
                hasMobileScreenshot: Boolean(model.mobileScreenshot),
                hasHomepageChanges: Boolean(model.homepageChanges),
            });

            let pdfBytes: Buffer;
            try {
                const document = createElement(AuditReportDocument, {
                    model,
                }) as ReactElement<DocumentProps>;
                const rendered = await renderToBuffer(document);
                pdfBytes = Buffer.isBuffer(rendered)
                    ? rendered
                    : Buffer.from(rendered);
            } catch (renderError) {
                logPdfError(attemptId, "react_pdf_render_failed", {
                    errorName: renderError instanceof Error ? renderError.name : "Error",
                    message: sanitizeErrorMessage(
                        renderError instanceof Error
                            ? renderError.message
                            : String(renderError),
                    ),
                });
                throw new PdfStageError("PDF_REACT_RENDER_FAILED", "REACT_PDF_RENDER", {
                    cause: renderError,
                });
            }

            if (!pdfBytes.length || pdfBytes.subarray(0, 5).toString() !== "%PDF-") {
                throw new PdfStageError("PDF_BUFFER_RENDER_FAILED", "REACT_PDF_RENDER");
            }

            logPdfEvent(attemptId, "pdf_buffer_rendered", {
                bytes: pdfBytes.length,
                durationMs: Date.now() - startedAt,
                engine: PDF_RENDER_ENGINE,
            });

            return {
                buffer: pdfBytes,
                bytes: pdfBytes.length,
                pageCount: null,
                engine: PDF_RENDER_ENGINE,
                engineVersion: PDF_RENDER_ENGINE,
                durationMs: Date.now() - startedAt,
                attemptId,
            };
        } catch (error) {
            lastError = error;
            logPdfError(attemptId, "render_attempt_failed", {
                attempt: attempt + 1,
                code: error instanceof PdfStageError ? error.code : "UNKNOWN",
                stage: error instanceof PdfStageError ? error.stage : "REACT_PDF_RENDER",
                errorName: error instanceof Error ? error.name : "Error",
                message: sanitizeErrorMessage(
                    error instanceof Error ? error.message : String(error),
                ),
            });

            // Do not retry configuration/data validation failures.
            if (
                error instanceof PdfStageError &&
                (error.code === "PDF_DATA_LOAD_FAILED" ||
                    error.code === "PDF_DATA_INVALID" ||
                    error.code === "PDF_REPORT_NOT_FOUND")
            ) {
                throw error;
            }
        }
    }

    if (lastError instanceof PdfStageError) {
        throw lastError;
    }

    throw new PdfStageError("PDF_RENDER_FAILED", "REACT_PDF_RENDER", { cause: lastError });
}
