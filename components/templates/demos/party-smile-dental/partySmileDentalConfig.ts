export const PSD_BASE = "/template/demo/party-smile-dental" as const;

export const PSD_SITE = "Smile Board Family Dental";
export const PSD_TAGLINE = "Family dental care that feels like a team win";
export const PSD_PHONE = "(416) 555-0182";
export const PSD_PHONE_HREF = "tel:+14165550182";
export const PSD_EMAIL = "hello@smileboard.dental.demo";
export const PSD_ADDRESS = "248 Tile Street, Toronto, ON M5V 2K4";
export const PSD_HOURS = "Mon–Fri 8am–6pm · Sat 9am–2pm · Sun Emergency only";

export const PSD_PATHS = {
  home: PSD_BASE,
  about: `${PSD_BASE}/about`,
  forms: `${PSD_BASE}/forms`,
  services: `${PSD_BASE}/services`,
  testimonials: `${PSD_BASE}/testimonials`,
  faq: `${PSD_BASE}/faq`,
  contact: `${PSD_BASE}/contact`,
  book: `${PSD_BASE}/book`,
} as const;

export const PSD_HOME_FAQ_ID = "faq" as const;

export const PSD_NAV_ITEMS = [
  { href: PSD_PATHS.home, label: "Home" },
  { href: PSD_PATHS.about, label: "About Us" },
  { href: PSD_PATHS.services, label: "Services" },
  { href: PSD_PATHS.forms, label: "Dental Forms" },
  { href: PSD_PATHS.testimonials, label: "Testimonials" },
  { href: PSD_PATHS.faq, label: "FAQ" },
  { href: PSD_PATHS.contact, label: "Contact" },
] as const;

export function isPsdNavActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const [targetPath] = href.split("#");
  const target = targetPath.replace(/\/$/, "") || "/";
  const base = PSD_BASE.replace(/\/$/, "") || "/";
  if (target === base) {
    return path === base;
  }
  return path === target || path.startsWith(`${target}/`);
}
