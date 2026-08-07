import { isAiConfigured } from "@/src/lib/ai-config";
import { getCompletedPdfReportsForPublicReport } from "@/src/data/pdf-reports";
import { getPublicReportById } from "@/src/data/public-reports";
import { calculateSnapshotChecksum } from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { isPublicReportSnapshotComplete } from "@/src/services/pdf-reports/get-pdf-readiness";
import { countSupportedFindings } from "@/src/services/outreach/count-supported-findings";
import type { OutreachReadiness } from "@/src/services/outreach/types";

const ALLOWED_STATUSES = new Set(["draft", "published", "unpublished", "archived"]);

export async function getOutreachReadiness(input: {
    publicReportId: string;
    websiteActive: boolean;
    allowArchived?: boolean;
}): Promise<OutreachReadiness> {
    const blockers: OutreachReadiness["blockers"] = [];
    const warnings: OutreachReadiness["warnings"] = [];

    if (!input.websiteActive) {
        blockers.push({ code: "WEBSITE_INACTIVE", message: "Website is not active." });
    }

    const report = await getPublicReportById(input.publicReportId);
    if (!report) {
        blockers.push({ code: "REPORT_NOT_FOUND", message: "Public report not found." });
        return {
            canGenerate: false,
            blockers,
            warnings,
            availablePdfReports: [],
            supportedFindingsCount: 0,
        };
    }

    if (report.status === "archived" && !input.allowArchived) {
        blockers.push({
            code: "REPORT_ARCHIVED",
            message: "Archived reports require explicit confirmation.",
        });
    } else if (!ALLOWED_STATUSES.has(report.status)) {
        blockers.push({
            code: "REPORT_STATUS_INVALID",
            message: "Public report status does not allow outreach drafting.",
        });
    }

    if (!isPublicReportSnapshotComplete(report)) {
        blockers.push({
            code: "SNAPSHOT_INCOMPLETE",
            message: "Public report snapshot is incomplete.",
        });
    }

    const supportedFindingsCount = countSupportedFindings(report);
    if (supportedFindingsCount === 0) {
        blockers.push({
            code: "NO_SUPPORTED_FINDINGS",
            message: "No supported outreach findings are available.",
        });
    }

    if (!isAiConfigured()) {
        blockers.push({
            code: "PROVIDER_NOT_CONFIGURED",
            message: "AI provider is not configured.",
        });
    }

    const pdfs = await getCompletedPdfReportsForPublicReport(report.id);
    const checksum = calculateSnapshotChecksum(report);
    const availablePdfReports = pdfs
        .filter((pdf) => pdf.source.snapshotChecksum === checksum && pdf.file?.filename)
        .map((pdf) => ({
            id: pdf.id,
            filename: pdf.file!.filename,
            revision: pdf.source.publicReportRevision,
        }));

    if (availablePdfReports.length === 0) {
        warnings.push({
            code: "NO_PDF",
            message: "No completed PDF is available for this report revision.",
        });
    }

    if (report.status !== "published") {
        warnings.push({
            code: "REPORT_NOT_PUBLISHED",
            message: "Public report is not published, so a public link cannot be included.",
        });
    }

    if (!report.sourceSnapshot.ai.strengths.length) {
        warnings.push({
            code: "NO_STRENGTH",
            message: "No evidence-based strength is available in the snapshot.",
        });
    }

    if (
        !report.sourceSnapshot.pageSpeed.mobile?.performance &&
        !report.sourceSnapshot.pageSpeed.desktop?.performance
    ) {
        warnings.push({
            code: "NO_PAGESPEED",
            message: "No PageSpeed data is available in the snapshot.",
        });
    }

    return {
        canGenerate: blockers.length === 0,
        blockers,
        warnings,
        availablePdfReports,
        supportedFindingsCount,
    };
}
