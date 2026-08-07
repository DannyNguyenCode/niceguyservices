import { NextResponse } from "next/server";
import { generateDemoProject } from "@/src/services/demo/generate-demo-project";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ demoProjectId: string }> };

export async function POST(request: Request, context: RouteContext) {
    const { demoProjectId } = await context.params;

    let body: Record<string, unknown> = {};
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        body = {};
    }

    const result = await generateDemoProject({
        demoProjectId,
        forceRegenerate: Boolean(body.forceRegenerate),
    });

    if (!result.success) {
        const status =
            result.error.code === "DEMO_PROJECT_NOT_FOUND" ||
            result.error.code === "DEMO_WEBSITE_NOT_FOUND" ||
            result.error.code === "DEMO_REPORT_NOT_FOUND"
                ? 404
                : result.error.code === "DEMO_ALREADY_RUNNING" ||
                    result.error.code === "DEMO_SOURCE_CHECKSUM_MISMATCH" ||
                    result.error.code === "DEMO_SOURCE_INCOMPLETE"
                  ? 409
                  : 500;
        return NextResponse.json(result, { status });
    }

    return NextResponse.json({
        success: true,
        generation: result.generation,
        demoProjectId,
        status: result.generation.status,
        previewUrl: result.generation.output.previewUrl,
    });
}
