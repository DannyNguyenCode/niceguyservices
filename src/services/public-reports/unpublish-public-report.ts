import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import { getPublicReportById, unpublishPublicReportRecord } from "@/src/data/public-reports";
import { syncWebsitePublicReportSummary } from "@/src/data/websites";

export async function unpublishPublicReport(reportId: string) {
    const report = await getPublicReportById(reportId);
    if (!report) {
        return { success: false as const, error: { code: "NOT_FOUND", message: "Report not found." } };
    }

    if (report.status !== "published") {
        return {
            success: false as const,
            error: { code: "INVALID_STATUS", message: "Only published reports may be unpublished." },
        };
    }

    const updated = await unpublishPublicReportRecord(reportId);
    await syncWebsitePublicReportSummary(report.websiteId);

    await createActivityLog({
        websiteId: report.websiteId,
        type: "public-report-unpublished",
        description: `Public report revision ${updated.revisionNumber} unpublished.`,
        actor: "admin",
        metadata: {
            publicReportId: updated.id,
            revisionNumber: updated.revisionNumber,
            status: updated.status,
            tokenPrefix: updated.tokenPrefix,
        },
    });

    return { success: true as const, reportId: updated.id, message: "Report unpublished." };
}
