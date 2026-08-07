import "server-only";

import { sendTransactionalEmail } from "@/src/services/email/send-transactional-email";
import { REPORT_LOOKUP_CODE_TTL_MS } from "@/src/services/report-lookup/constants";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function buildReportLookupVerificationEmail(code: string): {
    subject: string;
    text: string;
    html: string;
} {
    const minutes = Math.round(REPORT_LOOKUP_CODE_TTL_MS / 60_000);
    const subject = "Your Nice Guy Website Audit verification code";
    const text = [
        "Your verification code is:",
        "",
        code,
        "",
        `This code expires in ${minutes} minutes.`,
        "",
        "If you didn't request access to a website audit report, you can ignore this email.",
        "",
        "Nice Guy Web Design",
    ].join("\n");

    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#2c2f30;max-width:480px;margin:0 auto;">
<h2 style="margin:0 0 16px;font-size:20px;">Your verification code</h2>
<p style="margin:0 0 12px;">Use this code to access your published website audit report.</p>
<p style="font-size:28px;letter-spacing:0.35em;font-weight:700;margin:24px 0;">${escapeHtml(code)}</p>
<p style="margin:0 0 12px;color:#5c5c5c;font-size:14px;">This code expires in ${minutes} minutes.</p>
<p style="margin:0;color:#5c5c5c;font-size:14px;">If you didn't request access to a website audit report, you can ignore this email.</p>
<p style="margin:24px 0 0;font-size:14px;">Nice Guy Web Design</p>
</body></html>`;

    return { subject, text, html };
}

export async function sendReportLookupVerificationEmail(input: {
    to: string;
    code: string;
}): Promise<void> {
    const content = buildReportLookupVerificationEmail(input.code);
    await sendTransactionalEmail({
        to: input.to,
        ...content,
    });
}
