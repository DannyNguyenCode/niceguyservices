import { Resend } from "resend";
import { NextResponse } from "next/server";

import type { BusinessIntakeData, ScopeLine } from "@/lib/businessIntake/types";

export const dynamic = "force-dynamic";

const DEFAULT_TO = "gbnguyenw@gmail.com";

type Body = {
    data: BusinessIntakeData;
    contact?: {
        name?: string;
        email?: string;
    };
};

function isScopeLine(x: unknown): x is ScopeLine {
    if (!x || typeof x !== "object") return false;
    const o = x as Record<string, unknown>;
    return (
        typeof o.id === "string" &&
        typeof o.name === "string" &&
        typeof o.description === "string" &&
        typeof o.pricingModel === "string" &&
        typeof o.rate === "string"
    );
}

function validateData(d: unknown): d is BusinessIntakeData {
    if (!d || typeof d !== "object") return false;
    const o = d as Record<string, unknown>;
    const c = o.company;
    if (!c || typeof c !== "object") return false;
    const co = c as Record<string, unknown>;
    if (typeof co.businessName !== "string" || !co.businessName.trim()) return false;
    if (typeof co.industry !== "string" || !co.industry.trim()) return false;
    if (typeof co.yearsInOperation !== "string") return false;
    if (typeof co.location !== "string" || !co.location.trim()) return false;
    if (!Array.isArray(o.scopeLines) || !o.scopeLines.every(isScopeLine)) {
        return false;
    }
    if (
        !o.scopeLines.some(
            (l) => isScopeLine(l) && l.name.trim() && l.description.trim()
        )
    ) {
        return false;
    }
    const g = o.goals;
    if (!g || typeof g !== "object") return false;
    const go = g as Record<string, unknown>;
    if (typeof go.seo !== "boolean" || typeof go.leads !== "boolean") return false;
    if (typeof go.brand !== "boolean" || typeof go.performance !== "boolean") {
        return false;
    }
    if (!go.seo && !go.leads && !go.brand && !go.performance) {
        return false;
    }
    if (
        o.visualStyle !== "modern" &&
        o.visualStyle !== "professional" &&
        o.visualStyle !== "creative" &&
        o.visualStyle !== ""
    )
        return false;
    if (o.visualStyle === "") return false;
    if (!Array.isArray(o.additionalPages) || !o.additionalPages.every((p) => typeof p === "string")) return false;
    return true;
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatGoals(goals: BusinessIntakeData["goals"]): string {
    const bits: string[] = [];
    if (goals.seo) bits.push("SEO / organic traffic");
    if (goals.leads) bits.push("Lead generation");
    if (goals.brand) bits.push("Brand & portfolio");
    if (goals.performance) bits.push("Performance & speed");
    return bits.length ? bits.join(", ") : "—";
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
            { error: "Please complete all required business intake fields." },
            { status: 400 }
        );
    }

    const d = p.data;
    const scopeText = d.scopeLines
        .map(
            (l, i) =>
                `  ${i + 1}. ${l.name || "—"}\n     ${l.pricingModel} / ${l.rate || "—"}\n     ${(l.description || "—").replace(/\n/g, " ")}`
        )
        .join("\n");

    const textLines: string[] = [
        "Business website intake (3-step form)",
        "",
    ];
    if (p.contact?.name) textLines.push(`From contact: ${p.contact.name}`);
    if (p.contact?.email) textLines.push(`Email: ${p.contact.email}`);
    if (p.contact?.name || p.contact?.email) textLines.push("");
    textLines.push(
        "Company",
        `  Name: ${d.company.businessName}`,
        `  Industry: ${d.company.industry}`,
        `  Years in operation: ${d.company.yearsInOperation || "—"}`,
        `  Location: ${d.company.location}`,
        "",
        "Scope lines",
        scopeText,
        "",
        "Goals",
        `  ${formatGoals(d.goals)}`,
        `  Visual style: ${d.visualStyle}`,
        "",
        "Extra pages (beyond Home, Contact — fixed)",
        d.additionalPages.length ? d.additionalPages.map((x) => `  • ${x}`).join("\n") : "  —"
    );
    const text = textLines.join("\n");

    const row = (label: string, value: string) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`;

    const html = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#2c2f30;">
<h2 style="margin:0 0 16px;">Business website intake</h2>
${p.contact?.name || p.contact?.email
            ? `<p style="margin:0 0 8px;">${[p.contact?.name, p.contact?.email]
                .filter((v): v is string => Boolean(v && typeof v === "string"))
                .map(escapeHtml)
                .join(" — ")}</p>`
            : ""}
<table style="border-collapse:collapse;margin-bottom:20px;max-width:100%;">
${row("Business", d.company.businessName)}
${row("Industry", d.company.industry)}
${row("Years in operation", d.company.yearsInOperation || "—")}
${row("Location", d.company.location)}
${row("Goals", formatGoals(d.goals))}
${row("Visual style", d.visualStyle)}
</table>
<p style="font-weight:600;margin:0 0 8px;">Scope</p>
<pre style="margin:0;white-space:pre-wrap;font-family:ui-monospace,monospace;font-size:12px;">${escapeHtml(
                d.scopeLines
                    .map(
                        (l) =>
                            `${l.name} | ${l.pricingModel} | ${l.rate}\n${l.description}`
                    )
                    .join("\n\n")
            )}</pre>
${d.additionalPages.length
            ? `<p style="font-weight:600;margin:16px 0 8px;">Extra pages</p><ul style="margin:0;">${d.additionalPages.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>`
            : ""
        }
</body></html>`;

    const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO;
    const from =
        process.env.RESEND_FROM?.trim() ||
        "Nice Guy Web Design <onboarding@resend.dev>";
    const subject = `Business intake: ${d.company.businessName}`;

    const resend = new Resend(apiKey);
    const { data: sendData, error } = await resend.emails.send({
        from,
        to: [to],
        subject,
        text,
        html,
    });

    if (error) {
        console.error("[business-intake] Resend error:", error);
        return NextResponse.json(
            { error: "Could not send email. Please try again later." },
            { status: 502 }
        );
    }

    return NextResponse.json({ ok: true, id: sendData?.id });
}
