import { NextResponse } from "next/server";
import { archivePublicReport } from "@/src/services/public-reports/archive-public-report";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reportId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { reportId } = await context.params;
    try {
        const result = await archivePublicReport(reportId);
        if (!result.success) {
            return NextResponse.json(result, { status: 404 });
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error("Archive public report API failed:", error);
        return NextResponse.json(
            { success: false, error: { code: "ARCHIVE_FAILED", message: "Unable to archive." } },
            { status: 500 },
        );
    }
}
