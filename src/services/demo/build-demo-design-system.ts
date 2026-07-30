import type { DemoApprovedFacts, DemoVisualDirection } from "@/src/services/demo/types";

const DIRECTION_PALETTES: Record<
    DemoVisualDirection,
    {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        mutedText: string;
        headingFamily: string;
        bodyFamily: string;
        radius: string;
        elevation: string;
        spacing: string;
    }
> = {
    "modern-professional": {
        primary: "#1f4b99",
        secondary: "#0f766e",
        accent: "#f59e0b",
        background: "#f8fafc",
        surface: "#ffffff",
        text: "#0f172a",
        mutedText: "#475569",
        headingFamily: "Inter, system-ui, sans-serif",
        bodyFamily: "Inter, system-ui, sans-serif",
        radius: "0.75rem",
        elevation: "shadow-md",
        spacing: "comfortable",
    },
    "warm-trustworthy": {
        primary: "#9a3412",
        secondary: "#166534",
        accent: "#ca8a04",
        background: "#fff7ed",
        surface: "#ffffff",
        text: "#292524",
        mutedText: "#57534e",
        headingFamily: "Georgia, serif",
        bodyFamily: "Inter, system-ui, sans-serif",
        radius: "1rem",
        elevation: "shadow-sm",
        spacing: "relaxed",
    },
    "bold-conversion": {
        primary: "#b91c1c",
        secondary: "#1d4ed8",
        accent: "#f97316",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#111827",
        mutedText: "#4b5563",
        headingFamily: "Inter, system-ui, sans-serif",
        bodyFamily: "Inter, system-ui, sans-serif",
        radius: "0.5rem",
        elevation: "shadow-lg",
        spacing: "compact",
    },
    "clean-minimal": {
        primary: "#111827",
        secondary: "#6b7280",
        accent: "#2563eb",
        background: "#ffffff",
        surface: "#f9fafb",
        text: "#111827",
        mutedText: "#6b7280",
        headingFamily: "Inter, system-ui, sans-serif",
        bodyFamily: "Inter, system-ui, sans-serif",
        radius: "0.375rem",
        elevation: "shadow-sm",
        spacing: "airy",
    },
    custom: {
        primary: "#334155",
        secondary: "#0f766e",
        accent: "#eab308",
        background: "#f8fafc",
        surface: "#ffffff",
        text: "#0f172a",
        mutedText: "#64748b",
        headingFamily: "Inter, system-ui, sans-serif",
        bodyFamily: "Inter, system-ui, sans-serif",
        radius: "0.75rem",
        elevation: "shadow-md",
        spacing: "balanced",
    },
};

export function buildDemoDesignSystem(input: {
    visualDirection: DemoVisualDirection;
    approvedBrandColours?: Partial<{
        primary: string;
        secondary: string;
        accent: string;
    }> | null;
}) {
    const base = DIRECTION_PALETTES[input.visualDirection] ?? DIRECTION_PALETTES["modern-professional"];

    return {
        palette: {
            primary: input.approvedBrandColours?.primary ?? base.primary,
            secondary: input.approvedBrandColours?.secondary ?? base.secondary,
            accent: input.approvedBrandColours?.accent ?? base.accent,
            background: base.background,
            surface: base.surface,
            text: base.text,
            mutedText: base.mutedText,
        },
        typography: {
            headingFamily: base.headingFamily,
            bodyFamily: base.bodyFamily,
            scale: "moderate",
        },
        radius: base.radius,
        elevation: base.elevation,
        spacing: base.spacing,
    };
}

export function resolvePlaceholderFields(
    approvedFacts: DemoApprovedFacts,
    business: {
        name?: string | null;
        industry?: string | null;
        location?: string | null;
        phone?: string | null;
        email?: string | null;
        services?: string[] | null;
    },
): string[] {
    const placeholders: string[] = [];
    if (!approvedFacts.businessName || !business.name?.trim()) placeholders.push("businessName");
    if (!approvedFacts.industry || !business.industry?.trim()) placeholders.push("industry");
    if (!approvedFacts.location || !business.location?.trim()) placeholders.push("location");
    if (!approvedFacts.contactInformation || !business.phone?.trim()) placeholders.push("phone");
    if (!approvedFacts.contactInformation || !business.email?.trim()) placeholders.push("email");
    if (!approvedFacts.services || !business.services?.length) placeholders.push("services");
    return placeholders;
}

export function resolveVerifiedFacts(
    approvedFacts: DemoApprovedFacts,
    business: {
        name?: string | null;
        industry?: string | null;
        location?: string | null;
        phone?: string | null;
        email?: string | null;
        services?: string[] | null;
        domain?: string | null;
    },
): Record<string, unknown> {
    const facts: Record<string, unknown> = {};
    if (approvedFacts.businessName && business.name?.trim()) facts.businessName = business.name.trim();
    if (approvedFacts.industry && business.industry?.trim()) facts.industry = business.industry.trim();
    if (approvedFacts.location && business.location?.trim()) facts.location = business.location.trim();
    if (approvedFacts.contactInformation && business.phone?.trim()) facts.phone = business.phone.trim();
    if (approvedFacts.contactInformation && business.email?.trim()) facts.email = business.email.trim();
    if (approvedFacts.services && business.services?.length) facts.services = business.services;
    if (business.domain?.trim()) facts.domain = business.domain.trim();
    return facts;
}

export function resolveDefaultContentMode(
    approvedFacts: DemoApprovedFacts,
    verifiedFacts: Record<string, unknown>,
): "placeholder-only" | "approved-facts-only" | "approved-facts-with-rewritten-copy" {
    const hasSufficientFacts =
        Boolean(verifiedFacts.businessName) &&
        (Boolean(verifiedFacts.industry) ||
            Boolean(verifiedFacts.location) ||
            Boolean(verifiedFacts.services));
    return hasSufficientFacts ? "approved-facts-with-rewritten-copy" : "placeholder-only";
}
