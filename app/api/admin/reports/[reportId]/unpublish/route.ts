import { NextResponse } from "next/server";
import { unpublishPublicReport } from "@/src/services/public-reports/unpublish-public-report";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reportId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { reportId } = await context.params;
    try {
        const result = await unpublishPublicReport(reportId);
        if (!result.success) {
            return NextResponse.json(result, {
                status: result.error.code === "NOT_FOUND" ? 404 : 400,
            });
        }
        return NextResponse.json(result);
    } catch (error) {
        console.error("Unpublish public report API failed:", error);
        return NextResponse.json(
            { success: false, error: { code: "UNPUBLISH_FAILED", message: "Unable to unpublish." } },
            { status: 500 },
        );
    }
}
