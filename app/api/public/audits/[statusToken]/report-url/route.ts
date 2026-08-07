import { NextResponse } from "next/server";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { enforcePublicAuditStatusRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import {
    PublicAuditDeliverableError,
    resolvePublicAuditDeliverables,
} from "@/src/services/public-audit-status/resolve-public-audit-deliverables";

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ statusToken: string }>;
};

/**
 * GET /api/public/audits/[statusToken]/report-url
 *
 * Returns the published report path for THIS audit only.
 * Does not expose Mongo IDs, emails, Cloudinary URLs, or package secrets.
 */
export async function GET(request: Request, context: RouteContext) {
    const { statusToken: rawToken } = await context.params;

    try {
        await enforcePublicAuditStatusRateLimit({ request, rawToken });
    } catch (error) {
        if (isRateLimitError(error)) {
            return NextResponse.json(
                { error: "Too many requests. Please try again shortly." },
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
        return NextResponse.json({
            reportPath: deliverables.reportViewPath,
            pdfReady: Boolean(deliverables.pdfReport),
            maskedEmail: deliverables.maskedEmail,
        });
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
        console.error("[public-audit-deliverables] report-url failed");
        return NextResponse.json(
            { error: "Unable to open your report right now." },
            { status: 500 },
        );
    }
}
