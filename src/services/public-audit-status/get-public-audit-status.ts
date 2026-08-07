import "server-only";

import { getAuditJobById } from "@/src/data/audit-jobs";
import { getCompletedPdfReportsForPublicReport } from "@/src/data/pdf-reports";
import { getLatestPublicReportForAuditRun } from "@/src/data/public-reports";
import {
    createPublicAuditStatusTokenRecord,
    getValidPublicAuditStatusTokenByRawToken,
} from "@/src/data/public-audit-status-tokens";
import {
    isValidPublicAuditStatusTokenFormat,
    publicAuditStatusTokenLogRef,
} from "@/src/services/public-audit-status/hash-status-token";
import {
    mapAuditJobToPublicProgress,
    type PublicAuditProgressView,
} from "@/src/services/public-audit-status/map-public-audit-progress";

export class PublicAuditStatusError extends Error {
    readonly code: "INVALID_TOKEN" | "NOT_FOUND" | "JOB_MISSING";

    constructor(code: PublicAuditStatusError["code"], message: string) {
        super(message);
        this.name = "PublicAuditStatusError";
        this.code = code;
    }
}

export async function issuePublicAuditStatusToken(input: {
    websiteId: string;
    auditRunId: string;
    auditJobId: string;
    normalizedDomain: string;
}): Promise<string> {
    const { rawToken, record } = await createPublicAuditStatusTokenRecord(input);
    console.info("[public-audit-status] PUBLIC_AUDIT_STATUS_TOKEN_ISSUED", {
        tokenPrefix: record.tokenPrefix,
        websiteId: input.websiteId,
        auditRunId: input.auditRunId,
        auditJobId: input.auditJobId,
        normalizedDomain: input.normalizedDomain,
    });
    return rawToken;
}

/**
 * Resolve a customer status token to sanitized progress.
 * Never returns Mongo IDs, emails, secrets, or internal URLs.
 */
export async function getPublicAuditStatusByToken(
    rawToken: string,
): Promise<PublicAuditProgressView> {
    if (!isValidPublicAuditStatusTokenFormat(rawToken)) {
        throw new PublicAuditStatusError("INVALID_TOKEN", "Invalid status token.");
    }

    const record = await getValidPublicAuditStatusTokenByRawToken(rawToken);
    if (!record) {
        throw new PublicAuditStatusError("NOT_FOUND", "Audit status not found.");
    }

    const job = await getAuditJobById(record.auditJobId);
    if (!job) {
        console.error("[public-audit-status] status token references missing job", {
            tokenPrefix: publicAuditStatusTokenLogRef(rawToken),
            auditJobId: record.auditJobId,
        });
        throw new PublicAuditStatusError("JOB_MISSING", "Audit status not found.");
    }

    const report = await getLatestPublicReportForAuditRun(job.auditRunId);
    const reportPublished = report?.status === "published";
    let pdfReady = false;
    if (reportPublished && report) {
        const pdfs = await getCompletedPdfReportsForPublicReport(report.id);
        pdfReady = pdfs.length > 0;
    }

    return mapAuditJobToPublicProgress({
        job,
        normalizedDomain: record.normalizedDomain,
        deliverables: {
            reportPublished,
            pdfReady,
        },
    });
}
