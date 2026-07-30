import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { archiveDemoProject } from "@/src/data/demo-projects";
import { updateWebsiteDemoProjectSummary } from "@/src/data/websites";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ demoProjectId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { demoProjectId } = await context.params;
    const archived = await archiveDemoProject(demoProjectId);

    if (!archived) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "DEMO_INVALID_STATUS", message: "Demo cannot be archived." },
            },
            { status: 409 },
        );
    }

    await updateWebsiteDemoProjectSummary(archived.websiteId, "rejected", new Date());
    await createActivityLog({
        websiteId: archived.websiteId,
        type: "demo-archived",
        description: "Demo project archived.",
        metadata: { demoProjectId: archived.id },
    });

    return NextResponse.json({ success: true, project: archived });
}
