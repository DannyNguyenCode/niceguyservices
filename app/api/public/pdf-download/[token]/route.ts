import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { getPdfReportById } from "@/src/data/pdf-reports";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { enforcePublicPdfDownloadRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import { verifyPublicPdfEmailDownloadToken } from "@/src/services/public-audit-status/pdf-email-download-token";

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ token: string }>;
};

/**
 * GET /api/public/pdf-download/[token]
 *
 * Signed, time-limited PDF download for completion emails.
 * Does not accept client-supplied report IDs.
 */
export async function GET(request: Request, context: RouteContext) {
    const { token: rawToken } = await context.params;
    const verified = verifyPublicPdfEmailDownloadToken(decodeURIComponent(rawToken));
    if (!verified.ok) {
        return NextResponse.json(
            {
                error:
                    verified.code === "EXPIRED"
                        ? "This download link has expired. Request your audit again from the website."
                        : "This download link is invalid.",
            },
            { status: verified.code === "EXPIRED" ? 410 : 404 },
        );
    }

    try {
        await enforcePublicPdfDownloadRateLimit({
            request,
            resourceKey: verified.payload.pdfReportId,
        });
    } catch (error) {
        if (isRateLimitError(error)) {
            return NextResponse.json(
                { error: "Too many download requests. Please try again shortly." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(error.retryAfterSeconds ?? 60),
                    },
                },
            );
        }
        throw error;
    }

    const pdfReport = await getPdfReportById(verified.payload.pdfReportId);
    if (
        !pdfReport ||
        pdfReport.status !== "complete" ||
        !pdfReport.file?.secureUrl ||
        pdfReport.websiteId !== verified.payload.websiteId ||
        pdfReport.publicReportId !== verified.payload.publicReportId
    ) {
        return NextResponse.json(
            { error: "PDF is not available for download." },
            { status: 404 },
        );
    }

    const filename = pdfReport.file.filename || "website-audit.pdf";

    await createActivityLog({
        websiteId: pdfReport.websiteId,
        type: "pdf-report-downloaded",
        actor: "system",
        metadata: {
            pdfReportId: pdfReport.id,
            publicReportId: pdfReport.publicReportId,
            publicReportRevision: pdfReport.source.publicReportRevision,
            filename,
            bytes: pdfReport.file.bytes,
            trigger: "email_download_link",
        },
    });

    const response = NextResponse.redirect(pdfReport.file.secureUrl, 302);
    response.headers.set(
        "Content-Disposition",
        `attachment; filename="${filename.replace(/"/g, "")}"`,
    );
    return response;
}
