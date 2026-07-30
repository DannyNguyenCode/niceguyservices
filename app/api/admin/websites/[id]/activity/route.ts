import { NextResponse } from "next/server";
import { getActivityLogForWebsite } from "@/src/data/activity-logs";
import { getWebsiteById } from "@/src/data/websites";
import {
    ACTIVITY_CATEGORIES,
    ACTIVITY_SEVERITIES,
} from "@/src/constants/activity-events";
import { activityQuerySchema, activityWebsiteIdSchema } from "@/src/validation/activity";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// TODO: Require admin authentication before exposing activity timeline in production.
export async function GET(request: Request, context: RouteContext) {
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

    const url = new URL(request.url);
    const parsed = activityQuerySchema.safeParse({
        limit: url.searchParams.get("limit") ?? undefined,
        before: url.searchParams.get("before") ?? undefined,
        category: url.searchParams.get("category") ?? undefined,
        severity: url.searchParams.get("severity") ?? undefined,
        eventType: url.searchParams.get("eventType") ?? undefined,
        errorsOnly: url.searchParams.get("errorsOnly") ?? undefined,
    });

    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "ACTIVITY_INVALID_FILTER", message: "Invalid activity filters." },
            },
            { status: 400 },
        );
    }

    const categories = (parsed.data.category ?? []).filter((value) =>
        ACTIVITY_CATEGORIES.includes(value as (typeof ACTIVITY_CATEGORIES)[number]),
    ) as (typeof ACTIVITY_CATEGORIES)[number][];
    const severities = (parsed.data.severity ?? []).filter((value) =>
        ACTIVITY_SEVERITIES.includes(value as (typeof ACTIVITY_SEVERITIES)[number]),
    ) as (typeof ACTIVITY_SEVERITIES)[number][];

    try {
        const result = await getActivityLogForWebsite({
            websiteId,
            limit: parsed.data.limit,
            before: parsed.data.before ? new Date(parsed.data.before) : null,
            categories: categories.length ? categories : undefined,
            severities: parsed.data.errorsOnly
                ? ["error"]
                : severities.length
                  ? severities
                  : undefined,
            eventTypes: parsed.data.eventType ? [parsed.data.eventType] : undefined,
        });

        return NextResponse.json({
            success: true,
            items: result.items,
            nextCursor: result.nextCursor,
            hasMore: result.hasMore,
        });
    } catch (error) {
        console.error("Activity timeline load failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "ACTIVITY_LOAD_FAILED", message: "Unable to load activity." },
            },
            { status: 500 },
        );
    }
}
