import { NextResponse } from "next/server";
import {
    getAuditJobById,
    retryFailedAuditJob,
} from "@/src/data/audit-jobs";
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

    if (existing.status !== "failed") {
        return NextResponse.json(
            {
                error: {
                    code: "AUDIT_JOB_NOT_RETRYABLE",
                    message: "Only failed audit jobs can be retried.",
                },
            },
            { status: 409 },
        );
    }

    const reset = await retryFailedAuditJob(jobId);
    if (!reset) {
        return NextResponse.json(
            { error: { code: "AUDIT_JOB_RETRY_FAILED", message: "Unable to retry audit job." } },
            { status: 500 },
        );
    }

    return NextResponse.json({
        jobId: reset.id,
        status: reset.status,
        statusUrl: `/api/admin/audit-jobs/${jobId}`,
    });
}
