import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { approveOutreachDraft } from "@/src/data/outreach-email-drafts";
import { updateWebsiteOutreachDraftSummary } from "@/src/data/websites";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ draftId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { draftId } = await context.params;
    const approved = await approveOutreachDraft(draftId);

    if (!approved) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "OUTREACH_INVALID_STATUS", message: "Draft cannot be approved." },
            },
            { status: 409 },
        );
    }

    await updateWebsiteOutreachDraftSummary(approved.websiteId, "approved", new Date());
    await createActivityLog({
        websiteId: approved.websiteId,
        type: "outreach-draft-approved",
        actor: "admin",
        metadata: {
            outreachDraftId: approved.id,
            publicReportId: approved.publicReportId,
            publicReportRevision: approved.source.publicReportRevision,
        },
    });

    return NextResponse.json({ success: true, draft: approved });
}
