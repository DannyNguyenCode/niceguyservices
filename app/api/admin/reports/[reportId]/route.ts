import { NextResponse } from "next/server";
import { updatePublicReport } from "@/src/services/public-reports/update-public-report";
import type { PublicReportSettings } from "@/src/types/public-report";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reportId: string }> };

// TODO: Require admin authentication before allowing report updates in production.
export async function PATCH(request: Request, context: RouteContext) {
    const { reportId } = await context.params;

    try {
        const body = (await request.json()) as {
            title?: string;
            subtitle?: string | null;
            settings?: Partial<PublicReportSettings>;
            expiresAt?: string | null;
        };

        const result = await updatePublicReport(reportId, body);
        if (!result.success) {
            const status =
                result.error.code === "NOT_FOUND"
                    ? 404
                    : result.error.code === "IMMUTABLE"
                      ? 409
                      : 400;
            return NextResponse.json(result, { status });
        }

        return NextResponse.json({ success: true, report: result.report });
    } catch (error) {
        console.error("Update public report API failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "UPDATE_FAILED", message: "Unable to update report." },
            },
            { status: 500 },
        );
    }
}
