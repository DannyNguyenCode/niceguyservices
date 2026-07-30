import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import { getPublicReportById, updatePublicReportDraft } from "@/src/data/public-reports";
import { sanitizeReportText } from "@/src/services/public-reports/screenshot-selection";
import type { PublicReportSettings } from "@/src/types/public-report";

export async function updatePublicReport(
    reportId: string,
    input: {
        title?: string;
        subtitle?: string | null;
        settings?: Partial<PublicReportSettings>;
        expiresAt?: string | null;
    },
) {
    const report = await getPublicReportById(reportId);
    if (!report) {
        return { success: false as const, error: { code: "NOT_FOUND", message: "Report not found." } };
    }

    if (report.status !== "draft") {
        return {
            success: false as const,
            error: {
                code: "IMMUTABLE",
                message: "Published reports are immutable. Create a new revision to change content.",
            },
        };
    }

    const updated = await updatePublicReportDraft(reportId, {
        title: input.title ? sanitizeReportText(input.title, 200) : undefined,
        subtitle:
            input.subtitle === undefined
                ? undefined
                : input.subtitle
                  ? sanitizeReportText(input.subtitle, 200)
                  : null,
        settings: input.settings
            ? { ...report.settings, ...input.settings }
            : undefined,
        expiresAt: input.expiresAt,
    });

    await createActivityLog({
        websiteId: report.websiteId,
        type: "public-report-updated",
        description: `Public report revision ${updated.revisionNumber} updated.`,
        actor: "admin",
        metadata: {
            publicReportId: updated.id,
            revisionNumber: updated.revisionNumber,
            status: updated.status,
        },
    });

    return { success: true as const, report: updated };
}
