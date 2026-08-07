import { NextResponse } from "next/server";
import { rotatePublicReportToken } from "@/src/services/public-reports/rotate-public-report-token";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reportId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { reportId } = await context.params;
    try {
        const result = await rotatePublicReportToken(reportId);
        if (!result.success) {
            return NextResponse.json(result, {
                status: result.error.code === "NOT_FOUND" ? 404 : 400,
            });
        }
        return NextResponse.json({
            success: true,
            reportId: result.reportId,
            publicUrl: result.publicUrl,
            tokenPrefix: result.tokenPrefix,
            message: result.message,
        });
    } catch (error) {
        console.error("Rotate public report token API failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "ROTATE_FAILED", message: "Unable to rotate token." },
            },
            { status: 500 },
        );
    }
}
