import { NextResponse } from "next/server";
import { getAuditJobById } from "@/src/data/audit-jobs";
import { guardAdministratorReadRoute } from "@/src/services/rate-limit/admin-route-guards";
import { auditRunIdSchema } from "@/src/validation/audit-history";

export const dynamic = "force-dynamic";

const jobIdSchema = auditRunIdSchema;

type RouteContext = { params: Promise<{ jobId: string }> };

export async function GET(request: Request, context: RouteContext) {
    const readGuard = await guardAdministratorReadRoute(request);
    if (readGuard) {
        return readGuard;
    }

    const { jobId } = await context.params;
    if (!jobIdSchema.safeParse(jobId).success) {
        return NextResponse.json(
            { error: { code: "AUDIT_JOB_INVALID_ID", message: "Invalid audit job ID." } },
            { status: 400 },
        );
    }

    const job = await getAuditJobById(jobId);
    if (!job) {
        return NextResponse.json(
            { error: { code: "AUDIT_JOB_NOT_FOUND", message: "Audit job not found." } },
            { status: 404 },
        );
    }

    return NextResponse.json({
        jobId: job.id,
        auditRunId: job.auditRunId,
        websiteId: job.websiteId,
        status: job.status,
        currentStage: job.currentStage,
        progressPercent: job.progressPercent,
        updatedAt: job.updatedAt,
        stages: Object.entries(job.stages).map(([name, stage]) => ({
            name,
            status: stage.status,
            attempt: stage.attempt,
            message: stage.errorMessage ?? undefined,
        })),
        reportDraftId: job.reportDraftId ?? undefined,
        error: job.error ?? undefined,
    });
}
