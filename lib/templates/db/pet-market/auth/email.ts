import "server-only";

import { deliverTemplateDemoEmail } from "@/lib/templates/db/skeleton-email";

export type PetMarketEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendPetMarketEmailResult = {
  sent: false;
  provider: "console";
};

function getFromAddress(): string {
  return (
    process.env.PET_MARKET_EMAIL_FROM?.trim() ||
    "Saturday Pet Market <onboarding@resend.dev>"
  );
}

/** Skeleton Resend-style delivery for the Saturday Pet Market demo — console only. */
export async function sendPetMarketEmail(
  payload: PetMarketEmailPayload,
): Promise<SendPetMarketEmailResult> {
  await deliverTemplateDemoEmail({
    demo: "saturday-pet-market",
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
}): Pick<PetMarketEmailPayload, "html" | "text"> {
  const text = `${options.heading}\n\n${options.intro}\n\nYour code: ${options.code}\n\n${options.footer}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
      <h1 style="color:#006a6a;font-size:22px">${options.heading}</h1>
      <p>${options.intro}</p>
      <p style="font-size:28px;letter-spacing:0.35em;font-weight:700;color:#b7102a;margin:24px 0">${options.code}</p>
      <p style="color:#5c5c5c;font-size:14px">${options.footer}</p>
    </div>
  `.trim();

  return { html, text };
}
