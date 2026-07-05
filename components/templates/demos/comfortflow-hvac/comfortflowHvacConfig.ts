import { CFH_NAV, CFH_SITE } from "./comfortflowHvacSiteContent";

export const CFH_BASE = "/template/demo/comfortflow-hvac" as const;

export const CFH_SITE_NAME = CFH_SITE.name;
export const CFH_TAGLINE = CFH_SITE.tagline;
export const CFH_PHONE = CFH_SITE.phone;
export const CFH_PHONE_HREF = CFH_SITE.phoneHref;
export const CFH_EMAIL = CFH_SITE.email;

export const CFH_PATHS = {
  home: CFH_BASE,
  about: `${CFH_BASE}/about`,
  contact: `${CFH_BASE}/contact`,
  resources: `${CFH_BASE}/resources`,
  maintenancePlans: `${CFH_BASE}/services/maintenance-plans`,
  heating: `${CFH_BASE}/services/heating`,
  cooling: `${CFH_BASE}/services/cooling`,
  airQuality: `${CFH_BASE}/services/air-quality`,
  waterHeaters: `${CFH_BASE}/services/water-heaters`,
  smartThermostats: `${CFH_BASE}/services/smart-thermostats`,
} as const;

export const CFH_SERVICE_LINKS = [
  { label: "Heating Solutions", href: CFH_PATHS.heating, dot: "bg-[var(--cfh-heating-accent)]" },
  { label: "Cooling Systems", href: CFH_PATHS.cooling, dot: "bg-[var(--cfh-cooling-accent)]" },
  { label: "Air Quality Control", href: CFH_PATHS.airQuality, dot: "bg-[var(--cfh-air-quality-accent)]" },
  { label: "Smart Thermostats", href: CFH_PATHS.smartThermostats, dot: "bg-[#FACC15]" },
  { label: "Water Heaters", href: CFH_PATHS.waterHeaters, dot: "bg-[var(--cfh-water-accent)]" },
  { label: "Maintenance & Ductwork", href: CFH_PATHS.maintenancePlans, dot: "bg-[var(--cfh-brand-indigo)]" },
] as const;

export type CfhNavKey = "home" | "services" | "about" | "resources" | "contact";

export const CFH_NAV_ITEMS = CFH_NAV.map((item) => ({
  ...item,
  href: `${CFH_BASE}${item.href === "/" ? "" : item.href}`,
})) as { key: CfhNavKey; label: string; href: string }[];

export function cfhPath(relative: string): string {
  if (relative.startsWith("http") || relative.startsWith(CFH_BASE)) return relative;
  if (relative === "/" || relative === "") return CFH_BASE;
  return `${CFH_BASE}${relative.startsWith("/") ? relative : `/${relative}`}`;
}

export function cfhServicePath(slug: string): string {
  return `${CFH_BASE}/services/${slug}`;
}

export function isCfhNavActive(pathname: string, key: CfhNavKey): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  if (key === "home") return path === CFH_BASE;
  if (key === "services") {
    return path.startsWith(`${CFH_BASE}/services`);
  }
  const item = CFH_NAV_ITEMS.find((nav) => nav.key === key);
  const target = (item?.href ?? CFH_BASE).replace(/\/$/, "") || "/";
  return path === target || path.startsWith(`${target}/`);
}

export function cfhPageTitle(pageTitle: string): string {
  return `${pageTitle} | ${CFH_SITE_NAME} (demo)`;
}

export function cfhDemoMetadataTitle(pageTitle: string): string {
  return `${pageTitle} — ${CFH_SITE_NAME} (demo) | Nice Guy Web Design`;
}

export const CFH_SERVICE_SLUGS = [
  "maintenance-plans",
  "heating",
  "cooling",
  "air-quality",
  "water-heaters",
  "smart-thermostats",
] as const;

export type CfhServiceSlug = (typeof CFH_SERVICE_SLUGS)[number];
