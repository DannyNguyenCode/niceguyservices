import "server-only";

export type TemplateDemoEmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  from?: string;
  /** Identifies which demo theme logged the message. */
  demo: string;
};

export type TemplateDemoEmailResult = {
  sent: false;
  provider: "console";
};

/**
 * Demo-only email delivery for website inspiration templates.
 * Logs the payload in development and never calls Resend or reads RESEND_API_KEY.
 */
export async function deliverTemplateDemoEmail(
  payload: TemplateDemoEmailPayload,
): Promise<TemplateDemoEmailResult> {
  if (process.env.NODE_ENV === "development") {
    console.info(`[${payload.demo} demo email]`, {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      replyTo: payload.replyTo,
      text: payload.text,
    });
  }

  return { sent: false, provider: "console" };
}
