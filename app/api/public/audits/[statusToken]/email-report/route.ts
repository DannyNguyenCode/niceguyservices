import { NextResponse } from "next/server";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { enforcePublicAuditReportEmailRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import {
    PublicAuditDeliverableError,
    resolvePublicAuditDeliverables,
} from "@/src/services/public-audit-status/resolve-public-audit-deliverables";
import { sendPublicAuditReportEmail } from "@/src/services/public-audit-status/send-public-audit-report-email";
import {
    TransactionalEmailNotConfiguredError,
    TransactionalEmailSendError,
} from "@/src/services/email/send-transactional-email";

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ statusToken: string }>;
};

/**
 * POST /api/public/audits/[statusToken]/email-report
 *
 * Sends the published report link to the website business email on file.
 * Destination is never client-supplied. Rate-limited to prevent spam.
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
        const result = await sendPublicAuditReportEmail(deliverables);
        return NextResponse.json({
            success: true,
            maskedEmail: result.maskedEmail,
            message: `Sent to ${result.maskedEmail}`,
        });
    } catch (error) {
        if (error instanceof PublicAuditDeliverableError) {
            const status =
                error.code === "INVALID_TOKEN" || error.code === "NOT_FOUND"
                    ? 404
                    : error.code === "NOT_READY" || error.code === "REPORT_MISSING"
                      ? 409
                      : 400;
            return NextResponse.json({ error: error.message, code: error.code }, { status });
        }
        if (
            error instanceof TransactionalEmailNotConfiguredError ||
            error instanceof TransactionalEmailSendError
        ) {
            return NextResponse.json(
                {
                    error: "Unable to send email right now. Please try again later.",
                    code: "EMAIL_SEND_FAILED",
                },
                { status: 503 },
            );
        }
        console.error("[public-audit-deliverables] email-report failed");
        return NextResponse.json(
            { error: "Unable to send email right now.", code: "EMAIL_SEND_FAILED" },
            { status: 500 },
        );
    }
}
