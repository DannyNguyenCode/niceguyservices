import { NextResponse } from "next/server";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { enforcePublicAuditReportEmailRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import {
    PublicAuditDeliverableError,
    resolvePublicAuditDeliverables,
} from "@/src/services/public-audit-status/resolve-public-audit-deliverables";
import { sendPublicAuditPdfReadyEmail } from "@/src/services/public-audit-status/send-public-audit-report-email";

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ statusToken: string }>;
};

/**
 * POST /api/public/audits/[statusToken]/email-report
 *
 * Resend path for the automatic PDF-ready email (rate-limited).
 * Destination is never client-supplied.
 */
export async function POST(request: Request, context: RouteContext) {
    const { statusToken: rawToken } = await context.params;

    try {
        await enforcePublicAuditReportEmailRateLimit({ request, rawToken });
    } catch (error) {
        if (isRateLimitError(error)) {
            return NextResponse.json(
                {
                    error: "Please wait before requesting another email.",
                    code: "RATE_LIMITED",
                    retryAfterSeconds: error.retryAfterSeconds ?? 60,
                },
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
        if (!deliverables.pdfReport) {
            throw new PublicAuditDeliverableError(
                "PDF_NOT_READY",
                "Your PDF is not ready yet.",
            );
        }

        const result = await sendPublicAuditPdfReadyEmail({
            websiteId: deliverables.tokenRecord.websiteId,
            auditRunId: deliverables.tokenRecord.auditRunId,
            publicReportId: deliverables.report.id,
            pdfReportId: deliverables.pdfReport.id,
            normalizedDomain: deliverables.tokenRecord.normalizedDomain,
        });

        if (result.sent) {
            return NextResponse.json({
                success: true,
                maskedEmail: result.maskedEmail,
                message: `Sent to ${result.maskedEmail}`,
            });
        }

        if (result.reason === "ALREADY_SENT") {
            return NextResponse.json({
                success: true,
                maskedEmail: deliverables.maskedEmail,
                message: `Already sent to ${deliverables.maskedEmail}`,
            });
        }

        return NextResponse.json(
            {
                error: "Unable to send email right now. Please try again later.",
                code: "EMAIL_SEND_FAILED",
            },
            { status: 503 },
        );
    } catch (error) {
        if (error instanceof PublicAuditDeliverableError) {
            const status =
                error.code === "INVALID_TOKEN" || error.code === "NOT_FOUND"
                    ? 404
                    : error.code === "NOT_READY" ||
                        error.code === "REPORT_MISSING" ||
                        error.code === "PDF_NOT_READY"
                      ? 409
                      : 400;
            return NextResponse.json({ error: error.message, code: error.code }, { status });
        }
        console.error("[public-audit-deliverables] email-report failed");
        return NextResponse.json(
            { error: "Unable to send email right now.", code: "EMAIL_SEND_FAILED" },
            { status: 500 },
        );
    }
}
