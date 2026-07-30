import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import { getPublicReportById, rotatePublicReportTokenRecord } from "@/src/data/public-reports";
import { buildPublicReportUrl } from "@/src/lib/application-url";
import { generateReportToken } from "@/src/services/public-reports/hash-report-token";

export async function rotatePublicReportToken(reportId: string) {
    const report = await getPublicReportById(reportId);
    if (!report) {
        return { success: false as const, error: { code: "NOT_FOUND", message: "Report not found." } };
    }

    if (report.status !== "published") {
        return {
            success: false as const,
            error: {
                code: "INVALID_STATUS",
                message: "Only published reports may have their token rotated.",
            },
        };
    }

    const { rawToken, tokenHash, tokenPrefix } = generateReportToken();
    const publicPath = `/report/${rawToken}`;
    const publicUrl = buildPublicReportUrl(rawToken);

    const updated = await rotatePublicReportTokenRecord(reportId, {
        tokenHash,
        tokenPrefix,
        publicPath,
    });

    await createActivityLog({
        websiteId: report.websiteId,
        type: "public-report-token-rotated",
        description: `Public report revision ${updated.revisionNumber} token rotated.`,
        actor: "admin",
        metadata: {
            publicReportId: updated.id,
            revisionNumber: updated.revisionNumber,
            status: updated.status,
            tokenPrefix: updated.tokenPrefix,
        },
    });

    return {
        success: true as const,
        reportId: updated.id,
        publicUrl,
        tokenPrefix,
        message: "Public report token rotated.",
    };
}
