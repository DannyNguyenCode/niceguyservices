/**
 * Single source for canonical URLs, NAP, and structured data.
 * Set NEXT_PUBLIC_SITE_URL on production to a valid https origin
 * (for example https://niceguyservices.vercel.app) so sitemap, robots,
 * Open Graph, and JSON-LD stay aligned with Search Console.
 */
import { isDarkTheme, type SiteColorMode } from "@/lib/themes/siteTheme";

export const SITE_LOGO_LIGHT = "/niceguywebdesignlogo.png" as const;
export const SITE_LOGO_DARK = "/niceguywebdesignlogodark.png" as const;
/** Default logo for SEO and static contexts. */
export const SITE_LOGO = SITE_LOGO_LIGHT;

export const PRODUCTION_SITE_ORIGIN = "https://niceguyservices.vercel.app";

export function getSiteLogoForTheme(theme: SiteColorMode): string {
    return isDarkTheme(theme) ? SITE_LOGO_DARK : SITE_LOGO_LIGHT;
}

export const BUSINESS = {
    name: "Nice Guy Web Design",
    phoneDisplay: "(647) 760-3458",
    phoneE164: "+16477603458",
    email: "gbnguyenw@gmail.com",
    founderName: "Danny Nguyen",
    addressLocality: "Toronto",
    addressRegion: "ON",
    addressCountry: "CA",
    /** Human-readable service regions (no keyword stuffing). */
    areasServedLabels: ["Toronto, ON", "Greater Toronto Area (GTA)"],
    sameAs: [
        "https://www.linkedin.com/in/gia-bao-danny-nguyen/",
        "https://x.com/BaoGiaNguyen",
        "https://github.com/DannyNguyenCode",
    ],
} as const;

function isLocalhostHostname(hostname: string): boolean {
    const host = hostname.toLowerCase();
    return (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "[::1]" ||
        host === "::1" ||
        host.endsWith(".localhost")
    );
}

function isVercelPreviewHostname(hostname: string): boolean {
    const host = hostname.toLowerCase();
    if (host === "niceguyservices.vercel.app") {
        return false;
    }
    return host.endsWith(".vercel.app");
}

/**
 * Accept only an absolute https production origin for public SEO output.
 * Localhost, preview deployments, and invalid values are rejected.
 */
export function parseCanonicalSiteUrl(raw: string | undefined | null): string | null {
    const trimmed = raw?.trim();
    if (!trimmed) {
        return null;
    }

    let parsed: URL;
    try {
        parsed = new URL(trimmed);
    } catch {
        return null;
    }

    if (parsed.protocol !== "https:") {
        return null;
    }
    if (isLocalhostHostname(parsed.hostname)) {
        return null;
    }
    if (isVercelPreviewHostname(parsed.hostname)) {
        return null;
    }

    return parsed.origin.replace(/\/$/, "");
}

export function getSiteUrl(): string {
    return parseCanonicalSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? PRODUCTION_SITE_ORIGIN;
}

export function absoluteUrl(path: string): string {
    const base = getSiteUrl();
    if (!path || path === "/") {
        return `${base}/`;
    }
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalized}`;
}
