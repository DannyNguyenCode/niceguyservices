import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { rejectDemoAsset } from "@/src/data/demo-assets";
import { getDemoProjectById } from "@/src/data/demo-projects";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ assetId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { assetId } = await context.params;
    const asset = await rejectDemoAsset(assetId);
    if (!asset) {
        return NextResponse.json(
            { success: false, error: { code: "DEMO_NOT_FOUND", message: "Asset not found." } },
            { status: 404 },
        );
    }

    const project = await getDemoProjectById(asset.demoProjectId);
    if (project) {
        await createActivityLog({
            websiteId: project.websiteId,
            type: "demo-asset-rejected",
            description: "Demo asset rejected.",
            metadata: { demoAssetId: asset.id, demoProjectId: asset.demoProjectId },
        });
    }

    return NextResponse.json({ success: true, asset });
}
