export const PDF_REPORT_VERSION = "pdf-report-v1";

export const PDF_RENDER_ENGINE = "react-pdf";

export const PDF_PAPER_FORMAT = "Letter";

export const PDF_MAX_BYTES = 25 * 1024 * 1024;

export const PDF_RENDER_TOKEN_TTL_MS = 5 * 60 * 1000;

export const PDF_DEFAULT_MARGINS = {
    top: "0.55in",
    right: "0.5in",
    bottom: "0.55in",
    left: "0.5in",
} as const;
