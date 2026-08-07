import { NextResponse } from "next/server";
import { restoreAuditRun, AuditRunDataError } from "@/src/data/audit-runs";
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
        const restored = await restoreAuditRun(auditRunId);
        if (!restored) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: "AUDIT_HISTORY_AUDIT_NOT_FOUND", message: "Audit run not found." },
                },
                { status: 404 },
            );
        }

        await createActivityEvent({
            websiteId: restored.websiteId,
            auditRunId: restored.id,
            eventType: "audit-run-restored",
            title: `Audit ${restored.auditNumber} restored`,
            description: `Audit run ${restored.auditNumber} was restored from archive.`,
            actor: { type: "administrator" },
            metadata: {
                auditRunId: restored.id,
                auditNumber: restored.auditNumber,
                status: restored.status,
            },
        });

        return NextResponse.json({ success: true, auditRun: restored });
    } catch (error) {
        if (error instanceof AuditRunDataError) {
            return NextResponse.json(
                { success: false, error: { code: error.code, message: error.message } },
                { status: 400 },
            );
        }
        console.error("Audit restore failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_SAVE_FAILED", message: "Unable to restore audit run." },
            },
            { status: 500 },
        );
    }
}
