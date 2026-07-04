import "server-only";

import { VI_EMAIL, VI_SITE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingConfig";
import { deliverTemplateDemoEmail } from "@/lib/templates/db/skeleton-email";
import {
  escapeViEmailHtml,
  viQuoteLocationLabel,
  type ViContactInquiryInput,
  type ViQuoteInquiryInput,
} from "@/lib/templates/valley-interlocking/forms";

export type ViInquiryEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendViInquiryEmailResult = {
  sent: false;
  provider: "console";
};

function getFromAddress(): string {
  return process.env.VI_INQUIRY_EMAIL_FROM?.trim() || `${VI_SITE} <onboarding@resend.dev>`;
}

function getToAddress(): string {
  return process.env.VI_INQUIRY_EMAIL_TO?.trim() || VI_EMAIL;
}

/** Skeleton Resend-style delivery for the Valley Interlocking demo — console only. */
export async function sendViInquiryEmail(
  payload: ViInquiryEmailPayload,
): Promise<SendViInquiryEmailResult> {
  await deliverTemplateDemoEmail({
    demo: "valley-interlocking",
    from: getFromAddress(),
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
    replyTo: payload.replyTo,
  });

  return { sent: false, provider: "console" };
}

function inquiryEmailShell(title: string, rows: { label: string; value: string }[]): Pick<ViInquiryEmailPayload, "html" | "text"> {
  const text = [title, "", ...rows.map((row) => `${row.label}: ${row.value}`)].join("\n");
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1a1c1c">
      <h1 style="color:#0A6847;font-size:22px;margin-bottom:16px">${escapeViEmailHtml(title)}</h1>
      <table style="width:100%;border-collapse:collapse">
        ${rows
          .map(
            (row) => `
          <tr>
            <td style="padding:8px 12px 8px 0;font-weight:600;vertical-align:top;color:#2a4a2e">${escapeViEmailHtml(row.label)}</td>
            <td style="padding:8px 0;white-space:pre-wrap">${escapeViEmailHtml(row.value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>
  `.trim();

  return { html, text };
}

export function buildViContactInquiryEmail(
  inquiry: ViContactInquiryInput,
): Omit<ViInquiryEmailPayload, "to"> {
  const subject = `Contact inquiry — ${inquiry.name}`;
  const content = inquiryEmailShell(`${VI_SITE} contact form`, [
    { label: "Name", value: inquiry.name },
    { label: "Phone", value: inquiry.phone },
    { label: "Email", value: inquiry.email },
    { label: "Message", value: inquiry.message },
  ]);

  return { subject, ...content, replyTo: inquiry.email };
}

export function buildViQuoteInquiryEmail(
  inquiry: ViQuoteInquiryInput,
): Omit<ViInquiryEmailPayload, "to"> {
  const subject = `Quote request — ${inquiry.name}`;
  const content = inquiryEmailShell(`${VI_SITE} quote form`, [
    { label: "Name", value: inquiry.name },
    { label: "Phone", value: inquiry.phone },
    { label: "Email", value: inquiry.email },
    { label: "Project location", value: viQuoteLocationLabel(inquiry.location) },
    { label: "Services", value: inquiry.services.join(", ") || "Not specified" },
    { label: "Address", value: inquiry.address },
    { label: "Project details", value: inquiry.details || "—" },
  ]);

  return { subject, ...content, replyTo: inquiry.email };
}

export async function sendViContactInquiry(inquiry: ViContactInquiryInput) {
  const built = buildViContactInquiryEmail(inquiry);
  return sendViInquiryEmail({ to: getToAddress(), ...built });
}

export async function sendViQuoteInquiry(inquiry: ViQuoteInquiryInput) {
  const built = buildViQuoteInquiryEmail(inquiry);
  return sendViInquiryEmail({ to: getToAddress(), ...built });
}
