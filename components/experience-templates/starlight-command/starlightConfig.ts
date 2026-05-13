export const STARLIGHT_BASE = "/template/demo/starlight-command" as const;

/** Fictional contractor shown in chrome and copy (legacy route folder: starlight-command). */
export const STARLIGHT_SITE = "ARCADE TRADES";
export const STARLIGHT_BRAND_SENTENCE = "Arcade Trades";
export const STARLIGHT_OPS_EMAIL = "ops@arcadetrades.demo";
export const STARLIGHT_HQ_EMAIL_DISPLAY = "HQ@ARCADETRADES.COM";
export const STARLIGHT_COPYRIGHT_LINE = "© 2024 ARCADE TRADES (DEMO)";
export const STARLIGHT_COPYRIGHT_ENTITY = "ARCADE TRADES INDUSTRIAL (DEMO)";

export const STARLIGHT_PATHS = {
  home: STARLIGHT_BASE,
  services: `${STARLIGHT_BASE}/services`,
  work: `${STARLIGHT_BASE}/work`,
  contact: `${STARLIGHT_BASE}/contact`,
  about: `${STARLIGHT_BASE}/about`,
  testimonials: `${STARLIGHT_BASE}/testimonials`,
} as const;

/** Primary chrome nav (matches mock top + bottom bars). */
export const STARLIGHT_NAV_PRIMARY = [
  { href: STARLIGHT_PATHS.home, label: "HOME", icon: "home" as const, key: "home" as const },
  { href: STARLIGHT_PATHS.services, label: "SERVICES", icon: "settings_input_component" as const, key: "services" as const },
  { href: STARLIGHT_PATHS.work, label: "WORK", icon: "construction" as const, key: "work" as const },
  { href: STARLIGHT_PATHS.contact, label: "CONTACT", icon: "contact_emergency" as const, key: "contact" as const },
] as const;

export type StarlightNavKey = (typeof STARLIGHT_NAV_PRIMARY)[number]["key"];

export function starlightNavKeyFromPathname(pathname: string): StarlightNavKey | null {
  const path = pathname.replace(/\/$/, "") || "/";
  const base = STARLIGHT_BASE.replace(/\/$/, "") || "/";
  if (path === base) {
    return "home";
  }
  if (path.startsWith(`${base}/services`)) {
    return "services";
  }
  if (path.startsWith(`${base}/work`)) {
    return "work";
  }
  if (path.startsWith(`${base}/contact`)) {
    return "contact";
  }
  return null;
}

export const STARLIGHT_NAV_DESKTOP_EXTRA = [
  { href: STARLIGHT_PATHS.about, label: "ABOUT" },
  { href: STARLIGHT_PATHS.testimonials, label: "REPUTATION" },
] as const;

export function isStarlightExtraNavActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  return path === target || path.startsWith(`${target}/`);
}
