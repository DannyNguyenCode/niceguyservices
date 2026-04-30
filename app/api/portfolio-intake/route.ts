import { Resend } from "resend";
import { NextResponse } from "next/server";

import type { PortfolioIntakeData } from "@/lib/portfolioIntake/types";

export const dynamic = "force-dynamic";

const DEFAULT_TO = "gbnguyenw@gmail.com";

type Body = {
    data: PortfolioIntakeData;
    contact?: { name?: string; email?: string };
};

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function isNonEmpty(s: string): boolean {
    return typeof s === "string" && s.trim().length > 0;
}

function validateData(d: unknown): d is PortfolioIntakeData {
    if (!d || typeof d !== "object") return false;
    const p = d as Record<string, unknown>;
    if (!p.contactReview || typeof p.contactReview !== "object") return false;
    const c = p.contactReview as Record<string, unknown>;
    if (!isNonEmpty(String(c.email ?? ""))) return false;
    if (!isNonEmpty(String(c.fullName ?? ""))) return false;
    if (!p.experience || typeof p.experience !== "object") return false;
    if (!p.skills || typeof p.skills !== "object") return false;
    if (!p.education || typeof p.education !== "object") return false;
    return true;
}

function formatData(d: PortfolioIntakeData): string {
    const lines: string[] = [
        "PORTFOLIO / SHOWCASE INTAKE",
        "",
        "== Contact & hero ==",
        `Name: ${d.contactReview.fullName}`,
        `Title: ${d.contactReview.professionalTitle}`,
        `Email: ${d.contactReview.email}`,
        `Location: ${d.contactReview.location}`,
        `Availability: ${d.contactReview.availability}`,
        `LinkedIn: ${d.contactReview.linkedin || "—"}`,
        `Other social: ${d.contactReview.social || "—"}`,
        "",
        "Summary:",
        d.contactReview.summary,
        "",
        "== Experience ==",
    ];
    d.experience.entries.forEach((e, i) => {
        const range = e.present
            ? `${e.startMonth} – present`
            : `${e.startMonth} – ${e.endMonth || "?"}`;
        lines.push(
            `${i + 1}. ${e.jobTitle} at ${e.company} (${range})`,
            e.description
        );
        if (e.impacts.length) {
            lines.push("  Key impacts:");
            e.impacts.forEach((m) => {
                lines.push(`    ${m.value} — ${m.label}`);
            });
        }
    });
    if (d.experience.entries.length === 0) {
        lines.push("— (none provided)");
    }
    if (d.experience.impacts.length > 0) {
        lines.push(
            "",
            "Key impacts (not yet on a role — from add form):",
            ...d.experience.impacts.map(
                (m) => `  ${m.value} — ${m.label}`
            )
        );
    }
    lines.push("", "== Skills ==");
    d.skills.categories.forEach((s, i) => {
        lines.push(
            `${i + 1}. ${s.name || "—"}`,
            s.description,
            `Tools: ${s.tools.length ? s.tools.join(", ") : "—"}`,
            `Idiom: ${s.idiom || "—"}`,
            ""
        );
    });
    if (d.skills.categories.length === 0) {
        lines.push("— (none provided)", "");
    }
    lines.push("== Education ==");
    d.education.entries.forEach((e, i) => {
        lines.push(
            `${i + 1}. ${e.institution} — ${e.degree} (${e.graduationYear || "—"})`,
            `Thesis / focus: ${e.thesis || "—"}`,
            `Honors: ${e.honors.length ? e.honors.join(", ") : "—"}`,
            `Relevant study: ${e.curriculum.length ? e.curriculum.join(", ") : "—"}`,
            ""
        );
    });
    return lines.join("\n");
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

    const p = body as Body;
    if (!validateData(p.data)) {
        return NextResponse.json(
            { error: "Name, email, and a complete brief are required." },
            { status: 400 }
        );
    }

    const d = p.data;
    const text = [
        p.contact?.name && `Referrer: ${p.contact.name}`,
        p.contact?.email && `Contact prefill: ${p.contact.email}`,
        "",
        formatData(d),
    ]
        .filter((x) => x)
        .join("\n");
    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#2c2f30;">
<h2>Portfolio / showcase intake</h2>
<pre style="white-space:pre-wrap;font-size:14px;">${escapeHtml(text)}</pre>
</body></html>`;
    const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
    const from =
        process.env.RESEND_FROM?.trim() ||
        "Nice Guy Web Design <onboarding@resend.dev>";
    const subject = `Portfolio intake: ${d.contactReview.fullName}`;

    const resend = new Resend(apiKey);
    const { data: sendData, error } = await resend.emails.send({
        from,
        to: [to],
        subject,
        text,
        html,
        replyTo: d.contactReview.email.trim() || undefined,
    });

    if (error) {
        console.error("[portfolio-intake] Resend error:", error);
        return NextResponse.json(
            { error: "Could not send email. Please try again later." },
            { status: 502 }
        );
    }

    return NextResponse.json({ ok: true, id: sendData?.id });
}
