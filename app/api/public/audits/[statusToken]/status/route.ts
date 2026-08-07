import { NextResponse } from "next/server";
import { isRateLimitError } from "@/src/services/rate-limit/rate-limit-error";
import { enforcePublicAuditStatusRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import {
    getPublicAuditStatusByToken,
    PublicAuditStatusError,
} from "@/src/services/public-audit-status/get-public-audit-status";

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ statusToken: string }>;
};

/**
 * GET /api/public/audits/[statusToken]/status
 *
 * Customer-facing audit progress. Returns sanitized stage state only.
 * Does not mutate audit state. Does not expose Mongo IDs, emails, secrets,
 * package URLs, or stack traces.
 */
export async function GET(request: Request, context: RouteContext) {
    const { statusToken: rawToken } = await context.params;

    try {
        await enforcePublicAuditStatusRateLimit({ request, rawToken });
    } catch (error) {
        if (isRateLimitError(error)) {
            return NextResponse.json(
                { error: "Too many status requests. Please try again shortly." },
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
        const progress = await getPublicAuditStatusByToken(rawToken);
        return NextResponse.json({
            status: progress.status,
            currentStage: progress.currentStage,
            domain: progress.domain,
            stages: Object.fromEntries(
                progress.stages.map((stage) => [stage.id, stage.state]),
            ),
            stageDetails: progress.stages.map((stage) => ({
                id: stage.id,
                label: stage.label,
                description: stage.description,
                state: stage.state,
            })),
            message: progress.message,
            reportAvailable: progress.reportAvailable,
            useReportLookup: progress.useReportLookup,
            pdfReady: progress.pdfReady,
        });
    } catch (error) {
        if (error instanceof PublicAuditStatusError) {
            return NextResponse.json(
                { error: "Audit status not found." },
                { status: 404 },
            );
        }
        console.error("[public-audit-status] status lookup failed");
        return NextResponse.json(
            { error: "Unable to load audit status. Please try again." },
            { status: 500 },
        );
    }
}
