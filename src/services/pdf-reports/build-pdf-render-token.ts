import { createHmac } from "crypto";
import { PDF_RENDER_TOKEN_TTL_MS } from "@/src/services/pdf-reports/constants";
import { readPdfRenderSecret } from "@/src/services/pdf-reports/read-pdf-render-secret";
import type { PdfRenderTokenPayload } from "@/src/services/pdf-reports/types";

function signPayload(encodedPayload: string): string {
    return createHmac("sha256", readPdfRenderSecret())
        .update(encodedPayload)
        .digest("base64url");
}

export function buildPdfRenderToken(input: {
    publicReportId: string;
    pdfReportId: string;
    snapshotChecksum: string;
}): string {
    const payload: PdfRenderTokenPayload = {
        publicReportId: input.publicReportId,
        pdfReportId: input.pdfReportId,
        snapshotChecksum: input.snapshotChecksum,
        expiresAt: Date.now() + PDF_RENDER_TOKEN_TTL_MS,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = signPayload(encodedPayload);
    return `${encodedPayload}.${signature}`;
}
