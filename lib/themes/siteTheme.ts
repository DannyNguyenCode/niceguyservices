export type SiteColorMode = "light" | "dark";

export function parseStoredColorMode(raw: string | undefined): SiteColorMode {
    if (!raw) return "light";
    const v = raw.toLowerCase();
    if (v === "dark" || v === "luxury") return "dark";
    return "light";
}
