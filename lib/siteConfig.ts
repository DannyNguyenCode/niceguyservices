/**
 * Single source for canonical URLs, NAP, and structured data.
 * Set NEXT_PUBLIC_SITE_URL on production (e.g. https://yourdomain.com) so
 * sitemap, robots, Open Graph, and JSON-LD stay aligned with Search Console.
 */
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

export function getSiteUrl(): string {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (fromEnv) {
        return fromEnv.replace(/\/$/, "");
    }
    const vercel = process.env.VERCEL_URL?.trim();
    if (vercel) {
        const host = vercel.replace(/^https?:\/\//i, "");
        return `https://${host}`;
    }
    return "https://niceguyservices.vercel.app";
}

export function absoluteUrl(path: string): string {
    const base = getSiteUrl();
    if (!path || path === "/") {
        return `${base}/`;
    }
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalized}`;
}
