import { NextResponse } from "next/server";
import { cancelAuditJob, getAuditJobById } from "@/src/data/audit-jobs";
import { updateAuditRunStatus } from "@/src/data/audit-runs";
import { createActivityEvent } from "@/src/services/activity/create-activity-event";
import { guardAdministratorWriteRoute } from "@/src/services/rate-limit/admin-route-guards";
import { auditRunIdSchema } from "@/src/validation/audit-history";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ jobId: string }> };

export async function POST(request: Request, context: RouteContext) {
    const writeGuard = await guardAdministratorWriteRoute(request);
    if (writeGuard) {
        return writeGuard;
    }

    const { jobId } = await context.params;
    if (!auditRunIdSchema.safeParse(jobId).success) {
        return NextResponse.json(
            { error: { code: "AUDIT_JOB_INVALID_ID", message: "Invalid audit job ID." } },
            { status: 400 },
        );
    }

    const existing = await getAuditJobById(jobId);
    if (!existing) {
        return NextResponse.json(
            { error: { code: "AUDIT_JOB_NOT_FOUND", message: "Audit job not found." } },
            { status: 404 },
        );
    }

    const job = await cancelAuditJob(jobId);
    if (job) {
        await updateAuditRunStatus(job.auditRunId, "cancelled");
        await createActivityEvent({
            websiteId: job.websiteId,
            auditRunId: job.auditRunId,
            eventType: "audit-run-cancelled",
            title: "Audit cancelled",
            description: "An administrator cancelled the audit job.",
            actor: { type: "administrator" },
            metadata: { jobId: job.id },
        });
    }

    return NextResponse.json({
        jobId: job?.id ?? jobId,
        status: job?.status ?? "cancelled",
    });
}
