import { NextResponse } from "next/server";
import { getOutreachDraftById } from "@/src/data/outreach-email-drafts";
import { generateOutreachEmail } from "@/src/services/outreach/generate-outreach-email";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ draftId: string }> };

export async function POST(_request: Request, context: RouteContext) {
    const { draftId } = await context.params;
    const draft = await getOutreachDraftById(draftId);

    if (!draft) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "OUTREACH_NOT_FOUND", message: "Outreach draft not found." },
            },
            { status: 404 },
        );
    }

    const result = await generateOutreachEmail({
        publicReportId: draft.publicReportId,
        pdfReportId: draft.pdfReportId,
        recipient: draft.recipient,
        strategy: draft.strategy,
    });

    if (!result.success) {
        return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json({ success: true, draft: result.draft });
}
