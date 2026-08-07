import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import {
    enforcePublicAuditStatusRateLimit,
    enforcePublicPdfDownloadRateLimit,
} from "@/src/services/rate-limit/enforce-public-rate-limit";
import {
    PublicAuditDeliverableError,
    resolvePublicAuditDeliverables,
} from "@/src/services/public-audit-status/resolve-public-audit-deliverables";

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ statusToken: string }>;
};

/**
 * GET /api/public/audits/[statusToken]/pdf
 *
 * Redirects to the completed PDF for THIS audit only.
 * Requires a valid status token + published report + completed PDF.
 * Does not return Cloudinary credentials in JSON; uses a short-lived redirect.
 */
export async function GET(request: Request, context: RouteContext) {
    const { statusToken: rawToken } = await context.params;

    try {
        await enforcePublicAuditStatusRateLimit({ request, rawToken });
        await enforcePublicPdfDownloadRateLimit({
            request,
            resourceKey: rawToken,
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

    try {
        const deliverables = await resolvePublicAuditDeliverables(rawToken);
        const pdfReport = deliverables.pdfReport;
        if (!pdfReport || pdfReport.status !== "complete" || !pdfReport.file?.secureUrl) {
            throw new PublicAuditDeliverableError(
                "PDF_NOT_READY",
                "Your PDF is not ready yet. You can still view the web report.",
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
                trigger: "public_status_token",
            },
        });

        console.info("[public-audit-deliverables] PDF_DOWNLOAD_REDIRECT", {
            websiteId: pdfReport.websiteId,
            auditRunId: deliverables.tokenRecord.auditRunId,
            pdfReportId: pdfReport.id,
        });

        const response = NextResponse.redirect(pdfReport.file.secureUrl, 302);
        response.headers.set(
            "Content-Disposition",
            `attachment; filename="${filename.replace(/"/g, "")}"`,
        );
        return response;
    } catch (error) {
        if (error instanceof PublicAuditDeliverableError) {
            const status =
                error.code === "INVALID_TOKEN" || error.code === "NOT_FOUND"
                    ? 404
                    : error.code === "PDF_NOT_READY" || error.code === "NOT_READY"
                      ? 409
                      : 400;
            return NextResponse.json({ error: error.message, code: error.code }, { status });
        }
        console.error("[public-audit-deliverables] pdf download failed");
        return NextResponse.json(
            { error: "Unable to download your PDF right now." },
            { status: 500 },
        );
    }
}
