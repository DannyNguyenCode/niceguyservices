import { PPE_NAV, PPE_SITE } from "./powerPelletElectricSiteContent";

export const PPE_BASE = "/template/demo/power-pellet-electric" as const;

export const PPE_SITE_NAME = PPE_SITE.name;
export const PPE_TAGLINE = PPE_SITE.tagline;

export const PPE_PATHS = {
  home: PPE_BASE,
  services: `${PPE_BASE}/services`,
  about: `${PPE_BASE}/about`,
  resources: `${PPE_BASE}/resources`,
  contact: `${PPE_BASE}/contact`,
} as const;

export function ppeServicePath(slug: string): string {
  return `${PPE_BASE}/services/${slug}`;
}

export type PpeNavKey = "home" | "services" | "about" | "resources" | "contact";

export const PPE_NAV_ITEMS = PPE_NAV.map((item) => ({
  ...item,
  href: `${PPE_BASE}${item.href === "/" ? "" : item.href}`,
})) as { key: PpeNavKey; label: string; href: string }[];

export function ppePath(relative: string): string {
  if (relative.startsWith("http") || relative.startsWith(PPE_BASE)) return relative;
  if (relative === "/" || relative === "") return PPE_BASE;
  return `${PPE_BASE}${relative.startsWith("/") ? relative : `/${relative}`}`;
}

export function isPpeNavActive(pathname: string, key: PpeNavKey): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const item = PPE_NAV_ITEMS.find((nav) => nav.key === key);
  const target = (item?.href ?? PPE_BASE).replace(/\/$/, "") || "/";
  if (key === "home") return path === PPE_BASE;
  if (key === "services") return path === target || path.startsWith(`${target}/`);
  return path === target || path.startsWith(`${target}/`);
}

export function ppePageTitle(pageTitle: string): string {
  return `${pageTitle} | ${PPE_SITE_NAME} (demo)`;
}

export function ppeDemoMetadataTitle(pageTitle: string): string {
  return `${pageTitle} — ${PPE_SITE_NAME} (demo) | Nice Guy Web Design`;
}
