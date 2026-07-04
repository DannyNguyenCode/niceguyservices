import "server-only";

import { deliverTemplateDemoEmail } from "@/lib/templates/db/skeleton-email";

export type LooneyTunesEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendLooneyTunesEmailResult = {
  sent: false;
  provider: "console";
};

function getFromAddress(): string {
  return (
    process.env.LOONEY_TUNES_EMAIL_FROM?.trim() ||
    process.env.PET_MARKET_EMAIL_FROM?.trim() ||
    "Comet Cup Co. <onboarding@resend.dev>"
  );
}

/** Skeleton Resend-style delivery for the LooneyTunes cafe demo — console only. */
export async function sendLooneyTunesEmail(
  payload: LooneyTunesEmailPayload,
): Promise<SendLooneyTunesEmailResult> {
  await deliverTemplateDemoEmail({
    demo: "looneytunes-services",
    from: getFromAddress(),
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });

  return { sent: false, provider: "console" };
}

export function buildOtpEmailContent(options: {
  heading: string;
  intro: string;
  code: string;
  footer: string;
}): Pick<LooneyTunesEmailPayload, "html" | "text"> {
  const text = `${options.heading}\n\n${options.intro}\n\nYour code: ${options.code}\n\n${options.footer}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#151c28">
      <h1 style="color:#495E84;font-size:22px">${options.heading}</h1>
      <p>${options.intro}</p>
      <p style="font-size:28px;letter-spacing:0.35em;font-weight:700;color:#151c28;margin:24px 0">${options.code}</p>
      <p style="color:#444748;font-size:14px">${options.footer}</p>
    </div>
  `.trim();

  return { html, text };
}
