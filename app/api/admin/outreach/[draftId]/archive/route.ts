import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { archiveOutreachDraft } from "@/src/data/outreach-email-drafts";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ draftId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { draftId } = await context.params;
    const archived = await archiveOutreachDraft(draftId);

    if (!archived) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "OUTREACH_INVALID_STATUS", message: "Draft cannot be archived." },
            },
            { status: 409 },
        );
    }

    await createActivityLog({
        websiteId: archived.websiteId,
        type: "outreach-draft-archived",
        actor: "admin",
        metadata: { outreachDraftId: archived.id },
    });

    return NextResponse.json({ success: true, draft: archived });
}
