import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import {
    getPublicReportById,
    publishPublicReportRecord,
    unpublishOtherPublishedReports,
} from "@/src/data/public-reports";
import { getWebsiteById, syncWebsitePublicReportSummary } from "@/src/data/websites";
import { buildApplicationPath, buildPublicReportUrl } from "@/src/lib/application-url";
import { generateReportToken } from "@/src/services/public-reports/hash-report-token";
import { isReportExpired } from "@/src/services/public-reports/validate-public-report-sources";

export type PublishPublicReportResult =
    | {
          success: true;
          reportId: string;
          publicUrl: string;
          tokenPrefix: string;
          revisionNumber: number;
          message: string;
      }
    | {
          success: false;
          error: { code: string; message: string };
      };

export async function publishPublicReport(
    reportId: string,
    options?: { actor?: "admin" | "system" },
): Promise<PublishPublicReportResult> {
    const actor = options?.actor ?? "admin";
    const report = await getPublicReportById(reportId);
    if (!report) {
        return {
            success: false,
            error: { code: "NOT_FOUND", message: "Report not found." },
        };
    }

    if (report.status === "published") {
        return {
            success: true,
            reportId: report.id,
            publicUrl: report.publicPath ? buildApplicationPath(report.publicPath) : "",
            tokenPrefix: report.tokenPrefix ?? "",
            revisionNumber: report.revisionNumber,
            message: "Public report already published.",
        };
    }

    if (report.status !== "draft" && report.status !== "unpublished") {
        return {
            success: false,
            error: {
                code: "INVALID_STATUS",
                message: "Only draft or unpublished reports may be published.",
            },
        };
    }

    if (isReportExpired(report.expiresAt)) {
        return {
            success: false,
            error: { code: "REPORT_EXPIRED", message: "This report has expired." },
        };
    }

    const website = await getWebsiteById(report.websiteId);
    if (!website || website.deletedAt) {
        return {
            success: false,
            error: { code: "WEBSITE_INACTIVE", message: "Website is not active." },
        };
    }

    const { rawToken, tokenHash, tokenPrefix } = generateReportToken();
    const publicPath = `/report/${rawToken}`;
    const publicUrl = buildPublicReportUrl(rawToken);

    await unpublishOtherPublishedReports(report.websiteId, report.id);

    const published = await publishPublicReportRecord(report.id, {
        tokenHash,
        tokenPrefix,
        publicPath,
    });

    await syncWebsitePublicReportSummary(report.websiteId);

    await createActivityLog({
        websiteId: report.websiteId,
        type: "public-report-published",
        description:
            actor === "system"
                ? `Public report revision ${published.revisionNumber} published automatically after AI analysis.`
                : `Public report revision ${published.revisionNumber} published.`,
        actor,
        metadata: {
            publicReportId: published.id,
            revisionNumber: published.revisionNumber,
            status: published.status,
            tokenPrefix: published.tokenPrefix,
            trigger: actor === "system" ? "auto_post_ai" : "manual",
        },
    });

    return {
        success: true,
        reportId: published.id,
        publicUrl,
        tokenPrefix,
        revisionNumber: published.revisionNumber,
        message: "Public report published.",
    };
}
