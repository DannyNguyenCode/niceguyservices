export const EVERGREEN_BASE = "/template/demo/evergreen-alpine" as const;

export const EVERGREEN_PATHS = {
  home: EVERGREEN_BASE,
  manage: `${EVERGREEN_BASE}#overview`,
  contact: `${EVERGREEN_BASE}#contact`,
  portfolio: `${EVERGREEN_BASE}#portfolio`,
  howWeWork: `${EVERGREEN_BASE}#how-we-work`,
  whyChooseUs: `${EVERGREEN_BASE}#why-choose-us`,
  reviews: `${EVERGREEN_BASE}#reviews`,
  seasons: `${EVERGREEN_BASE}#seasons`,
  spring: `${EVERGREEN_BASE}#spring`,
  summer: `${EVERGREEN_BASE}#summer`,
  fall: `${EVERGREEN_BASE}#fall`,
  winter: `${EVERGREEN_BASE}#winter`,
} as const;

export const EVERGREEN_PHONE = "(555) 482-0194";
export const EVERGREEN_EMAIL = "estimates@evergreen-alpine.demo";

export type EvergreenNavItem = {
  href: string;
  label: string;
  icon: string;
};

/** Section ids in page scroll order (SPA scroll-spy). */
export const EVERGREEN_SCROLL_SECTION_ORDER = [
  "spring",
  "summer",
  "fall",
  "winter",
  "portfolio",
  "why-choose-us",
  "how-we-work",
  "reviews",
  "contact",
] as const;

export type EvergreenScrollSectionId = (typeof EVERGREEN_SCROLL_SECTION_ORDER)[number];

export type EvergreenNavKey = "home" | "manage" | "seasons" | "portfolio" | "whyChooseUs" | "howWeWork" | "reviews" | "contact";

export const EVERGREEN_SEASON_NAV: readonly EvergreenNavItem[] = [
  { href: EVERGREEN_PATHS.spring, label: "Spring", icon: "eco" },
  { href: EVERGREEN_PATHS.summer, label: "Summer", icon: "sunny" },
  { href: EVERGREEN_PATHS.fall, label: "Fall", icon: "nature" },
  { href: EVERGREEN_PATHS.winter, label: "Winter", icon: "ac_unit" },
] as const;

export const EVERGREEN_FOOTER_SERVICES = [
  { href: EVERGREEN_PATHS.spring, label: "Spring Services" },
  { href: EVERGREEN_PATHS.summer, label: "Summer Services" },
  { href: EVERGREEN_PATHS.fall, label: "Fall Services" },
  { href: EVERGREEN_PATHS.winter, label: "Winter Services" },
] as const;

export const EVERGREEN_FOOTER_COMPANY = [
  { href: EVERGREEN_PATHS.whyChooseUs, label: "Why Choose Us" },
  { href: EVERGREEN_PATHS.howWeWork, label: "How We Work" },
  { href: EVERGREEN_PATHS.reviews, label: "Who We Have Helped" },
  { href: EVERGREEN_PATHS.contact, label: "Where to Contact" },
] as const;

export const EVERGREEN_PRIMARY_NAV = [
  // { href: EVERGREEN_PATHS.manage, label: "Property Overview", icon: "home_work" as const },
  { href: EVERGREEN_PATHS.portfolio, label: "What We Achieved", icon: "photo_library" as const },
  { href: EVERGREEN_PATHS.whyChooseUs, label: "Why Choose Us", icon: "verified" as const },
  { href: EVERGREEN_PATHS.howWeWork, label: "How We Work", icon: "route" as const },
  { href: EVERGREEN_PATHS.reviews, label: "Who We Have Helped", icon: "star" as const },
  { href: EVERGREEN_PATHS.contact, label: "Where to Contact", icon: "mail" as const },
] as const;

export const EVERGREEN_BOTTOM_NAV_ITEMS = [
  { href: EVERGREEN_PATHS.home, label: "Home", icon: "home" as const },
  // { href: EVERGREEN_PATHS.manage, label: "Overview", icon: "home_work" as const },
  { href: EVERGREEN_PATHS.portfolio, label: "Achieved", icon: "photo_library" as const },
  { href: EVERGREEN_PATHS.reviews, label: "Helped", icon: "star" as const },
  { href: EVERGREEN_PATHS.contact, label: "Contact", icon: "mail" as const },
] as const;

export function evergreenSectionToNavKey(
  section: EvergreenScrollSectionId | "hero",
): EvergreenNavKey {
  if (section === "hero") return "home";
  if (
    section === "spring" ||
    section === "summer" ||
    section === "fall" ||
    section === "winter"
  ) {
    return "seasons";
  }
  if (section === "portfolio") return "portfolio";
  if (section === "why-choose-us") return "whyChooseUs";
  if (section === "how-we-work") return "howWeWork";
  if (section === "reviews") return "reviews";
  return "contact";
}

export function isEvergreenNavItemActive(navKey: EvergreenNavKey, href: string): boolean {
  if (href === EVERGREEN_PATHS.home) return navKey === "home";
  if (href === EVERGREEN_PATHS.manage) return navKey === "manage";
  if (href === EVERGREEN_PATHS.portfolio) return navKey === "portfolio";
  if (href === EVERGREEN_PATHS.whyChooseUs) return navKey === "whyChooseUs";
  if (href === EVERGREEN_PATHS.howWeWork) return navKey === "howWeWork";
  if (href === EVERGREEN_PATHS.reviews) return navKey === "reviews";
  if (href === EVERGREEN_PATHS.contact) return navKey === "contact";
  return false;
}

export function isEvergreenSeasonNavActive(
  scrollSection: EvergreenScrollSectionId | "hero",
  href: string,
): boolean {
  const hash = href.split("#")[1];
  if (!hash) return false;
  return scrollSection === hash;
}
