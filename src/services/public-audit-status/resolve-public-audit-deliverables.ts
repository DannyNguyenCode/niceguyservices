import "server-only";

import { getCompletedPdfReportsForPublicReport } from "@/src/data/pdf-reports";
import { getLatestPublicReportForAuditRun } from "@/src/data/public-reports";
import {
    getValidPublicAuditStatusTokenByRawToken,
    type SerializablePublicAuditStatusToken,
} from "@/src/data/public-audit-status-tokens";
import { getWebsiteById } from "@/src/data/websites";
import { buildApplicationPath } from "@/src/lib/application-url";
import {
    isValidPublicAuditStatusTokenFormat,
    publicAuditStatusTokenLogRef,
} from "@/src/services/public-audit-status/hash-status-token";
import {
    getPublicAuditStatusByToken,
} from "@/src/services/public-audit-status/get-public-audit-status";
import type { SerializablePdfReport } from "@/src/services/pdf-reports/types";
import type { SerializablePublicReport } from "@/src/types/public-report";

export class PublicAuditDeliverableError extends Error {
    readonly code:
        | "INVALID_TOKEN"
        | "NOT_FOUND"
        | "NOT_READY"
        | "PDF_NOT_READY"
        | "EMAIL_UNAVAILABLE"
        | "REPORT_MISSING";

    constructor(code: PublicAuditDeliverableError["code"], message: string) {
        super(message);
        this.name = "PublicAuditDeliverableError";
        this.code = code;
    }
}

export type ResolvedPublicAuditDeliverables = {
    tokenRecord: SerializablePublicAuditStatusToken;
    report: SerializablePublicReport;
    reportViewPath: string;
    pdfReport: SerializablePdfReport | null;
    businessEmail: string;
    maskedEmail: string;
};

export function maskBusinessEmail(email: string): string {
    const trimmed = email.trim();
    const at = trimmed.indexOf("@");
    if (at <= 0) return "***";
    const local = trimmed.slice(0, at);
    const domain = trimmed.slice(at + 1);
    const visible = local.slice(0, 1);
    return `${visible}***@${domain}`;
}

function extractReportViewPath(report: SerializablePublicReport): string | null {
    if (!report.publicPath?.startsWith("/report/")) {
        return null;
    }
    return report.publicPath;
}

/**
 * Resolve publish/PDF deliverables for a status token.
 * Status token authorizes ONLY this audit's published report + PDF while valid.
 * Does not authorize arbitrary reports or change the lookup OTP flow for other audits.
 */
export async function resolvePublicAuditDeliverables(
    rawToken: string,
): Promise<ResolvedPublicAuditDeliverables> {
    if (!isValidPublicAuditStatusTokenFormat(rawToken)) {
        throw new PublicAuditDeliverableError("INVALID_TOKEN", "Invalid status token.");
    }

    const tokenRecord = await getValidPublicAuditStatusTokenByRawToken(rawToken);
    if (!tokenRecord) {
        throw new PublicAuditDeliverableError("NOT_FOUND", "Audit status not found.");
    }

    const progress = await getPublicAuditStatusByToken(rawToken);
    if (progress.status !== "complete") {
        throw new PublicAuditDeliverableError(
            "NOT_READY",
            "Your audit report is not ready yet.",
        );
    }

    const report = await getLatestPublicReportForAuditRun(tokenRecord.auditRunId);
    if (!report || report.status !== "published") {
        throw new PublicAuditDeliverableError(
            "REPORT_MISSING",
            "Your audit report is not ready yet.",
        );
    }

    const reportViewPath = extractReportViewPath(report);
    if (!reportViewPath) {
        throw new PublicAuditDeliverableError(
            "REPORT_MISSING",
            "Your audit report is not ready yet.",
        );
    }

    const website = await getWebsiteById(tokenRecord.websiteId);
    const businessEmail = website?.businessEmail?.trim() ?? "";

    const pdfs = await getCompletedPdfReportsForPublicReport(report.id);
    const pdfReport = pdfs[0] ?? null;

    console.info("[public-audit-deliverables] RESOLVED", {
        tokenPrefix: publicAuditStatusTokenLogRef(rawToken),
        websiteId: tokenRecord.websiteId,
        auditRunId: tokenRecord.auditRunId,
        hasPdf: Boolean(pdfReport),
    });

    return {
        tokenRecord,
        report,
        reportViewPath,
        pdfReport,
        businessEmail,
        maskedEmail: businessEmail ? maskBusinessEmail(businessEmail) : "***",
    };
}

export function buildPublicReportAbsoluteUrl(reportViewPath: string): string {
    return buildApplicationPath(reportViewPath);
}
