import "server-only";

import { getLatestPublicReportForAuditRun } from "@/src/data/public-reports";
import { loadAuditRunResources } from "@/src/services/audit-history/load-audit-run-resources";
import { createPublicReport } from "@/src/services/public-reports/create-public-report";

export type CreateReportDraftResult =
    | { success: true; reportId: string }
    | { success: false; error: { code: string; message: string } };

export async function createReportDraftFromAuditRun(input: {
    websiteId: string;
    auditRunId: string;
}): Promise<CreateReportDraftResult> {
    const existing = await getLatestPublicReportForAuditRun(input.auditRunId);
    if (existing) {
        return { success: true, reportId: existing.id };
    }

    let resources = await loadAuditRunResources({
        websiteId: input.websiteId,
        auditRunId: input.auditRunId,
    });
    if (!resources?.crawl || !resources.niceGuy) {
        return {
            success: false,
            error: {
                code: "AUDIT_INCOMPLETE",
                message: "Audit results are not ready for report generation.",
            },
        };
    }

    if (!resources.aiSummary) {
        const cursorResult = resources.auditRun.analysis?.result;
        if (cursorResult && resources.auditRun.analysis?.status === "completed") {
            const { materializeAiSummaryFromCursorResult } = await import(
                "@/src/services/cursor-analysis/materialize-ai-summary-from-cursor"
            );
            await materializeAiSummaryFromCursorResult({
                auditRunId: input.auditRunId,
                result: cursorResult,
            });
            resources = await loadAuditRunResources({
                websiteId: input.websiteId,
                auditRunId: input.auditRunId,
            });
        }
    }

    if (!resources?.aiSummary) {
        return {
            success: false,
            error: {
                code: "AI_SUMMARY_MISSING",
                message: "Report draft requires completed Cursor analysis results.",
            },
        };
    }

    const result = await createPublicReport({
        websiteId: input.websiteId,
        auditRunId: input.auditRunId,
        crawlId: resources.crawl!.id,
        niceGuyMetricId: resources.niceGuy!.id,
        aiSummaryId: resources.aiSummary.id,
        heroSuggestionIds: resources.heroSuggestions.map((hero) => hero.id),
        screenshotIds: resources.screenshots.map((shot) => shot.id),
    });

    if (!result.success) {
        return result;
    }

    return { success: true, reportId: result.reportId };
}
