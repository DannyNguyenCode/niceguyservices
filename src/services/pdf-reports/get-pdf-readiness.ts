import { calculateSnapshotChecksum } from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import type { PdfReadiness } from "@/src/services/pdf-reports/types";
import type { SerializablePublicReport } from "@/src/types/public-report";

const ALLOWED_STATUSES = new Set(["draft", "published", "unpublished"]);

function isCloudinaryEnvConfigured(): boolean {
    const placeholders = new Set([
        "",
        "your-cloudinary-cloud-name",
        "your-cloudinary-api-key",
        "your-cloudinary-api-secret",
    ]);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "";
    const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? "";
    const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() ?? "";
    return (
        !placeholders.has(cloudName) &&
        !placeholders.has(apiKey) &&
        !placeholders.has(apiSecret)
    );
}

export function isPublicReportSnapshotComplete(report: SerializablePublicReport): boolean {
    if (!report.title?.trim()) {
        return false;
    }
    if (!report.sourceSnapshot) {
        return false;
    }
    if (!report.sourceSnapshot.ai?.executiveSummary?.trim()) {
        return false;
    }
    if (
        report.sourceSnapshot.niceGuy?.overallScore === null ||
        report.sourceSnapshot.niceGuy?.overallScore === undefined
    ) {
        return false;
    }
    return true;
}

export function getPdfReadiness(input: {
    report: SerializablePublicReport | null;
    websiteActive: boolean;
    hasActiveGeneration: boolean;
    matchingPdfId: string | null;
    allowArchived?: boolean;
}): PdfReadiness {
    const blockers: PdfReadiness["blockers"] = [];

    if (!input.websiteActive) {
        blockers.push({ code: "WEBSITE_INACTIVE", message: "Website is not active." });
    }

    if (!input.report) {
        blockers.push({ code: "REPORT_NOT_FOUND", message: "Public report not found." });
        return {
            canGenerate: false,
            blockers,
            matchingPdfExists: false,
            matchingPdfId: null,
            snapshotChecksum: null,
        };
    }

    if (input.report.status === "archived" && !input.allowArchived) {
        blockers.push({
            code: "REPORT_ARCHIVED",
            message: "Archived reports require explicit confirmation to generate a PDF.",
        });
    } else if (!ALLOWED_STATUSES.has(input.report.status) && input.report.status !== "archived") {
        blockers.push({
            code: "REPORT_STATUS_INVALID",
            message: "Public report status does not allow PDF generation.",
        });
    }

    if (!isPublicReportSnapshotComplete(input.report)) {
        blockers.push({
            code: "SNAPSHOT_INCOMPLETE",
            message: "Public report snapshot is incomplete.",
        });
    }

    // React PDF does not require PDF_RENDER_SECRET / Chromium print navigation.
    // Storage (Cloudinary) remains the required external dependency.

    if (!isCloudinaryEnvConfigured()) {
        blockers.push({
            code: "STORAGE_NOT_CONFIGURED",
            message: "PDF storage configuration is missing.",
        });
    }

    if (input.hasActiveGeneration) {
        blockers.push({
            code: "ALREADY_RUNNING",
            message: "PDF generation is already running for this report.",
        });
    }

    const snapshotChecksum = calculateSnapshotChecksum(input.report);

    return {
        canGenerate: blockers.length === 0,
        blockers,
        matchingPdfExists: Boolean(input.matchingPdfId),
        matchingPdfId: input.matchingPdfId,
        snapshotChecksum,
    };
}
