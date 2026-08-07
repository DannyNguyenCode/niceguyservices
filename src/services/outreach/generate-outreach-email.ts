import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import {
    createFailedOutreachDraft,
    createOutreachDraft,
} from "@/src/data/outreach-email-drafts";
import { getPdfReportById } from "@/src/data/pdf-reports";
import { getPublicReportById } from "@/src/data/public-reports";
import { getWebsiteById, updateWebsiteOutreachDraftSummary } from "@/src/data/websites";
import { calculateSnapshotChecksum } from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { DEFAULT_OUTREACH_STRATEGY, OUTREACH_PROMPT_VERSION } from "@/src/services/outreach/constants";
import { buildOutreachInput } from "@/src/services/outreach/build-outreach-input";
import { generateOutreachEmailWithAi } from "@/src/services/outreach/generate-outreach-email-ai";
import { getOutreachReadiness } from "@/src/services/outreach/get-outreach-readiness";
import type { OutreachStrategy, SerializableOutreachEmailDraft } from "@/src/services/outreach/types";
import { OutreachValidationError } from "@/src/services/outreach/validate-outreach-output";
import { enforceAdministratorActionRateLimit } from "@/src/services/rate-limit/enforce-action-rate-limit";
import type { RateLimitedServiceOptions } from "@/src/services/rate-limit/service-options";

export type GenerateOutreachEmailResult =
    | { success: true; draft: SerializableOutreachEmailDraft }
    | { success: false; error: { code: string; message: string } };

function safeMessage(code: string): string {
    const messages: Record<string, string> = {
        OUTREACH_INVALID_REPORT_ID: "Invalid report ID.",
        OUTREACH_REPORT_NOT_FOUND: "Public report not found.",
        OUTREACH_WEBSITE_NOT_FOUND: "Website not found.",
        OUTREACH_SOURCE_INCOMPLETE: "Public report snapshot is incomplete.",
        OUTREACH_NO_SUPPORTED_FINDINGS: "No supported findings are available for outreach.",
        OUTREACH_PDF_NOT_FOUND: "Selected PDF was not found.",
        OUTREACH_PDF_MISMATCH: "Selected PDF does not match this report.",
        OUTREACH_PDF_NOT_READY: "Selected PDF is not ready.",
        OUTREACH_PROVIDER_NOT_CONFIGURED: "AI provider is not configured.",
        OUTREACH_PROVIDER_TIMEOUT: "AI provider timed out.",
        OUTREACH_PROVIDER_FAILED: "AI provider failed.",
        OUTREACH_SCHEMA_VALIDATION_FAILED: "Generated draft failed validation.",
        OUTREACH_INVALID_EVIDENCE: "Generated draft referenced invalid evidence.",
        OUTREACH_UNSUPPORTED_CLAIM: "Generated draft contained unsupported claims.",
        OUTREACH_SAVE_FAILED: "Unable to save outreach draft.",
    };
    return messages[code] ?? "Unable to generate outreach draft.";
}

function mergeStrategy(strategy?: Partial<OutreachStrategy>): OutreachStrategy {
    return { ...DEFAULT_OUTREACH_STRATEGY, ...strategy };
}

export async function generateOutreachEmail(
    input: {
        publicReportId: string;
        pdfReportId?: string | null;
        recipient?: {
            name?: string | null;
            role?: string | null;
            email?: string | null;
        };
        strategy?: Partial<OutreachStrategy>;
        allowArchived?: boolean;
    } & RateLimitedServiceOptions,
): Promise<GenerateOutreachEmailResult> {
    if (!input.publicReportId?.trim()) {
        return {
            success: false,
            error: {
                code: "OUTREACH_INVALID_REPORT_ID",
                message: safeMessage("OUTREACH_INVALID_REPORT_ID"),
            },
        };
    }

    const report = await getPublicReportById(input.publicReportId);
    if (!report) {
        return {
            success: false,
            error: {
                code: "OUTREACH_REPORT_NOT_FOUND",
                message: safeMessage("OUTREACH_REPORT_NOT_FOUND"),
            },
        };
    }

    const website = await getWebsiteById(report.websiteId);
    if (!website || website.deletedAt) {
        return {
            success: false,
            error: {
                code: "OUTREACH_WEBSITE_NOT_FOUND",
                message: safeMessage("OUTREACH_WEBSITE_NOT_FOUND"),
            },
        };
    }

    const strategy = mergeStrategy(input.strategy);
    const readiness = await getOutreachReadiness({
        publicReportId: report.id,
        websiteActive: !website.deletedAt,
        allowArchived: input.allowArchived,
    });

    if (!readiness.canGenerate) {
        const blocker = readiness.blockers[0];
        return {
            success: false,
            error: {
                code: blocker?.code ?? "OUTREACH_SOURCE_INCOMPLETE",
                message: blocker?.message ?? safeMessage("OUTREACH_SOURCE_INCOMPLETE"),
            },
        };
    }

    const snapshotChecksum = calculateSnapshotChecksum(report);
    let pdfVersion: string | null = null;
    let pdfFilename: string | null = null;

    if (input.pdfReportId) {
        const pdf = await getPdfReportById(input.pdfReportId);
        if (!pdf) {
            return {
                success: false,
                error: { code: "OUTREACH_PDF_NOT_FOUND", message: safeMessage("OUTREACH_PDF_NOT_FOUND") },
            };
        }
        pdfVersion = pdf.pdfVersion;
        pdfFilename = pdf.file?.filename ?? null;
    }

    const recipient = {
        name: input.recipient?.name?.trim() || null,
        role: input.recipient?.role?.trim() || null,
        email: input.recipient?.email?.trim() || null,
        businessName: report.branding.businessName || website.businessName || null,
    };

    const sourceMeta = {
        publicReportVersion: report.reportVersion,
        publicReportRevision: report.revisionNumber,
        snapshotChecksum,
        pdfVersion,
        pdfFilename,
    };

    await enforceAdministratorActionRateLimit({
        policyId: "outreach-generate",
        websiteId: report.websiteId,
        administratorIdentity: input.administratorIdentity,
        internalWorker: input.internalWorker,
    });

    await createActivityLog({
        websiteId: report.websiteId,
        type: "outreach-draft-started",
        actor: "system",
        metadata: {
            publicReportId: report.id,
            publicReportRevision: report.revisionNumber,
            pdfReportId: input.pdfReportId ?? null,
            promptVersion: OUTREACH_PROMPT_VERSION,
            tone: strategy.tone,
            length: strategy.length,
            primaryGoal: strategy.primaryGoal,
        },
    });

    try {
        const generationInput = await buildOutreachInput({
            publicReportId: report.id,
            pdfReportId: input.pdfReportId ?? null,
            recipient: input.recipient,
            strategy,
        });

        const generated = await generateOutreachEmailWithAi(generationInput);

        const draft = await createOutreachDraft({
            websiteId: report.websiteId,
            publicReportId: report.id,
            pdfReportId: input.pdfReportId ?? null,
            aiSummaryId: report.aiSummaryId,
            sourceAuditRunId: report.sourceAuditRunId ?? report.auditRunId,
            sourceAuditNumber: report.sourceAuditNumber,
            source: sourceMeta,
            recipient,
            strategy,
            subject: generated.subject,
            bodyText: generated.bodyText,
            evidence: generated.evidence.map((item) => ({
                type: item.type as SerializableOutreachEmailDraft["evidence"][number]["type"],
                sourceId: item.sourceId,
                label: item.label,
                value: item.value ?? null,
                sourcePath: item.sourcePath ?? null,
            })),
            claimWarnings: generated.claimWarnings,
            generation: {
                provider: generated.provider,
                model: generated.model,
                providerRequestId: generated.providerRequestId,
                generatedAt: new Date().toISOString(),
                durationMs: generated.durationMs,
                retryCount: generated.retryCount,
            },
            editSource: "generated",
        });

        await updateWebsiteOutreachDraftSummary(report.websiteId, "draft", new Date());

        const sourceAuditRunId = report.sourceAuditRunId ?? report.auditRunId;
        if (sourceAuditRunId) {
            await registerAuditReference({
                auditRunId: sourceAuditRunId,
                resourceType: "outreach-draft",
                resourceId: draft.id,
            });
        }

        await createActivityLog({
            websiteId: report.websiteId,
            type: "outreach-draft-generated",
            actor: "system",
            metadata: {
                outreachDraftId: draft.id,
                publicReportId: report.id,
                publicReportRevision: report.revisionNumber,
                pdfReportId: input.pdfReportId ?? null,
                promptVersion: OUTREACH_PROMPT_VERSION,
                provider: generated.provider,
                model: generated.model,
                tone: strategy.tone,
                length: strategy.length,
                primaryGoal: strategy.primaryGoal,
                evidenceCount: draft.evidence.length,
                warningCount: draft.claimWarnings.length,
            },
        });

        return { success: true, draft };
    } catch (error) {
        const code =
            error instanceof OutreachValidationError
                ? error.code
                : error instanceof Error && error.message.startsWith("OUTREACH_")
                  ? error.message
                  : error instanceof Error && error.message === "AI_CONFIGURATION_ERROR"
                    ? "OUTREACH_PROVIDER_NOT_CONFIGURED"
                    : error instanceof Error && error.message.includes("timeout")
                      ? "OUTREACH_PROVIDER_TIMEOUT"
                      : "OUTREACH_PROVIDER_FAILED";

        const failed = await createFailedOutreachDraft({
            websiteId: report.websiteId,
            publicReportId: report.id,
            pdfReportId: input.pdfReportId ?? null,
            aiSummaryId: report.aiSummaryId,
            source: sourceMeta,
            recipient,
            strategy,
            errorCode: code,
            errorMessage: safeMessage(code),
        });

        await updateWebsiteOutreachDraftSummary(report.websiteId, "draft", new Date());

        await createActivityLog({
            websiteId: report.websiteId,
            type: "outreach-draft-failed",
            actor: "system",
            metadata: {
                outreachDraftId: failed.id,
                publicReportId: report.id,
                errorCode: code,
            },
        });

        return {
            success: false,
            error: { code, message: safeMessage(code) },
        };
    }
}
