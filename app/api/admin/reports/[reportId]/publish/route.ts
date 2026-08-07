import { NextResponse } from "next/server";
import { publishPublicReport } from "@/src/services/public-reports/publish-public-report";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reportId: string }> };

// TODO: Require admin authentication before allowing report publishing in production.
export async function POST(_request: Request, context: RouteContext) {
    const { reportId } = await context.params;

    try {
        const result = await publishPublicReport(reportId);
        if (!result.success) {
            const status =
                result.error.code === "NOT_FOUND"
                    ? 404
                    : result.error.code === "INVALID_STATUS" ||
                        result.error.code === "REPORT_EXPIRED" ||
                        result.error.code === "WEBSITE_INACTIVE"
                      ? 400
                      : 500;
            return NextResponse.json(result, { status });
        }

        return NextResponse.json({
            success: true,
            reportId: result.reportId,
            publicUrl: result.publicUrl,
            tokenPrefix: result.tokenPrefix,
            revisionNumber: result.revisionNumber,
            message: result.message,
        });
    } catch (error) {
        console.error("Publish public report API failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "PUBLISH_FAILED", message: "Unable to publish report." },
            },
            { status: 500 },
        );
    }
}
