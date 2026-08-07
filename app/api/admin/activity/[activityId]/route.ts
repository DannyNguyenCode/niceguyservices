import { NextResponse } from "next/server";
import { updateAdministratorNote } from "@/src/data/activity-logs";
import { sanitizePlainText } from "@/src/services/activity/sanitize-activity-metadata";
import { activityIdSchema, activityNoteUpdateSchema } from "@/src/validation/activity";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ activityId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
    const { activityId } = await context.params;

    if (!activityIdSchema.safeParse(activityId).success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "ACTIVITY_INVALID_ACTIVITY_ID", message: "Invalid activity ID." },
            },
            { status: 400 },
        );
    }

    let body: Record<string, unknown> = {};
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        body = {};
    }

    const parsed = activityNoteUpdateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "ACTIVITY_NOTE_TOO_LONG", message: "Invalid note content." },
            },
            { status: 400 },
        );
    }

    const updated = await updateAdministratorNote(activityId, {
        title: sanitizePlainText(parsed.data.title, 120),
        description: sanitizePlainText(parsed.data.description, 2000),
    });

    if (!updated) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "ACTIVITY_NOTE_NOT_EDITABLE",
                    message: "Only administrator notes can be edited.",
                },
            },
            { status: 409 },
        );
    }

    return NextResponse.json({ success: true, item: updated });
}
