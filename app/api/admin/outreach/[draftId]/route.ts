import { NextResponse } from "next/server";
import { createActivityLog } from "@/src/data/activity-logs";
import { getOutreachDraftById, updateOutreachDraftContent } from "@/src/data/outreach-email-drafts";
import { validateRecipientEmail } from "@/src/services/outreach/recipient-validation";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ draftId: string }> };

// TODO: Require admin authentication before exposing outreach drafts in production.
export async function GET(_request: Request, context: RouteContext) {
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

    return NextResponse.json({ success: true, draft });
}

export async function PATCH(request: Request, context: RouteContext) {
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

    if (draft.status !== "draft") {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "OUTREACH_INVALID_STATUS",
                    message: "Only draft outreach emails can be edited.",
                },
            },
            { status: 409 },
        );
    }

    const body = (await request.json()) as {
        subject?: string;
        bodyText?: string;
        recipient?: {
            name?: string | null;
            role?: string | null;
            email?: string | null;
        };
    };

    if (body.recipient?.email && !validateRecipientEmail(body.recipient.email)) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "OUTREACH_SCHEMA_VALIDATION_FAILED", message: "Invalid email address." },
            },
            { status: 400 },
        );
    }

    const updated = await updateOutreachDraftContent(draftId, {
        subject: body.subject ?? draft.subject,
        bodyText: body.bodyText ?? draft.bodyText,
        recipient: body.recipient
            ? {
                  ...draft.recipient,
                  ...body.recipient,
              }
            : draft.recipient,
    });

    if (!updated) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "OUTREACH_SAVE_FAILED", message: "Unable to save outreach draft." },
            },
            { status: 500 },
        );
    }

    await createActivityLog({
        websiteId: updated.websiteId,
        type: "outreach-draft-edited",
        actor: "admin",
        metadata: {
            outreachDraftId: updated.id,
            publicReportId: updated.publicReportId,
            publicReportRevision: updated.source.publicReportRevision,
        },
    });

    return NextResponse.json({ success: true, draft: updated });
}
