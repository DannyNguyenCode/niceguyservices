export const KC_BASE = "/template/demo/kinship-capital" as const;

export const KC_SITE = "Heritage Financial";
export const KC_TAGLINE = "Kinship & Capital";
export const KC_PHONE = "+1 (800) 555-0192";
export const KC_PHONE_HREF = "tel:+18005550192";
export const KC_EMAIL = "concierge@heritage.com";
export const KC_ADDRESS = "742 Heritage Oaks Way, Suite 200, Greenwich, CT";

export const KC_PATHS = {
  home: KC_BASE,
  services: `${KC_BASE}/services`,
  pricing: `${KC_BASE}/pricing`,
  about: `${KC_BASE}/about`,
  faq: `${KC_BASE}/faq`,
  contact: `${KC_BASE}/contact`,
} as const;

export type KcNavKey = "home" | "services" | "pricing" | "about" | "faq" | "contact";

export const KC_NAV_ITEMS: { key: KcNavKey; href: string; label: string }[] = [
  { key: "home", href: KC_PATHS.home, label: "Home" },
  { key: "services", href: KC_PATHS.services, label: "Services" },
  { key: "pricing", href: KC_PATHS.pricing, label: "Pricing" },
  { key: "about", href: KC_PATHS.about, label: "About" },
  { key: "faq", href: KC_PATHS.faq, label: "FAQ" },
  { key: "contact", href: KC_PATHS.contact, label: "Contact" },
];

export function isKcNavActive(pathname: string, key: KcNavKey): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const href = KC_NAV_ITEMS.find((item) => item.key === key)?.href ?? KC_BASE;
  const target = href.replace(/\/$/, "") || "/";
  if (target === KC_BASE) return path === KC_BASE;
  return path === target || path.startsWith(`${target}/`);
}
