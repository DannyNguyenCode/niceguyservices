import { NextResponse } from "next/server";
import { generatePdfReport } from "@/src/services/pdf-reports/generate-pdf-report";
import {
    guardAdministratorWriteRoute,
    resolveRouteAdministratorIdentity,
} from "@/src/services/rate-limit/admin-route-guards";
import { handleRouteRateLimitError } from "@/src/services/rate-limit/handle-route-rate-limit-error";
import { isTrustedInternalWorker } from "@/src/services/rate-limit/administrator-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ reportId: string }> };

// TODO: Require admin authentication before allowing PDF generation in production.
export async function POST(request: Request, context: RouteContext) {
    const writeGuard = await guardAdministratorWriteRoute(request);
    if (writeGuard) {
        return writeGuard;
    }

    const { reportId } = await context.params;

    let body: { forceRegenerate?: boolean; allowArchived?: boolean } = {};
    try {
        body = (await request.json()) as typeof body;
    } catch {
        body = {};
    }

    try {
        const result = await generatePdfReport({
            publicReportId: reportId,
            forceRegenerate: Boolean(body.forceRegenerate),
            allowArchived: Boolean(body.allowArchived),
            administratorIdentity: await resolveRouteAdministratorIdentity(request),
            internalWorker: isTrustedInternalWorker(request),
        });

        if (!result.success) {
            const status =
                result.error.code === "PDF_REPORT_NOT_FOUND" ||
                result.error.code === "PDF_WEBSITE_NOT_FOUND"
                    ? 404
                    : result.error.code === "PDF_ALREADY_RUNNING" ||
                        result.error.code === "PDF_SOURCE_REPORT_INVALID" ||
                        result.error.code === "PDF_SNAPSHOT_INCOMPLETE"
                      ? 409
                      : 500;

            return NextResponse.json(result, { status });
        }

        return NextResponse.json({
            success: true,
            reusedExisting: result.reusedExisting,
            pdfReportId: result.pdfReport.id,
            status: result.pdfReport.status,
            filename: result.pdfReport.file?.filename ?? null,
            secureUrl: result.pdfReport.file?.secureUrl,
            downloadUrl: result.downloadUrl,
        });
    } catch (error) {
        const rateLimitResponse = await handleRouteRateLimitError(error, {
            policyId: "pdf-generate",
        });
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        console.error("Generate PDF report API failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "PDF_RENDER_FAILED", message: "Unable to generate PDF." },
            },
            { status: 500 },
        );
    }
}
