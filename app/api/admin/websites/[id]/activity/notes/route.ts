import { NextResponse } from "next/server";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import { getWebsiteById } from "@/src/data/websites";
import { ACTIVITY_EVENTS } from "@/src/constants/activity-events";
import { sanitizePlainText } from "@/src/services/activity/sanitize-activity-metadata";
import { activityNoteSchema, activityWebsiteIdSchema } from "@/src/validation/activity";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
    const { id: websiteId } = await context.params;

    if (!activityWebsiteIdSchema.safeParse(websiteId).success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "ACTIVITY_INVALID_WEBSITE_ID", message: "Invalid website ID." },
            },
            { status: 400 },
        );
    }

    const website = await getWebsiteById(websiteId);
    if (!website) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "ACTIVITY_WEBSITE_NOT_FOUND", message: "Website not found." },
            },
            { status: 404 },
        );
    }

    let body: Record<string, unknown> = {};
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        body = {};
    }

    const parsed = activityNoteSchema.safeParse(body);
    if (!parsed.success) {
        const issue = parsed.error.issues[0];
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: issue?.message.includes("Title")
                        ? "ACTIVITY_NOTE_TITLE_REQUIRED"
                        : "ACTIVITY_NOTE_DESCRIPTION_TOO_LONG",
                    message: issue?.message ?? "Invalid note.",
                },
            },
            { status: 400 },
        );
    }

    const created = await createActivityEvent({
        websiteId,
        eventType: ACTIVITY_EVENTS.ADMINISTRATOR_NOTE_ADDED,
        category: "administrator",
        severity: "info",
        title: sanitizePlainText(parsed.data.title, 120),
        description: sanitizePlainText(parsed.data.description, 2000),
        actor: { type: "administrator", name: "Administrator" },
    });

    if (!created) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "ACTIVITY_SAVE_FAILED", message: "Unable to save note." },
            },
            { status: 500 },
        );
    }

    return NextResponse.json({ success: true, item: created });
}
