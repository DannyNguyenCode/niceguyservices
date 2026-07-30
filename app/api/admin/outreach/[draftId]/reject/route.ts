import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { getOutreachDraftById, rejectOutreachDraft } from "@/src/data/outreach-email-drafts";
import { updateWebsiteOutreachDraftSummary } from "@/src/data/websites";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ draftId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { draftId } = await context.params;
    const rejected = await rejectOutreachDraft(draftId);

    if (!rejected) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "OUTREACH_INVALID_STATUS", message: "Draft cannot be rejected." },
            },
            { status: 409 },
        );
    }

    await updateWebsiteOutreachDraftSummary(rejected.websiteId, "rejected", new Date());
    await createActivityLog({
        websiteId: rejected.websiteId,
        type: "outreach-draft-rejected",
        actor: "admin",
        metadata: { outreachDraftId: rejected.id },
    });

    return NextResponse.json({ success: true, draft: rejected });
}
