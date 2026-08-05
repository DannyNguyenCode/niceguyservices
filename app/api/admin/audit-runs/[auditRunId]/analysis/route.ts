import { NextResponse } from "next/server";
import { getAuditRunAnalysis } from "@/src/data/audit-run-analysis";
import { getAuditRunById } from "@/src/data/audit-runs";
import {
    guardAdministratorReadRoute,
    guardAdministratorWriteRoute,
    resolveRouteAdministratorIdentity,
} from "@/src/services/rate-limit/admin-route-guards";
import { isAnalysisProviderEnabled } from "@/src/services/cursor-analysis/config";
import { requestCursorAnalysisForAuditRun } from "@/src/services/cursor-analysis/request-cursor-analysis";
import { enforceAdministratorActionRateLimit } from "@/src/services/rate-limit/enforce-action-rate-limit";
import { handleRouteRateLimitError } from "@/src/services/rate-limit/handle-route-rate-limit-error";

export const dynamic = "force-dynamic";

type RouteContext = {
    params: Promise<{ auditRunId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
    const readGuard = await guardAdministratorReadRoute(request);
    if (readGuard) return readGuard;

    const { auditRunId } = await context.params;
    const auditRun = await getAuditRunById(auditRunId);
    if (!auditRun) {
        return NextResponse.json(
            { success: false, error: { code: "NOT_FOUND", message: "Audit run not found." } },
            { status: 404 },
        );
    }

    const analysis = auditRun.analysis ?? (await getAuditRunAnalysis(auditRunId));
    return NextResponse.json({
        success: true,
        auditRunId,
        websiteId: auditRun.websiteId,
        analysis,
    });
}

export async function POST(request: Request, context: RouteContext) {
    const writeGuard = await guardAdministratorWriteRoute(request);
    if (writeGuard) return writeGuard;

    if (!isAnalysisProviderEnabled()) {
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "PROVIDER_NOT_ENABLED",
                    message: "Set AI_ANALYSIS_PROVIDER=cursor-automation to use this endpoint.",
                },
            },
            { status: 400 },
        );
    }

    const { auditRunId } = await context.params;

    try {
        const auditRun = await getAuditRunById(auditRunId);
        if (!auditRun) {
            return NextResponse.json(
                { success: false, error: { code: "NOT_FOUND", message: "Audit run not found." } },
                { status: 404 },
            );
        }

        await enforceAdministratorActionRateLimit({
            policyId: "ai-analysis-run",
            websiteId: auditRun.websiteId,
            administratorIdentity: await resolveRouteAdministratorIdentity(request),
        });

        const result = await requestCursorAnalysisForAuditRun(auditRunId);
        if (!result.ok) {
            const status =
                result.code === "NOT_FOUND"
                    ? 404
                    : result.code === "AUDIT_NOT_READY"
                      ? 400
                      : result.code === "ANALYSIS_ALREADY_ACTIVE" ||
                          result.code === "STALE_CALLBACK"
                        ? 409
                        : result.code === "PUBLIC_URL_UNREACHABLE" ||
                            result.code === "PROVIDER_NOT_CONFIGURED" ||
                            result.code === "CURSOR_ANALYSIS_NOT_CONFIGURED"
                          ? 400
                          : result.code === "RETRY_LIMIT_REACHED"
                            ? 429
                            : 500;

            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: result.code,
                        message: result.message,
                        missing: result.missing,
                        blockers: result.blockers,
                    },
                },
                { status },
            );
        }

        return NextResponse.json(
            {
                success: true,
                auditRunId: result.auditRunId,
                analysisRequestId: result.analysisRequestId,
                status: result.status,
            },
            { status: 202 },
        );
    } catch (error) {
        const rateLimited = await handleRouteRateLimitError(error);
        if (rateLimited) return rateLimited;

        console.error("Cursor analysis trigger failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: "TRIGGER_FAILED",
                    message: "Unable to trigger Cursor analysis right now.",
                },
            },
            { status: 500 },
        );
    }
}
