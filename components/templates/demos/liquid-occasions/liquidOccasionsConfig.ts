export const LO_BASE = "/template/demo/liquid-occasions" as const;

export const LO_SITE = "Liquid Occasions";
export const LO_TAGLINE = "Your event starts with a dream";

export const LO_PATHS = {
  home: LO_BASE,
  journey: `${LO_BASE}/journey`,
  experiences: `${LO_BASE}/experiences`,
  portfolio: `${LO_BASE}/portfolio`,
  process: `${LO_BASE}/process`,
} as const;

export type LoNavKey = "gallery" | "journeys" | "about" | "contact";

export const LO_NAV_ITEMS: { key: LoNavKey; href: string; label: string }[] = [
  { key: "gallery", href: LO_PATHS.portfolio, label: "Gallery" },
  { key: "journeys", href: LO_PATHS.experiences, label: "Journeys" },
  { key: "about", href: LO_PATHS.process, label: "About" },
  { key: "contact", href: LO_PATHS.journey, label: "Contact" },
];

export function isLoNavActive(pathname: string, key: LoNavKey): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  switch (key) {
    case "gallery":
      return path === LO_PATHS.portfolio || path.startsWith(`${LO_PATHS.portfolio}/`);
    case "journeys":
      return (
        path === LO_PATHS.experiences ||
        path.startsWith(`${LO_PATHS.experiences}/`)
      );
    case "about":
      return path === LO_PATHS.process || path.startsWith(`${LO_PATHS.process}/`);
    case "contact":
      return path === LO_PATHS.journey || path.startsWith(`${LO_PATHS.journey}/`);
    default:
      return false;
  }
}
