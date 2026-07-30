import { NextResponse } from "next/server";
import { createDemoProjectSchema } from "@/src/services/demo/schemas";
import { createDemoProjectFromReport } from "@/src/services/demo/create-demo-project";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ reportId: string }> };

// TODO: Require admin authentication before allowing demo project creation in production.
export async function POST(request: Request, context: RouteContext) {
    const { reportId } = await context.params;

    let body: Record<string, unknown> = {};
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        body = {};
    }

    const parsed = createDemoProjectSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "DEMO_SCHEMA_VALIDATION_FAILED", message: "Invalid demo project input." },
            },
            { status: 400 },
        );
    }

    try {
        const result = await createDemoProjectFromReport({
            publicReportId: reportId,
            ...parsed.data,
        });

        if (!result.success) {
            const status =
                result.error.code === "DEMO_REPORT_NOT_FOUND" ||
                result.error.code === "DEMO_WEBSITE_NOT_FOUND"
                    ? 404
                    : 409;
            return NextResponse.json(result, { status });
        }

        return NextResponse.json({
            success: true,
            demoProjectId: result.project.id,
            project: result.project,
            previewToken: result.previewToken,
            previewPath: result.project.previewPath,
        });
    } catch (error) {
        console.error("Create demo project API failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "DEMO_SAVE_FAILED", message: "Unable to create demo project." },
            },
            { status: 500 },
        );
    }
}
