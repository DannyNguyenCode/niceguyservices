import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { cancelDemoGeneration, getDemoGenerationById } from "@/src/data/demo-generations";

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

    const cancelled = await cancelDemoGeneration(generationId);
    await createActivityLog({
        websiteId: existing.websiteId,
        type: "demo-generation-cancelled",
        description: "Demo generation cancelled.",
        metadata: { demoGenerationId: generationId, demoProjectId: existing.demoProjectId },
    });

    return NextResponse.json({ success: true, generation: cancelled });
}
