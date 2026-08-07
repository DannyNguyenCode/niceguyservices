import "server-only";

import { Resend } from "resend";

export type TransactionalEmailPayload = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

export type SendTransactionalEmailResult = {
    id: string | null;
};

export class TransactionalEmailNotConfiguredError extends Error {
    constructor() {
        super("Email is not configured (missing RESEND_API_KEY).");
        this.name = "TransactionalEmailNotConfiguredError";
    }
}

export class TransactionalEmailSendError extends Error {
    constructor(message = "Could not send email. Please try again later.") {
        super(message);
        this.name = "TransactionalEmailSendError";
    }
}

function getResendFromAddress(): string {
    return (
        process.env.RESEND_FROM?.trim() ||
        "Nice Guy Web Design <onboarding@resend.dev>"
    );
}

/**
 * Shared Resend delivery for transactional mail.
 * Reuses the same env vars as contact / intake routes (RESEND_API_KEY, RESEND_FROM).
 */
export async function sendTransactionalEmail(
    payload: TransactionalEmailPayload,
): Promise<SendTransactionalEmailResult> {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
        throw new TransactionalEmailNotConfiguredError();
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
        from: getResendFromAddress(),
        to: [payload.to],
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
    });

    if (error) {
        console.error("[transactional-email] Resend delivery failed.");
        throw new TransactionalEmailSendError();
    }

    return { id: data?.id ?? null };
}
