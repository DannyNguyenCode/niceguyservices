import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { getPdfReportById } from "@/src/data/pdf-reports";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ pdfReportId: string }> };

// TODO: Require admin authentication before allowing PDF downloads in production.
export async function GET(_request: Request, context: RouteContext) {
    const { pdfReportId } = await context.params;
    const pdfReport = await getPdfReportById(pdfReportId);

    if (!pdfReport || pdfReport.status !== "complete" || !pdfReport.file?.secureUrl) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "PDF_REPORT_NOT_FOUND", message: "PDF is not available for download." },
            },
            { status: 404 },
        );
    }

    const filename = pdfReport.file.filename || "website-audit.pdf";
    const secureUrl = pdfReport.file.secureUrl;

    await createActivityLog({
        websiteId: pdfReport.websiteId,
        type: "pdf-report-downloaded",
        actor: "admin",
        metadata: {
            pdfReportId: pdfReport.id,
            publicReportId: pdfReport.publicReportId,
            publicReportRevision: pdfReport.source.publicReportRevision,
            filename,
            bytes: pdfReport.file.bytes,
        },
    });

    const response = NextResponse.redirect(secureUrl, 302);
    response.headers.set(
        "Content-Disposition",
        `attachment; filename="${filename.replace(/"/g, "")}"`,
    );
    return response;
}
