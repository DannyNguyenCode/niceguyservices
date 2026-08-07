import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import { hasAutoAuditPdfReadyEmailBeenSent } from "@/src/data/public-audit-email-notifications";
import { getWebsiteById } from "@/src/data/websites";
import { sendTransactionalEmail } from "@/src/services/email/send-transactional-email";
import { buildPublicPdfEmailDownloadUrl } from "@/src/services/public-audit-status/pdf-email-download-token";
import { maskBusinessEmail } from "@/src/services/public-audit-status/resolve-public-audit-deliverables";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function buildPublicAuditReportReadyEmail(input: {
    domain: string;
    pdfDownloadUrl: string;
}): { subject: string; text: string; html: string } {
    const subject = `Your website audit for ${input.domain} is ready`;
    const text = [
        `Your website audit for ${input.domain} is ready.`,
        "",
        `Download your PDF: ${input.pdfDownloadUrl}`,
        "",
        "This download link expires in 7 days.",
        "",
        "If you did not request this audit, you can ignore this email.",
        "",
        "Nice Guy Web Design",
    ].join("\n");

    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#2c2f30;max-width:480px;margin:0 auto;">
<h2 style="margin:0 0 16px;font-size:20px;">Your website audit is ready</h2>
<p style="margin:0 0 12px;">Your review for <strong>${escapeHtml(input.domain)}</strong> is ready. Download your PDF report below.</p>
<p style="margin:0 0 20px;"><a href="${escapeHtml(input.pdfDownloadUrl)}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600;">Download PDF</a></p>
<p style="margin:0 0 12px;color:#5c5c5c;font-size:14px;">This download link expires in 7 days.</p>
<p style="margin:0;color:#5c5c5c;font-size:14px;">If you did not request this audit, you can ignore this email.</p>
<p style="margin:24px 0 0;font-size:14px;">Nice Guy Web Design</p>
</body></html>`;

    return { subject, text, html };
}

export type SendPublicAuditPdfReadyEmailResult =
    | { sent: true; maskedEmail: string; reused: false }
    | { sent: false; skipped: true; reason: "ALREADY_SENT" | "NO_EMAIL" | "SEND_FAILED" };

/**
 * Automatically email a signed PDF download link to the website business email.
 * Idempotent per public report (duplicate callbacks do not resend).
 */
export async function sendPublicAuditPdfReadyEmail(input: {
    websiteId: string;
    auditRunId: string;
    publicReportId: string;
    pdfReportId: string;
    normalizedDomain: string;
}): Promise<SendPublicAuditPdfReadyEmailResult> {
    const alreadySent = await hasAutoAuditPdfReadyEmailBeenSent({
        websiteId: input.websiteId,
        publicReportId: input.publicReportId,
    });
    if (alreadySent) {
        console.info("[public-audit-deliverables] REPORT_READY_NOTIFICATION_IDEMPOTENT", {
            websiteId: input.websiteId,
            auditRunId: input.auditRunId,
            publicReportId: input.publicReportId,
        });
        return { sent: false, skipped: true, reason: "ALREADY_SENT" };
    }

    const website = await getWebsiteById(input.websiteId);
    const businessEmail = website?.businessEmail?.trim() ?? "";
    if (!businessEmail) {
        console.info("[public-audit-deliverables] REPORT_NOTIFICATION_FAILED", {
            websiteId: input.websiteId,
            reason: "NO_EMAIL",
        });
        return { sent: false, skipped: true, reason: "NO_EMAIL" };
    }

    const pdfDownloadUrl = buildPublicPdfEmailDownloadUrl({
        pdfReportId: input.pdfReportId,
        websiteId: input.websiteId,
        publicReportId: input.publicReportId,
    });
    const maskedEmail = maskBusinessEmail(businessEmail);
    const content = buildPublicAuditReportReadyEmail({
        domain: input.normalizedDomain,
        pdfDownloadUrl,
    });

    try {
        await sendTransactionalEmail({
            to: businessEmail,
            ...content,
        });
    } catch (error) {
        console.error("[public-audit-deliverables] REPORT_NOTIFICATION_FAILED", {
            websiteId: input.websiteId,
            auditRunId: input.auditRunId,
            errorName: error instanceof Error ? error.name : "unknown",
        });
        return { sent: false, skipped: true, reason: "SEND_FAILED" };
    }

    await createActivityLog({
        websiteId: input.websiteId,
        auditRunId: input.auditRunId,
        publicReportId: input.publicReportId,
        pdfReportId: input.pdfReportId,
        type: "email-sent",
        actor: "system",
        description: `Audit PDF ready email sent to ${maskedEmail}.`,
        metadata: {
            trigger: "auto_audit_complete",
            publicReportId: input.publicReportId,
            pdfReportId: input.pdfReportId,
            maskedEmail,
        },
    });

    console.info("[public-audit-deliverables] REPORT_READY_NOTIFICATION_SENT", {
        websiteId: input.websiteId,
        auditRunId: input.auditRunId,
        maskedEmail,
        pdfReportId: input.pdfReportId,
    });

    return { sent: true, maskedEmail, reused: false };
}
