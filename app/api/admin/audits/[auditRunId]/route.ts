import { NextResponse } from "next/server";
import { getAuditRunById } from "@/src/data/audit-runs";
import { auditRunIdSchema } from "@/src/validation/audit-history";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ auditRunId: string }> };

// TODO: Require admin authentication before exposing audit history in production.
export async function GET(_request: Request, context: RouteContext) {
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
        const auditRun = await getAuditRunById(auditRunId);
        if (!auditRun) {
            return NextResponse.json(
                {
                    success: false,
                    error: { code: "AUDIT_HISTORY_AUDIT_NOT_FOUND", message: "Audit run not found." },
                },
                { status: 404 },
            );
        }

        const resourceCounts = {
            crawlData: auditRun.references.crawlDataIds.length,
            screenshots: auditRun.references.screenshotIds.length,
            googleMetrics: auditRun.references.googleMetricsIds.length,
            niceGuyMetrics: auditRun.references.niceGuyMetricsId ? 1 : 0,
            aiSummary: auditRun.references.aiSummaryId ? 1 : 0,
            heroSuggestions: auditRun.references.heroSuggestionIds.length,
            publicReports: auditRun.references.publicReportIds.length,
            pdfReports: auditRun.references.pdfReportIds.length,
            outreachDrafts: auditRun.references.outreachDraftIds.length,
            demoProjects: auditRun.references.demoProjectIds.length,
        };

        return NextResponse.json({ success: true, auditRun, resourceCounts });
    } catch (error) {
        console.error("Audit detail load failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: { code: "AUDIT_HISTORY_LOAD_FAILED", message: "Unable to load audit run." },
            },
            { status: 500 },
        );
    }
}
