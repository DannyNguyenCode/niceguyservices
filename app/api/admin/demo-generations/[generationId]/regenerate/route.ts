import { NextResponse } from "next/server";
import { getDemoGenerationById } from "@/src/data/demo-generations";
import { generateDemoProject } from "@/src/services/demo/generate-demo-project";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ generationId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { generationId } = await context.params;
    const existing = await getDemoGenerationById(generationId);
    if (!existing) {
        return NextResponse.json(
            { success: false, error: { code: "DEMO_NOT_FOUND", message: "Generation not found." } },
            { status: 404 },
        );
    }

    const result = await generateDemoProject({
        demoProjectId: existing.demoProjectId,
        forceRegenerate: true,
    });

    if (!result.success) {
        return NextResponse.json(result, { status: 409 });
    }

    return NextResponse.json({ success: true, generation: result.generation });
}
