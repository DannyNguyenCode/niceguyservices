import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { rejectDemoProject } from "@/src/data/demo-projects";
import { updateWebsiteDemoProjectSummary } from "@/src/data/websites";
import { demoRejectionSchema } from "@/src/services/demo/schemas";

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

    const parsed = demoRejectionSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "DEMO_SCHEMA_VALIDATION_FAILED", message: "Invalid rejection payload." },
            },
            { status: 400 },
        );
    }

    const rejected = await rejectDemoProject(demoProjectId, parsed.data);
    if (!rejected) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "DEMO_INVALID_STATUS", message: "Demo cannot be rejected." },
            },
            { status: 409 },
        );
    }

    await updateWebsiteDemoProjectSummary(rejected.websiteId, "rejected", new Date());
    await createActivityLog({
        websiteId: rejected.websiteId,
        type: "demo-rejected",
        description: "Demo rejected by administrator.",
        metadata: {
            demoProjectId: rejected.id,
            reason: parsed.data.reason,
        },
    });

    return NextResponse.json({ success: true, project: rejected });
}
