import { NextResponse } from "next/server";
import { getWebsiteById } from "@/src/data/websites";
import {
    StartAuditJobError,
    startAuditOrchestration,
} from "@/src/services/audit-pipeline/start-audit-job";
import {
    guardAdministratorReadRoute,
    guardAdministratorWriteRoute,
    resolveRouteAdministratorIdentity,
} from "@/src/services/rate-limit/admin-route-guards";
import { handleRouteRateLimitError } from "@/src/services/rate-limit/handle-route-rate-limit-error";
import { AuditHistoryError } from "@/src/services/audit-history/create-audit-run";
import { getAuditRunsForWebsite } from "@/src/data/audit-runs";
import {
    auditCreateBodySchema,
    auditListQuerySchema,
    auditWebsiteIdSchema,
} from "@/src/validation/audit-history";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
    const readGuard = await guardAdministratorReadRoute(request);
    if (readGuard) {
        return readGuard;
    }

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
    const parsed = auditListQuerySchema.safeParse({
        limit: url.searchParams.get("limit") ?? undefined,
        before: url.searchParams.get("before") ?? undefined,
        status: url.searchParams.get("status") ?? undefined,
        includeArchived: url.searchParams.get("includeArchived") ?? undefined,
    });

    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_INVALID_LIMIT", message: "Invalid query parameters." },
            },
            { status: 400 },
        );
    }

    try {
        const result = await getAuditRunsForWebsite({
            websiteId,
            limit: parsed.data.limit,
            before: parsed.data.before ? { id: parsed.data.before } : null,
            statuses: parsed.data.status ? [parsed.data.status] : undefined,
            includeArchived: parsed.data.includeArchived,
        });

        return NextResponse.json({
            success: true,
            items: result.items,
            hasMore: result.hasMore,
            nextCursor: result.nextCursor,
        });
    } catch (error) {
        console.error("Audit history list failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_LOAD_FAILED", message: "Unable to load audit history." },
            },
            { status: 500 },
        );
    }
}

export async function POST(request: Request, context: RouteContext) {
    const writeGuard = await guardAdministratorWriteRoute(request);
    if (writeGuard) {
        return writeGuard;
    }

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

    let body: unknown = {};
    try {
        body = await request.json();
    } catch {
        body = {};
    }

    const parsed = auditCreateBodySchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_INVALID_STATUS", message: "Invalid audit configuration." },
            },
            { status: 400 },
        );
    }

    const identity = await resolveRouteAdministratorIdentity(request);

    try {
        const started = await startAuditOrchestration({
            websiteId,
            configuration: parsed.data.configuration,
            trigger: {
                type: parsed.data.trigger?.type ?? "administrator",
                actorId: parsed.data.trigger?.actorId ?? identity,
                actorName: parsed.data.trigger?.actorName ?? null,
            },
        });

        return NextResponse.json(
            {
                jobId: started.job.id,
                auditRunId: started.auditRunId,
                websiteId: started.websiteId,
                status: started.job.status,
                reused: started.reused,
                statusUrl: started.statusUrl,
            },
            { status: started.reused ? 200 : 202 },
        );
    } catch (error) {
        const rateLimitResponse = await handleRouteRateLimitError(error, {
            policyId: "audit-start",
            websiteId,
        });
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        if (error instanceof StartAuditJobError || error instanceof AuditHistoryError) {
            return NextResponse.json(
                { success: false, error: { code: error.code, message: error.message } },
                {
                    status:
                        error.code === "AUDIT_HISTORY_DUPLICATE_ACTIVE_RUN" ||
                        error.code === "AUDIT_PREFLIGHT_URL_INVALID"
                            ? 409
                            : 400,
                },
            );
        }

        console.error("Audit creation failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_SAVE_FAILED", message: "Unable to start audit." },
            },
            { status: 500 },
        );
    }
}
