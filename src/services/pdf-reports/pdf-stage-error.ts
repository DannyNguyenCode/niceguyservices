/** Pipeline stages used for PDF generation diagnostics. */
export const PDF_STAGES = [
    "INITIALIZATION",
    "DATABASE",
    "PDF_CONFIGURATION",
    "DATA_LOAD",
    "REACT_PDF_RENDER",
    "PDF_RENDER",
    "STORAGE",
    "DATABASE_FINALIZATION",
    // Legacy browser-PDF stages retained for historical failed records / log compatibility.
    "CHROMIUM_LAUNCH",
    "BROWSER_CONTEXT",
    "PRINT_NAVIGATION",
    "PRINT_ROUTE_HTTP",
    "REPORT_READY",
] as const;

export type PdfStage = (typeof PDF_STAGES)[number];

export type PdfErrorCode =
    | "PDF_INVALID_REPORT_ID"
    | "PDF_REPORT_NOT_FOUND"
    | "PDF_WEBSITE_NOT_FOUND"
    | "PDF_SOURCE_REPORT_INVALID"
    | "PDF_SNAPSHOT_INCOMPLETE"
    | "PDF_ALREADY_RUNNING"
    | "PDF_CONFIGURATION_MISSING"
    | "PDF_STORAGE_NOT_CONFIGURED"
    | "PDF_DATA_LOAD_FAILED"
    | "PDF_DATA_INVALID"
    | "PDF_IMAGE_LOAD_FAILED"
    | "PDF_REACT_RENDER_FAILED"
    | "PDF_BUFFER_RENDER_FAILED"
    | "PDF_INVALID_BUFFER"
    | "PDF_FILE_TOO_LARGE"
    | "PDF_STORAGE_FAILED"
    | "PDF_UPLOAD_FAILED"
    | "PDF_SAVE_FAILED"
    | "PDF_DATABASE_FINALIZATION_FAILED"
    | "PDF_RENDER_TIMEOUT"
    | "PDF_RENDER_FAILED"
    // Legacy browser-PDF codes retained for historical records / classify compatibility.
    | "PDF_CHROMIUM_LAUNCH_FAILED"
    | "PDF_BROWSER_CONTEXT_FAILED"
    | "PDF_PRINT_NAVIGATION_FAILED"
    | "PDF_PRINT_ROUTE_UNAUTHORIZED"
    | "PDF_VERCEL_PROTECTION_BLOCKED"
    | "PDF_PRINT_ROUTE_NOT_FOUND"
    | "PDF_PRINT_ROUTE_SERVER_ERROR"
    | "PDF_REPORT_READY_TIMEOUT"
    | "PDF_BROWSER_LAUNCH_FAILED"
    | "PDF_RENDER_ROUTE_FAILED";

const STAGE_BY_CODE: Partial<Record<PdfErrorCode, PdfStage>> = {
    PDF_CONFIGURATION_MISSING: "PDF_CONFIGURATION",
    PDF_STORAGE_NOT_CONFIGURED: "PDF_CONFIGURATION",
    PDF_DATA_LOAD_FAILED: "DATA_LOAD",
    PDF_DATA_INVALID: "DATA_LOAD",
    PDF_IMAGE_LOAD_FAILED: "REACT_PDF_RENDER",
    PDF_REACT_RENDER_FAILED: "REACT_PDF_RENDER",
    PDF_BUFFER_RENDER_FAILED: "REACT_PDF_RENDER",
    PDF_INVALID_BUFFER: "REACT_PDF_RENDER",
    PDF_RENDER_TIMEOUT: "REACT_PDF_RENDER",
    PDF_FILE_TOO_LARGE: "STORAGE",
    PDF_STORAGE_FAILED: "STORAGE",
    PDF_UPLOAD_FAILED: "STORAGE",
    PDF_SAVE_FAILED: "DATABASE_FINALIZATION",
    PDF_DATABASE_FINALIZATION_FAILED: "DATABASE_FINALIZATION",
    PDF_RENDER_FAILED: "PDF_RENDER",
    PDF_CHROMIUM_LAUNCH_FAILED: "CHROMIUM_LAUNCH",
    PDF_BROWSER_LAUNCH_FAILED: "CHROMIUM_LAUNCH",
    PDF_BROWSER_CONTEXT_FAILED: "BROWSER_CONTEXT",
    PDF_PRINT_NAVIGATION_FAILED: "PRINT_NAVIGATION",
    PDF_PRINT_ROUTE_UNAUTHORIZED: "PRINT_ROUTE_HTTP",
    PDF_VERCEL_PROTECTION_BLOCKED: "PRINT_ROUTE_HTTP",
    PDF_PRINT_ROUTE_NOT_FOUND: "PRINT_ROUTE_HTTP",
    PDF_PRINT_ROUTE_SERVER_ERROR: "PRINT_ROUTE_HTTP",
    PDF_RENDER_ROUTE_FAILED: "PRINT_ROUTE_HTTP",
    PDF_REPORT_READY_TIMEOUT: "REPORT_READY",
};

const ADMIN_MESSAGES: Record<PdfErrorCode, string> = {
    PDF_INVALID_REPORT_ID: "Invalid report ID.",
    PDF_REPORT_NOT_FOUND: "Public report not found.",
    PDF_WEBSITE_NOT_FOUND: "Website not found.",
    PDF_SOURCE_REPORT_INVALID: "Public report cannot be used for PDF generation.",
    PDF_SNAPSHOT_INCOMPLETE: "Public report snapshot is incomplete.",
    PDF_ALREADY_RUNNING: "PDF generation is already running for this report.",
    PDF_CONFIGURATION_MISSING: "PDF renderer configuration is missing.",
    PDF_STORAGE_NOT_CONFIGURED: "PDF storage configuration is missing.",
    PDF_DATA_LOAD_FAILED: "Unable to load report data for PDF generation.",
    PDF_DATA_INVALID: "Report data is invalid for PDF generation.",
    PDF_IMAGE_LOAD_FAILED: "One or more report images could not be loaded.",
    PDF_REACT_RENDER_FAILED: "React PDF document rendering failed.",
    PDF_BUFFER_RENDER_FAILED: "PDF buffer rendering failed.",
    PDF_INVALID_BUFFER: "Generated PDF was invalid.",
    PDF_FILE_TOO_LARGE: "Generated PDF exceeded the maximum file size.",
    PDF_STORAGE_FAILED: "PDF storage upload failed.",
    PDF_UPLOAD_FAILED: "PDF upload failed.",
    PDF_SAVE_FAILED: "Unable to save PDF metadata.",
    PDF_DATABASE_FINALIZATION_FAILED: "Unable to finalize PDF database record.",
    PDF_RENDER_TIMEOUT: "PDF rendering timed out.",
    PDF_RENDER_FAILED: "PDF rendering failed.",
    PDF_CHROMIUM_LAUNCH_FAILED: "PDF browser could not be launched.",
    PDF_BROWSER_LAUNCH_FAILED: "PDF browser could not be launched.",
    PDF_BROWSER_CONTEXT_FAILED: "PDF browser context could not be created.",
    PDF_PRINT_NAVIGATION_FAILED: "Unable to open the internal PDF rendering page.",
    PDF_PRINT_ROUTE_UNAUTHORIZED: "Unable to access the internal PDF rendering page.",
    PDF_VERCEL_PROTECTION_BLOCKED:
        "Internal PDF page blocked by deployment protection. Check Preview automation bypass configuration.",
    PDF_PRINT_ROUTE_NOT_FOUND: "Internal PDF rendering page was not found.",
    PDF_PRINT_ROUTE_SERVER_ERROR: "Internal PDF rendering page returned a server error.",
    PDF_REPORT_READY_TIMEOUT: "PDF report content did not become ready in time.",
    PDF_RENDER_ROUTE_FAILED: "Unable to access the internal PDF rendering page.",
};

export class PdfStageError extends Error {
    readonly code: PdfErrorCode;
    readonly stage: PdfStage;
    readonly causeName: string | null;

    constructor(
        code: PdfErrorCode,
        stage: PdfStage = STAGE_BY_CODE[code] ?? "PDF_RENDER",
        options?: { cause?: unknown; message?: string },
    ) {
        super(options?.message ?? ADMIN_MESSAGES[code] ?? "Unable to generate PDF.");
        this.name = "PdfStageError";
        this.code = code;
        this.stage = stage;
        this.causeName =
            options?.cause instanceof Error
                ? options.cause.name
                : options?.cause
                  ? "Error"
                  : null;
    }
}

export function isPdfErrorCode(value: string): value is PdfErrorCode {
    return Object.prototype.hasOwnProperty.call(ADMIN_MESSAGES, value);
}

export function resolvePdfStageForCode(code: string): PdfStage {
    if (isPdfErrorCode(code) && STAGE_BY_CODE[code]) {
        return STAGE_BY_CODE[code]!;
    }
    return "PDF_RENDER";
}

export function getPdfAdminErrorMessage(code: string): string {
    if (isPdfErrorCode(code)) {
        return ADMIN_MESSAGES[code];
    }
    return "Unable to generate PDF.";
}

export function classifyPrintHttpStatus(status: number): PdfErrorCode {
    if (status === 401 || status === 403) {
        return "PDF_PRINT_ROUTE_UNAUTHORIZED";
    }
    if (status === 404) {
        return "PDF_PRINT_ROUTE_NOT_FOUND";
    }
    if (status >= 500) {
        return "PDF_PRINT_ROUTE_SERVER_ERROR";
    }
    return "PDF_PRINT_NAVIGATION_FAILED";
}

/**
 * Preserve stage-specific PDF codes; only fall back to PDF_RENDER_FAILED when unknown.
 */
export function classifyPdfFailure(error: unknown): {
    code: PdfErrorCode;
    stage: PdfStage;
    message: string;
    causeName: string | null;
} {
    if (error instanceof PdfStageError) {
        return {
            code: error.code,
            stage: error.stage,
            message: getPdfAdminErrorMessage(error.code),
            causeName: error.causeName,
        };
    }

    if (error instanceof Error && isPdfErrorCode(error.message)) {
        return {
            code: error.message,
            stage: resolvePdfStageForCode(error.message),
            message: getPdfAdminErrorMessage(error.message),
            causeName: error.name,
        };
    }

    return {
        code: "PDF_RENDER_FAILED",
        stage: "PDF_RENDER",
        message: getPdfAdminErrorMessage("PDF_RENDER_FAILED"),
        causeName: error instanceof Error ? error.name : null,
    };
}
