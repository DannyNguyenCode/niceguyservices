import { NextResponse } from "next/server";
import { archiveAuditRun } from "@/src/data/audit-runs";
import { AuditRunDataError } from "@/src/data/audit-runs";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import { auditRunIdSchema } from "@/src/validation/audit-history";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ auditRunId: string }> };

// TODO: Require admin authentication before exposing audit history in production.
export async function POST(_request: Request, context: RouteContext) {
    const { auditRunId } = await context.params;

    if (!auditRunIdSchema.safeParse(auditRunId).success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_INVALID_AUDIT_ID", message: "Invalid audit run ID." },
            },
            { status: 400 },
        );
    }

    try {
        const archived = await archiveAuditRun(auditRunId);
        if (!archived) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: "AUDIT_HISTORY_AUDIT_NOT_FOUND", message: "Audit run not found." },
                },
                { status: 404 },
            );
        }

        await createActivityEvent({
            websiteId: archived.websiteId,
            auditRunId: archived.id,
            eventType: "audit-run-archived",
            title: `Audit ${archived.auditNumber} archived`,
            description: `Audit run ${archived.auditNumber} was archived.`,
            actor: { type: "administrator" },
            metadata: {
                auditRunId: archived.id,
                auditNumber: archived.auditNumber,
                status: archived.status,
            },
        });

        return NextResponse.json({ success: true, auditRun: archived });
    } catch (error) {
        if (error instanceof AuditRunDataError) {
            return NextResponse.json(
                { success: false, error: { code: error.code, message: error.message } },
                { status: 400 },
            );
        }
        console.error("Audit archive failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_SAVE_FAILED", message: "Unable to archive audit run." },
            },
            { status: 500 },
        );
    }
}
