import { Resend } from "resend";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_TO = "gbnguyenw@gmail.com";

type ContactPayload = {
    name: string;
    email: string;
    phone: string;
    businessName: string;
    businessType: string;
    budget: string;
    services: string[];
    message: string;
    wantsMeeting: boolean;
};

function isNonEmptyString(v: unknown): v is string {
    return typeof v === "string" && v.trim().length > 0;
}

function isStringArray(v: unknown): v is string[] {
    return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function buildEmailBody(data: ContactPayload): { text: string; html: string } {
    const lines = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "—"}`,
        `Business name: ${data.businessName || "—"}`,
        `Business type: ${data.businessType || "—"}`,
        `Budget: ${data.budget || "—"}`,
        `Services: ${data.services.length ? data.services.join(", ") : "—"}`,
        `Wants meeting: ${data.wantsMeeting ? "Yes" : "No"}`,
        "",
        "Message:",
        data.message,
    ];
    const text = lines.join("\n");

    const row = (label: string, value: string) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`;

    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#2c2f30;">
<h2 style="margin:0 0 16px;">New contact form — Nice Guy Services</h2>
<table style="border-collapse:collapse;margin-bottom:20px;">
${row("Name", data.name)}
${row("Email", data.email)}
${row("Phone", data.phone || "—")}
${row("Business name", data.businessName || "—")}
${row("Business type", data.businessType || "—")}
${row("Budget", data.budget || "—")}
${row("Services", data.services.length ? data.services.join(", ") : "—")}
${row("Wants meeting", data.wantsMeeting ? "Yes" : "No")}
</table>
<p style="font-weight:600;margin:0 0 8px;">Message</p>
<p style="margin:0;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
</body></html>`;

    return { text, html };
}

export async function POST(request: Request) {
    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
        return NextResponse.json(
            { error: "Email is not configured (missing RESEND_API_KEY)." },
            { status: 503 }
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    if (!body || typeof body !== "object") {
        return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }

    const p = body as Record<string, unknown>;
    const name = p.name;
    const email = p.email;
    const message = p.message;
    const phone = typeof p.phone === "string" ? p.phone : "";
    const businessName = typeof p.businessName === "string" ? p.businessName : "";
    const businessType = typeof p.businessType === "string" ? p.businessType : "";
    const budget = typeof p.budget === "string" ? p.budget : "";
    const services = isStringArray(p.services) ? p.services : [];
    const wantsMeeting = p.wantsMeeting === true;

    if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
        return NextResponse.json(
            { error: "Name, email, and message are required." },
            { status: 400 }
        );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk) {
        return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const data: ContactPayload = {
        name: name.trim(),
        email: email.trim(),
        phone,
        businessName,
        businessType,
        budget,
        services,
        message: message.trim(),
        wantsMeeting,
    };

    const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
    const from =
        process.env.RESEND_FROM?.trim() ||
        "Nice Guy Services <onboarding@resend.dev>";

    const { text, html } = buildEmailBody(data);
    const subject = `Contact: ${data.name}`;

    const resend = new Resend(apiKey);
    const { data: sendData, error } = await resend.emails.send({
        from,
        to: [to],
        replyTo: data.email,
        subject,
        text,
        html,
    });

    if (error) {
        console.error("[contact] Resend error:", error);
        return NextResponse.json(
            { error: "Could not send email. Please try again later." },
            { status: 502 }
        );
    }

    return NextResponse.json({ ok: true, id: sendData?.id });
}
