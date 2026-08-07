import "server-only";

import { connectToDatabase } from "@/src/lib/mongodb";
import { PublicReport } from "@/src/models/PublicReport";
import { Website } from "@/src/models/Website";
import { isPublicReportAccessible } from "@/src/services/public-reports/validate-public-report-sources";
import type { PublicReportBranding, PublicReportStatus } from "@/src/types/public-report";

export type CustomerLookupReport = {
    businessName: string;
    websiteUrl: string;
    auditDate: string | null;
    publishedAt: string | null;
    reportUrl: string;
};

/**
 * Returns published, non-expired public reports for websites whose businessEmail
 * matches the verified normalized email. Never returns draft/unpublished/archived.
 */
export async function listPublishedReportsForBusinessEmail(
    normalizedEmail: string,
): Promise<CustomerLookupReport[]> {
    await connectToDatabase();

    const websites = await Website.find({
        businessEmail: normalizedEmail,
        deletedAt: null,
    })
        .select("_id businessName originalUrl")
        .lean();

    if (websites.length === 0) {
        return [];
    }

    const websiteIds = websites.map((site) => site._id);
    const websiteById = new Map(
        websites.map((site) => [
            String(site._id),
            {
                businessName: String(site.businessName ?? "").trim(),
                originalUrl: String(site.originalUrl ?? ""),
            },
        ]),
    );

    const reports = await PublicReport.find({
        websiteId: { $in: websiteIds },
        status: "published",
        publicPath: { $type: "string", $ne: "" },
    })
        .sort({ publishedAt: -1, createdAt: -1 })
        .lean();

    const results: CustomerLookupReport[] = [];

    for (const report of reports) {
        const status = String(report.status) as PublicReportStatus;
        const expiresAt = report.expiresAt
            ? new Date(report.expiresAt as Date).toISOString()
            : null;
        if (!isPublicReportAccessible({ status, expiresAt })) {
            continue;
        }

        const publicPath = report.publicPath ? String(report.publicPath) : "";
        if (!publicPath.startsWith("/report/")) {
            continue;
        }

        const website = websiteById.get(String(report.websiteId));
        const branding = report.branding as PublicReportBranding | undefined;
        const businessName =
            branding?.businessName?.trim() ||
            website?.businessName ||
            branding?.normalizedDomain ||
            "Website audit report";
        const websiteUrl =
            branding?.websiteUrl?.trim() || website?.originalUrl || "";

        const publishedAt = report.publishedAt
            ? new Date(report.publishedAt as Date).toISOString()
            : null;
        const auditDate =
            publishedAt ??
            (report.createdAt ? new Date(report.createdAt as Date).toISOString() : null);

        results.push({
            businessName,
            websiteUrl,
            auditDate,
            publishedAt,
            reportUrl: publicPath,
        });
    }

    return results;
}

export async function hasEligiblePublishedReportForEmail(
    normalizedEmail: string,
): Promise<boolean> {
    const reports = await listPublishedReportsForBusinessEmail(normalizedEmail);
    return reports.length > 0;
}
