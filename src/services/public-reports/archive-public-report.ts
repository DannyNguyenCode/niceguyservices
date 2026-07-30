import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import { archivePublicReportRecord, getPublicReportById } from "@/src/data/public-reports";
import { syncWebsitePublicReportSummary } from "@/src/data/websites";

export async function archivePublicReport(reportId: string) {
    const report = await getPublicReportById(reportId);
    if (!report) {
        return { success: false as const, error: { code: "NOT_FOUND", message: "Report not found." } };
    }

    const updated = await archivePublicReportRecord(reportId);
    await syncWebsitePublicReportSummary(report.websiteId);

    await createActivityLog({
        websiteId: report.websiteId,
        type: "public-report-archived",
        description: `Public report revision ${updated.revisionNumber} archived.`,
        actor: "admin",
        metadata: {
            publicReportId: updated.id,
            revisionNumber: updated.revisionNumber,
            status: updated.status,
            tokenPrefix: updated.tokenPrefix,
        },
    });

    return { success: true as const, reportId: updated.id, message: "Report archived." };
}
