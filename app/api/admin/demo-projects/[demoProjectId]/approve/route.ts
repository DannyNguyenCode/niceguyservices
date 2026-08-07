import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { approveDemoProject } from "@/src/data/demo-projects";
import { updateWebsiteDemoProjectSummary } from "@/src/data/websites";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ demoProjectId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { demoProjectId } = await context.params;
    const approved = await approveDemoProject(demoProjectId);

    if (!approved) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "DEMO_INVALID_STATUS", message: "Demo cannot be approved." },
            },
            { status: 409 },
        );
    }

    await updateWebsiteDemoProjectSummary(approved.websiteId, "approved", new Date());
    await createActivityLog({
        websiteId: approved.websiteId,
        type: "demo-approved",
        description:
            "Administrator approved the generated demo. This does not authorize production deployment or client approval.",
        metadata: {
            demoProjectId: approved.id,
            publicReportId: approved.publicReportId,
            publicReportRevision: approved.source.publicReportRevision,
        },
    });

    return NextResponse.json({ success: true, project: approved });
}
