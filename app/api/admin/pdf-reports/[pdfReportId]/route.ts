import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { getPdfReportById, markPdfReportDeleted } from "@/src/data/pdf-reports";
import { deletePdfAsset } from "@/src/services/pdf-reports/delete-pdf-asset";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ pdfReportId: string }> };

// TODO: Require admin authentication before exposing PDF metadata in production.
export async function GET(_request: Request, context: RouteContext) {
    const { pdfReportId } = await context.params;
    const pdfReport = await getPdfReportById(pdfReportId);

    if (!pdfReport) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "PDF_REPORT_NOT_FOUND", message: "PDF report not found." },
            },
            { status: 404 },
        );
    }

    return NextResponse.json({
        success: true,
        pdfReport: {
            id: pdfReport.id,
            websiteId: pdfReport.websiteId,
            publicReportId: pdfReport.publicReportId,
            status: pdfReport.status,
            pdfVersion: pdfReport.pdfVersion,
            source: pdfReport.source,
            file: pdfReport.file
                ? {
                      filename: pdfReport.file.filename,
                      bytes: pdfReport.file.bytes,
                      pageCount: pdfReport.file.pageCount,
                      format: pdfReport.file.format,
                  }
                : null,
            generatedAt: pdfReport.generatedAt,
            durationMs: pdfReport.durationMs,
            errorCode: pdfReport.errorCode,
            errorMessage: pdfReport.errorMessage,
            downloadUrl: `/api/admin/pdf-reports/${pdfReport.id}/download`,
        },
    });
}

// TODO: Require admin authentication before allowing PDF deletion in production.
export async function DELETE(_request: Request, context: RouteContext) {
    const { pdfReportId } = await context.params;
    const pdfReport = await getPdfReportById(pdfReportId);

    if (!pdfReport) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "PDF_REPORT_NOT_FOUND", message: "PDF report not found." },
            },
            { status: 404 },
        );
    }

    if (pdfReport.status === "deleted") {
        return NextResponse.json({ success: true, message: "PDF asset already deleted." });
    }

    try {
        if (pdfReport.file?.publicId) {
            await deletePdfAsset(pdfReport.file.publicId);
        }
    } catch {
        return NextResponse.json(
            {
                success: false,
                error: { code: "PDF_ASSET_DELETE_FAILED", message: "Unable to delete PDF asset." },
            },
            { status: 500 },
        );
    }

    await markPdfReportDeleted(pdfReportId);
    await createActivityLog({
        websiteId: pdfReport.websiteId,
        type: "pdf-report-deleted",
        actor: "admin",
        metadata: {
            pdfReportId: pdfReport.id,
            publicReportId: pdfReport.publicReportId,
            publicReportRevision: pdfReport.source.publicReportRevision,
            pdfVersion: pdfReport.pdfVersion,
            filename: pdfReport.file?.filename,
        },
    });

    return NextResponse.json({ success: true, message: "PDF asset deleted." });
}
