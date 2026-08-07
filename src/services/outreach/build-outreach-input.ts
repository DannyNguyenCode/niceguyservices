import "server-only";

import { getPdfReportById } from "@/src/data/pdf-reports";
import { getPublicReportById } from "@/src/data/public-reports";
import { getWebsiteById } from "@/src/data/websites";
import { getPublicReportBaseUrl } from "@/src/lib/public-report-config";
import { getOutreachSenderProfile } from "@/src/lib/outreach-sender-config";
import { calculateSnapshotChecksum } from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { OUTREACH_INPUT_SCHEMA_VERSION } from "@/src/services/outreach/constants";
import type { OutreachGenerationInput, OutreachStrategy } from "@/src/services/outreach/types";
import { isPublicReportSnapshotComplete } from "@/src/services/pdf-reports/get-pdf-readiness";

export class OutreachInputError extends Error {
    readonly code: string;

    constructor(code: string, message: string) {
        super(message);
        this.name = "OutreachInputError";
        this.code = code;
    }
}

function evidenceId(prefix: string, index: number): string {
    return `${prefix}-${index}`;
}

export async function buildOutreachInput(input: {
    publicReportId: string;
    pdfReportId?: string | null;
    recipient?: {
        name?: string | null;
        role?: string | null;
        email?: string | null;
    };
    strategy: OutreachStrategy;
}): Promise<OutreachGenerationInput> {
    const report = await getPublicReportById(input.publicReportId);
    if (!report) {
        throw new OutreachInputError("OUTREACH_REPORT_NOT_FOUND", "Public report not found.");
    }

    const website = await getWebsiteById(report.websiteId);
    if (!website || website.deletedAt) {
        throw new OutreachInputError("OUTREACH_WEBSITE_NOT_FOUND", "Website not found.");
    }

    if (!isPublicReportSnapshotComplete(report)) {
        throw new OutreachInputError(
            "OUTREACH_SOURCE_INCOMPLETE",
            "Public report snapshot is incomplete.",
        );
    }

    const snapshot = report.sourceSnapshot;
    let pdfFilename: string | null = null;
    let pdfAvailable = false;

    if (input.pdfReportId) {
        const pdf = await getPdfReportById(input.pdfReportId);
        if (!pdf || pdf.status !== "complete" || !pdf.file?.filename) {
            throw new OutreachInputError("OUTREACH_PDF_NOT_READY", "Selected PDF is not ready.");
        }
        if (pdf.publicReportId !== report.id) {
            throw new OutreachInputError("OUTREACH_PDF_MISMATCH", "PDF does not match the selected report.");
        }
        if (pdf.source.snapshotChecksum !== calculateSnapshotChecksum(report)) {
            throw new OutreachInputError(
                "OUTREACH_PDF_MISMATCH",
                "PDF does not match the current report snapshot.",
            );
        }
        pdfFilename = pdf.file.filename;
        pdfAvailable = true;
    }

    const publicUrlAvailable =
        report.status === "published" && Boolean(report.publicPath) && Boolean(getPublicReportBaseUrl());
    const publicUrl =
        publicUrlAvailable && report.publicPath
            ? `${getPublicReportBaseUrl()}${report.publicPath}`
            : null;

    if (input.strategy.includePublicReport && !publicUrlAvailable) {
        throw new OutreachInputError(
            "OUTREACH_SOURCE_INCOMPLETE",
            "Public report URL is not available for inclusion.",
        );
    }

    const strengths = snapshot.ai.strengths.map((item, index) => ({
        id: evidenceId("strength", index),
        title: item.title,
        description: item.description,
        evidenceCheckIds: item.evidenceLabels,
    }));

    const weaknesses = snapshot.ai.weaknesses.map((item, index) => ({
        id: evidenceId("weakness", index),
        title: item.title,
        description: item.description,
        priority: item.priority,
        evidenceCheckIds: item.evidenceLabels,
    }));

    const quickWins = snapshot.ai.quickWins.map((item, index) => ({
        id: evidenceId("quick-win", index),
        title: item.title,
        description: item.description,
        expectedImpact: item.expectedImpact,
        estimatedEffort: item.relativeEffort,
        evidenceCheckIds: item.evidenceLabels,
    }));

    const supportedFindings =
        strengths.length + weaknesses.length + quickWins.length + (snapshot.niceGuy.overallScore ? 1 : 0);

    if (supportedFindings === 0) {
        throw new OutreachInputError(
            "OUTREACH_NO_SUPPORTED_FINDINGS",
            "No supported outreach findings are available.",
        );
    }

    const sender = getOutreachSenderProfile();

    return {
        schemaVersion: OUTREACH_INPUT_SCHEMA_VERSION,
        business: {
            name: report.branding.businessName?.trim() || website.businessName || report.branding.normalizedDomain || website.normalizedDomain,
            domain: report.branding.normalizedDomain || website.normalizedDomain,
            industry: report.branding.industry || website.industry || null,
            location: report.branding.location || website.location || null,
        },
        recipient: {
            name: input.recipient?.name?.trim() || null,
            role: input.recipient?.role?.trim() || null,
        },
        sender: {
            name: sender.senderName,
            businessName: sender.businessName,
            websiteUrl: sender.websiteUrl,
            phone: sender.phone,
            signatureText: sender.signatureText,
        },
        report: {
            revision: report.revisionNumber,
            title: report.title,
            generatedAt: report.publishedAt ?? report.createdAt,
            publicStatus: report.status,
            publicUrlAvailable,
            publicUrl: input.strategy.includePublicReport ? publicUrl : null,
            pdfAvailable,
            pdfFilename: input.strategy.includePdfReference ? pdfFilename : null,
        },
        audit: {
            overallScore: input.strategy.includeScore ? snapshot.niceGuy.overallScore : null,
            scoreLabel: input.strategy.includeScore ? snapshot.niceGuy.scoreLabel : null,
            strengths: input.strategy.includeBusinessCompliment ? strengths : [],
            weaknesses,
            quickWins: input.strategy.includeQuickWin ? quickWins : [],
            pageSpeed: input.strategy.includePageSpeed
                ? {
                      mobilePerformance: snapshot.pageSpeed.mobile?.performance ?? null,
                      desktopPerformance: snapshot.pageSpeed.desktop?.performance ?? null,
                      lcpMobile: snapshot.pageSpeed.mobile?.lcp ?? null,
                      lcpDesktop: snapshot.pageSpeed.desktop?.lcp ?? null,
                  }
                : null,
        },
        strategy: input.strategy,
        constraints: {
            doNotInventFacts: true,
            doNotClaimPriorRelationship: true,
            doNotPromiseResults: true,
            doNotShameBusiness: true,
            doNotIncludeUnsupportedNumbers: true,
            requireEvidenceForCriticism: true,
        },
    };
}
