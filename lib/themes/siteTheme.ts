export type SiteColorMode = "light" | "dark";

export type SiteDataTheme = "niceguys-light" | "niceguys-dark";

export function parseStoredColorMode(raw: string | undefined): SiteColorMode {
    if (!raw) return "dark";
    const v = raw.toLowerCase();
    if (v === "light") return "light";
    if (v === "dark" || v === "luxury") return "dark";
    return "dark";
}

export function isDarkTheme(theme: SiteColorMode): boolean {
    return theme === "dark";
}

export function dataThemeName(theme: SiteColorMode): SiteDataTheme {
    return isDarkTheme(theme) ? "niceguys-dark" : "niceguys-light";
}
