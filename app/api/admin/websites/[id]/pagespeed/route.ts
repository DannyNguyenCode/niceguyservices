import { NextResponse } from "next/server";
import { runPageSpeedAnalysis } from "@/src/services/run-pagespeed-analysis";
import {
    guardAdministratorWriteRoute,
    resolveRouteAdministratorIdentity,
} from "@/src/services/rate-limit/admin-route-guards";
import { handleRouteRateLimitError } from "@/src/services/rate-limit/handle-route-rate-limit-error";
import { isTrustedInternalWorker } from "@/src/services/rate-limit/administrator-context";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300;

type RouteContext = {
    params: Promise<{ id: string }>;
};

// TODO: Require admin authentication before allowing PageSpeed triggers in production.
export async function POST(request: Request, context: RouteContext) {
    const writeGuard = await guardAdministratorWriteRoute(request);
    if (writeGuard) {
        return writeGuard;
    }

    const { id } = await context.params;

    try {
        const result = await runPageSpeedAnalysis(id, {
            administratorIdentity: await resolveRouteAdministratorIdentity(request),
            internalWorker: isTrustedInternalWorker(request),
        });

        if (!result.success) {
            const status =
                result.error.code === "NOT_FOUND"
                    ? 404
                    : result.error.code === "DUPLICATE_RUN"
                      ? 409
                      : result.error.code === "CRAWL_REQUIRED"
                        ? 400
                        : result.error.code === "PAGESPEED_CONFIGURATION_ERROR"
                          ? 503
                          : 500;

            return NextResponse.json(
                { success: false, error: result.error },
                { status },
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        const rateLimitResponse = await handleRouteRateLimitError(error, {
            policyId: "pagespeed-run",
            websiteId: id,
        });
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        console.error("PageSpeed API route failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "PAGESPEED_API_ERROR",
                    message: "Unable to run PageSpeed right now. Please try again.",
                },
            },
            { status: 500 },
        );
    }
}
