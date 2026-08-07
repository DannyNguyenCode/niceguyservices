import "server-only";

import { getPdfReportById } from "@/src/data/pdf-reports";
import { getPublicReportById } from "@/src/data/public-reports";
import { validatePdfRenderToken } from "@/src/services/pdf-reports/validate-pdf-render-token";
import type { SerializablePublicReport } from "@/src/types/public-report";

export async function loadPdfPrintReport(input: {
    publicReportId: string;
    renderToken: string;
}): Promise<{ report: SerializablePublicReport } | null> {
    if (!input.renderToken?.trim()) {
        return null;
    }

    const parts = input.renderToken.split(".");
    if (parts.length !== 2) {
        return null;
    }

    let payload: {
        publicReportId: string;
        pdfReportId: string;
        snapshotChecksum: string;
        expiresAt: number;
    };

    try {
        payload = JSON.parse(
            Buffer.from(parts[0], "base64url").toString("utf8"),
        ) as typeof payload;
    } catch {
        return null;
    }

    if (payload.publicReportId !== input.publicReportId) {
        return null;
    }

    const pdfReport = await getPdfReportById(payload.pdfReportId);
    if (!pdfReport || pdfReport.status !== "processing") {
        return null;
    }

    const validated = validatePdfRenderToken(input.renderToken, {
        publicReportId: input.publicReportId,
        pdfReportId: payload.pdfReportId,
        snapshotChecksum: pdfReport.source.snapshotChecksum,
    });

    if (!validated) {
        return null;
    }

    const report = await getPublicReportById(input.publicReportId);
    if (!report) {
        return null;
    }

    if (pdfReport.source.snapshotChecksum !== validated.snapshotChecksum) {
        return null;
    }

    return { report };
}
