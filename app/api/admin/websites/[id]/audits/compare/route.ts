import { NextResponse } from "next/server";
import { getAuditRunsForComparison } from "@/src/data/audit-runs";
import { getWebsiteById } from "@/src/data/websites";
import { compareAuditRuns } from "@/src/services/audit-history/compare-audit-runs";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import {
    auditCompareQuerySchema,
    auditWebsiteIdSchema,
} from "@/src/validation/audit-history";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

// TODO: Require admin authentication before exposing audit history in production.
export async function GET(request: Request, context: RouteContext) {
    const { id: websiteId } = await context.params;

    if (!auditWebsiteIdSchema.safeParse(websiteId).success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_INVALID_WEBSITE_ID", message: "Invalid website ID." },
            },
            { status: 400 },
        );
    }

    const website = await getWebsiteById(websiteId);
    if (!website) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_WEBSITE_NOT_FOUND", message: "Website not found." },
            },
            { status: 404 },
        );
    }

    const url = new URL(request.url);
    const parsed = auditCompareQuerySchema.safeParse({
        auditRunId: url.searchParams.getAll("auditRunId"),
        from: url.searchParams.get("from") ?? undefined,
        to: url.searchParams.get("to") ?? undefined,
    });

    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "AUDIT_HISTORY_INVALID_COMPARISON",
                    message: "Exactly two audit runs are required for comparison.",
                },
            },
            { status: 400 },
        );
    }

    try {
        const runs = await getAuditRunsForComparison({
            websiteId,
            auditRunIds: parsed.data.auditRunIds,
        });

        if (runs.length !== 2) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: "AUDIT_HISTORY_INVALID_COMPARISON",
                        message: "One or both audit runs were not found.",
                    },
                },
                { status: 404 },
            );
        }

        const [first, second] = runs;
        const fromRun = first.auditNumber <= second.auditNumber ? first : second;
        const toRun = first.auditNumber <= second.auditNumber ? second : first;
        const comparison = compareAuditRuns(fromRun, toRun);

        await createActivityEvent({
            websiteId,
            auditRunId: toRun.id,
            eventType: "audit-comparison-opened",
            title: `Compared audit ${fromRun.auditNumber} to audit ${toRun.auditNumber}`,
            description: "Audit comparison viewed.",
            actor: { type: "administrator" },
            metadata: {
                fromAuditRunId: fromRun.id,
                toAuditRunId: toRun.id,
                fromAuditNumber: fromRun.auditNumber,
                toAuditNumber: toRun.auditNumber,
            },
        });

        return NextResponse.json({ success: true, comparison });
    } catch (error) {
        console.error("Audit comparison failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_LOAD_FAILED", message: "Unable to compare audits." },
            },
            { status: 500 },
        );
    }
}
