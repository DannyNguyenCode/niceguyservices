import { NextResponse } from "next/server";
import { createPublicReport } from "@/src/services/public-reports/create-public-report";
import type { PublicReportSettings } from "@/src/types/public-report";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// TODO: Require admin authentication before allowing report creation in production.
export async function POST(request: Request, context: RouteContext) {
    const { id: websiteId } = await context.params;

    try {
        const body = (await request.json()) as {
            crawlId: string;
            niceGuyMetricId: string;
            aiSummaryId: string;
            heroSuggestionIds?: string[];
            screenshotIds?: string[];
            title?: string;
            subtitle?: string;
            settings?: Partial<PublicReportSettings>;
        };

        const result = await createPublicReport({
            websiteId,
            crawlId: body.crawlId,
            niceGuyMetricId: body.niceGuyMetricId,
            aiSummaryId: body.aiSummaryId,
            heroSuggestionIds: body.heroSuggestionIds,
            screenshotIds: body.screenshotIds,
            title: body.title,
            subtitle: body.subtitle,
            settings: body.settings,
        });

        if (!result.success) {
            const status =
                result.error.code === "NOT_FOUND"
                    ? 404
                    : result.error.code === "SOURCE_MISMATCH" ||
                        result.error.code.startsWith("CRAWL") ||
                        result.error.code.startsWith("PAGE") ||
                        result.error.code.startsWith("NICEGUY") ||
                        result.error.code.startsWith("AI_")
                      ? 400
                      : 500;
            return NextResponse.json(result, { status });
        }

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Create public report API failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "CREATE_FAILED", message: "Unable to create report." },
            },
            { status: 500 },
        );
    }
}
