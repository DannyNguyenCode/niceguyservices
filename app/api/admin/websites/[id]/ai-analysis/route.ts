import { NextResponse } from "next/server";
import { runAiAnalysis } from "@/src/services/run-ai-analysis";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type RouteContext = {
    params: Promise<{ id: string }>;
};

// TODO: Require admin authentication before allowing AI analysis in production.
export async function POST(_request: Request, context: RouteContext) {
    const { id } = await context.params;

    try {
        const result = await runAiAnalysis(id);

        if (!result.success) {
            const status =
                result.error.code === "NOT_FOUND"
                    ? 404
                    : result.error.code === "AI_ANALYSIS_ALREADY_RUNNING" ||
                        result.error.code === "DUPLICATE_RUN"
                      ? 409
                      : result.error.code === "CRAWL_REQUIRED" ||
                          result.error.code === "PAGESPEED_REQUIRED" ||
                          result.error.code === "NICEGUY_REQUIRED" ||
                          result.error.code === "CRAWL_HOMEPAGE_REQUIRED" ||
                          result.error.code === "NICEGUY_STALE" ||
                          result.error.code === "AI_CONFIGURATION_ERROR"
                        ? 400
                        : 500;

            return NextResponse.json(
                { success: false, error: result.error },
                { status },
            );
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("AI analysis API route failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "AI_PROVIDER_ERROR",
                    message: "Unable to run AI analysis right now. Please try again.",
                },
            },
            { status: 500 },
        );
    }
}
