import { NextResponse } from "next/server";
import { runNiceGuyAnalysis } from "@/src/services/run-niceguy-analysis";
import {
    guardAdministratorWriteRoute,
    resolveRouteAdministratorIdentity,
} from "@/src/services/rate-limit/admin-route-guards";
import { isTrustedInternalWorker } from "@/src/services/rate-limit/administrator-context";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
    const writeGuard = await guardAdministratorWriteRoute(request);
    if (writeGuard) {
        return writeGuard;
    }

    const { id } = await context.params;

    try {
        const result = await runNiceGuyAnalysis(id, {
            administratorIdentity: await resolveRouteAdministratorIdentity(request),
            internalWorker: isTrustedInternalWorker(request),
        });

        if (!result.success) {
            const status =
                result.error.code === "NOT_FOUND"
                    ? 404
                    : result.error.code === "DUPLICATE_RUN"
                      ? 409
                      : result.error.code === "CRAWL_REQUIRED" ||
                          result.error.code === "PAGESPEED_REQUIRED" ||
                          result.error.code === "CRAWL_HOMEPAGE_REQUIRED"
                        ? 400
                        : 500;

            return NextResponse.json(
                { success: false, error: result.error },
                { status },
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Nice Guy analysis API route failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "NICEGUY_ANALYSIS_ERROR",
                    message: "Unable to run Nice Guy analysis right now. Please try again.",
                },
            },
            { status: 500 },
        );
    }
}
