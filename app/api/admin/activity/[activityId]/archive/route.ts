import { NextResponse } from "next/server";
import { archiveAdministratorNote } from "@/src/data/activity-logs";
import { activityIdSchema } from "@/src/validation/activity";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ activityId: string }> };

export async function POST(_request: Request, context: RouteContext) {
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

    const archived = await archiveAdministratorNote(activityId);
    if (!archived) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "ACTIVITY_NOTE_NOT_ARCHIVABLE",
                    message: "Only administrator notes can be archived.",
                },
            },
            { status: 409 },
        );
    }

    return NextResponse.json({ success: true, item: archived });
}
