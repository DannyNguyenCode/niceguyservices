import { NextResponse } from "next/server";
import { finalizeAuditRun } from "@/src/services/audit-history/finalize-audit-run";
import { AuditFinalizationError } from "@/src/services/audit-history/finalize-audit-run";
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
        const auditRun = await finalizeAuditRun({ auditRunId });
        return NextResponse.json({ success: true, auditRun });
    } catch (error) {
        if (error instanceof AuditFinalizationError) {
            return NextResponse.json(
                { success: false, error: { code: error.code, message: error.message } },
                { status: 400 },
            );
        }
        console.error("Audit finalization failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "AUDIT_HISTORY_FINALIZATION_FAILED",
                    message: "Unable to finalize audit run.",
                },
            },
            { status: 500 },
        );
    }
}
