export const CP_BASE = "/template/demo/companion-pet" as const;

export const CP_SITE = "Companion";
export const CP_TAGLINE = "Premium pet care, intelligently personalized";
export const CP_PHONE = "(416) 555-0194";
export const CP_PHONE_HREF = "tel:+14165550194";
export const CP_EMAIL = "hello@companion.pet.demo";
export const CP_ADDRESS = "420 Wellness Way, Toronto, ON M5V 3K2";

export const CP_PATHS = {
  home: CP_BASE,
  shop: `${CP_BASE}/shop`,
  rewards: `${CP_BASE}/rewards`,
  resources: `${CP_BASE}/resources`,
  account: `${CP_BASE}/account`,
  checkout: `${CP_BASE}/checkout`,
  login: `${CP_BASE}/login`,
  databaseError: `${CP_BASE}/database-error`,
} as const;

/** Shared pet market demo admin (seeded on first auth request). */
export const CP_DEMO_ADMIN = {
  email: "admin@petmarket.local",
  password: "admin",
} as const;

export const CP_NAV_ITEMS = [
  { href: CP_PATHS.home, label: "Home" },
  { href: CP_PATHS.shop, label: "Shop" },
  { href: CP_PATHS.rewards, label: "Rewards" },
  { href: CP_PATHS.resources, label: "Resources" },
  { href: CP_PATHS.account, label: "Account" },
] as const;

export function isCpNavActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const [targetPath] = href.split("#");
  const target = targetPath.replace(/\/$/, "") || "/";
  const base = CP_BASE.replace(/\/$/, "") || "/";
  if (target === base) return path === base;
  return path === target || path.startsWith(`${target}/`);
}
