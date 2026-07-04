import { Resend } from "resend";
import { NextResponse } from "next/server";
import { WORKBOOK_CONTENT } from "@/lib/clientDiscoveryWorkbook/content";

export const dynamic = "force-dynamic";

const WORKBOOK_ENABLED = false;
const DEFAULT_TO = "gbnguyenw@gmail.com";

type Body = {
    answers?: Record<string, string>;
    submittedAt?: string;
};

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function validateAnswers(answers: unknown): answers is Record<string, string> {
    if (!answers || typeof answers !== "object") return false;
    const email = (answers as Record<string, unknown>).email;
    const businessName = (answers as Record<string, unknown>).businessName;
    const contactName = (answers as Record<string, unknown>).contactName;
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        return false;
    }
    if (typeof businessName !== "string" || !businessName.trim()) return false;
    if (typeof contactName !== "string" || !contactName.trim()) return false;

    for (const section of WORKBOOK_CONTENT.sections) {
        for (const field of section.fields) {
            if (!field.required) continue;
            const value = (answers as Record<string, unknown>)[field.name];
            if (typeof value !== "string" || !value.trim()) return false;
        }
    }
    return true;
}

function buildEmailBody(answers: Record<string, string>, submittedAt: string): {
    text: string;
    html: string;
} {
    const blocks: string[] = [];
    const htmlSections: string[] = [];

    for (const section of WORKBOOK_CONTENT.sections) {
        const lines: string[] = [`## ${section.title}`, ""];
        const rows: string[] = [];

        for (const field of section.fields) {
            const value = answers[field.name]?.trim() || "—";
            lines.push(`${field.label}: ${value}`);
            rows.push(
                `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top;width:38%;">${escapeHtml(field.label)}</td><td style="padding:6px 0;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
            );
        }

        blocks.push(lines.join("\n"));
        htmlSections.push(
            `<h3 style="margin:24px 0 8px;font-size:16px;">${escapeHtml(section.title)}</h3><table style="border-collapse:collapse;width:100%;margin-bottom:8px;">${rows.join("")}</table>`,
        );
    }

    const header = [
        `Submitted: ${submittedAt}`,
        `Business: ${answers.businessName}`,
        `Contact: ${answers.contactName}`,
        `Email: ${answers.email}`,
        "",
    ];

    const text = [...header, ...blocks].join("\n\n");
    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#2c2f30;">
<h2 style="margin:0 0 16px;">Client Discovery Workbook</h2>
<p style="margin:0 0 4px;"><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
<p style="margin:0 0 4px;"><strong>Business:</strong> ${escapeHtml(answers.businessName ?? "")}</p>
<p style="margin:0 0 4px;"><strong>Contact:</strong> ${escapeHtml(answers.contactName ?? "")}</p>
<p style="margin:0 0 16px;"><strong>Email:</strong> ${escapeHtml(answers.email ?? "")}</p>
${htmlSections.join("")}
</body></html>`;

    return { text, html };
}

export async function POST(request: Request) {
    // Client discovery workbook temporarily disabled
    if (!WORKBOOK_ENABLED) {
        return NextResponse.json(
            { error: "Client discovery workbook is temporarily unavailable." },
            { status: 503 },
        );
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
        return NextResponse.json(
            { error: "Email is not configured (missing RESEND_API_KEY)." },
            { status: 503 },
        );
    }

    let body: Body;
    try {
        body = (await request.json()) as Body;
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (!validateAnswers(body.answers)) {
        return NextResponse.json(
            { error: "Please complete all required fields before submitting." },
            { status: 400 },
        );
    }

    const answers = body.answers;
    const submittedAt =
        typeof body.submittedAt === "string" && body.submittedAt.trim()
            ? body.submittedAt.trim()
            : new Date().toISOString();

    const { text, html } = buildEmailBody(answers, submittedAt);
    const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
    const from =
        process.env.RESEND_FROM?.trim() ||
        "Nice Guy Web Design <onboarding@resend.dev>";
    const subject = `Client discovery workbook: ${answers.businessName}`;

    const resend = new Resend(apiKey);
    const { data: sendData, error } = await resend.emails.send({
        from,
        to: [to],
        subject,
        text,
        html,
        replyTo: answers.email.trim(),
    });

    if (error) {
        console.error("[client-discovery-workbook] Resend error:", error);
        return NextResponse.json(
            { error: "Could not send email. Please try again later." },
            { status: 502 },
        );
    }

    return NextResponse.json({ ok: true, id: sendData?.id });
}
