import { LAS_NAV, LAS_SITE } from "./leaveASparkSiteContent";

export const LAS_BASE = "/template/demo/spark-frame" as const;

export const LAS_SITE_NAME = LAS_SITE.name;
export const LAS_TAGLINE = LAS_SITE.tagline;

export const LAS_PATHS = {
  home: LAS_BASE,
  services: `${LAS_BASE}/services`,
  projects: `${LAS_BASE}/projects`,
  about: `${LAS_BASE}/about`,
  resources: `${LAS_BASE}/resources`,
  contact: `${LAS_BASE}/contact`,
} as const;

export function lasServicePath(slug: string): string {
  return `${LAS_BASE}/services/${slug}`;
}

export function lasResourcePath(slug: string): string {
  return `${LAS_BASE}/resources/${slug}`;
}

export type LasNavKey = "services" | "projects" | "about" | "resources" | "contact";

export const LAS_NAV_ITEMS = LAS_NAV.map((item) => ({
  ...item,
  href: `${LAS_BASE}${item.href}`,
})) as { key: LasNavKey; label: string; href: string }[];

export function lasPath(relative: string): string {
  if (relative.startsWith("http") || relative.startsWith(LAS_BASE)) return relative;
  if (relative === "/" || relative === "") return LAS_BASE;
  return `${LAS_BASE}${relative.startsWith("/") ? relative : `/${relative}`}`;
}

export function isLasNavActive(pathname: string, key: LasNavKey): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const item = LAS_NAV_ITEMS.find((nav) => nav.key === key);
  const target = (item?.href ?? LAS_BASE).replace(/\/$/, "") || "/";
  if (key === "services") return path === target || path.startsWith(`${target}/`);
  return path === target || path.startsWith(`${target}/`);
}

export function lasPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${LAS_SITE_NAME} (demo)`;
}

export function lasDemoMetadataTitle(pageTitle: string): string {
  return `${pageTitle} — ${LAS_SITE_NAME} (demo) | Nice Guy Web Design`;
}
