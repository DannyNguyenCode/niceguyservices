import { NextResponse } from "next/server";
import { getDemoGenerationById } from "@/src/data/demo-generations";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ generationId: string }> };

export async function GET(_request: Request, context: RouteContext) {
    const { generationId } = await context.params;
    const generation = await getDemoGenerationById(generationId);
    if (!generation) {
        return NextResponse.json(
            { success: false, error: { code: "DEMO_NOT_FOUND", message: "Generation not found." } },
            { status: 404 },
        );
    }
    return NextResponse.json({ success: true, generation });
}
