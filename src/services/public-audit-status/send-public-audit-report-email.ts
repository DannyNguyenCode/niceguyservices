import "server-only";

import { sendTransactionalEmail } from "@/src/services/email/send-transactional-email";
import {
    buildPublicReportAbsoluteUrl,
    PublicAuditDeliverableError,
    type ResolvedPublicAuditDeliverables,
} from "@/src/services/public-audit-status/resolve-public-audit-deliverables";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function buildPublicAuditReportReadyEmail(input: {
    domain: string;
    reportUrl: string;
    pdfReady: boolean;
}): { subject: string; text: string; html: string } {
    const subject = `Your website audit for ${input.domain} is ready`;
    const pdfLine = input.pdfReady
        ? "A PDF copy is available from the audit page after you open your results."
        : "You can open the web report now. A PDF copy will appear on the audit page when it is ready.";

    const text = [
        `Your website audit for ${input.domain} is ready.`,
        "",
        `View your report: ${input.reportUrl}`,
        "",
        pdfLine,
        "",
        "If you did not request this audit, you can ignore this email.",
        "",
        "Nice Guy Web Design",
    ].join("\n");

    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#2c2f30;max-width:480px;margin:0 auto;">
<h2 style="margin:0 0 16px;font-size:20px;">Your website audit is ready</h2>
<p style="margin:0 0 12px;">Your review for <strong>${escapeHtml(input.domain)}</strong> is ready to view.</p>
<p style="margin:0 0 20px;"><a href="${escapeHtml(input.reportUrl)}" style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600;">View in browser</a></p>
<p style="margin:0 0 12px;color:#5c5c5c;font-size:14px;">${escapeHtml(pdfLine)}</p>
<p style="margin:0;color:#5c5c5c;font-size:14px;">If you did not request this audit, you can ignore this email.</p>
<p style="margin:24px 0 0;font-size:14px;">Nice Guy Web Design</p>
</body></html>`;

    return { subject, text, html };
}

/**
 * Email the published report link to the website business email on file.
 * Destination is never taken from the client — only from the status-token-linked website.
 */
export async function sendPublicAuditReportEmail(
    deliverables: ResolvedPublicAuditDeliverables,
): Promise<{ maskedEmail: string }> {
    if (!deliverables.businessEmail) {
        throw new PublicAuditDeliverableError(
            "EMAIL_UNAVAILABLE",
            "Unable to deliver this report by email right now.",
        );
    }

    const reportUrl = buildPublicReportAbsoluteUrl(deliverables.reportViewPath);
    const content = buildPublicAuditReportReadyEmail({
        domain: deliverables.tokenRecord.normalizedDomain,
        reportUrl,
        pdfReady: Boolean(deliverables.pdfReport),
    });

    await sendTransactionalEmail({
        to: deliverables.businessEmail,
        ...content,
    });

    console.info("[public-audit-deliverables] REPORT_READY_NOTIFICATION_SENT", {
        websiteId: deliverables.tokenRecord.websiteId,
        auditRunId: deliverables.tokenRecord.auditRunId,
        maskedEmail: deliverables.maskedEmail,
        hasPdf: Boolean(deliverables.pdfReport),
    });

    return { maskedEmail: deliverables.maskedEmail };
}
