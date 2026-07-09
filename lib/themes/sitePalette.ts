import type { SiteColorMode } from "@/lib/themes/siteTheme";

export const SITE_PALETTE_VARS = {
    primary: "--ng-primary",
    accent: "--ng-accent",
    teal: "--ng-teal",
    green: "--ng-green",
    coral: "--ng-coral",
    navy: "--ng-navy",
} as const;

export type SitePaletteColors = {
    primary: string;
    accent: string;
    teal: string;
    green: string;
    coral: string;
    navy: string;
};

export const SITE_PALETTE_FALLBACK: Record<SiteColorMode, SitePaletteColors> = {
    light: {
        primary: "#0A7DBA",
        accent: "#086193",
        teal: "#1A9E92",
        green: "#2FA875",
        coral: "#E5533D",
        navy: "#0B2540",
    },
    dark: {
        primary: "#60C4E3",
        accent: "#0A7DBA",
        teal: "#20B2A8",
        green: "#59D39A",
        coral: "#FF8A7A",
        navy: "#071729",
    },
};

export function readCssVariable(name: string, fallback = ""): string {
    if (typeof window === "undefined") return fallback;
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    return value || fallback;
}

export function getSitePalette(mode: SiteColorMode): SitePaletteColors {
    const fallback = SITE_PALETTE_FALLBACK[mode];
    if (typeof window === "undefined") return fallback;

    return {
        primary: readCssVariable(SITE_PALETTE_VARS.primary, fallback.primary),
        accent: readCssVariable(SITE_PALETTE_VARS.accent, fallback.accent),
        teal: readCssVariable(SITE_PALETTE_VARS.teal, fallback.teal),
        green: readCssVariable(SITE_PALETTE_VARS.green, fallback.green),
        coral: readCssVariable(SITE_PALETTE_VARS.coral, fallback.coral),
        navy: readCssVariable(SITE_PALETTE_VARS.navy, fallback.navy),
    };
}
