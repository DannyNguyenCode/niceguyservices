export const NEOPETS_BASE = "/template/demo/neopets-nonprofit" as const;

export const NEOPETS_SITE = "Toronto Adopt-A-Pet";

export const NEOPETS_PATHS = {
  home: NEOPETS_BASE,
  explorer: `${NEOPETS_BASE}/explorer`,
  adventure: `${NEOPETS_BASE}/adventure`,
  volunteers: `${NEOPETS_BASE}/volunteers`,
  profile: `${NEOPETS_BASE}/profile`,
  alerts: `${NEOPETS_BASE}/alerts`,
  about: `${NEOPETS_BASE}/about`,
  successStories: `${NEOPETS_BASE}/success-stories`,
  quests: `${NEOPETS_BASE}/quests`,
  library: `${NEOPETS_BASE}/library`,
  community: `${NEOPETS_BASE}/community`,
} as const;

/** Every demo page — used by header (see row splits below). Order: row 1 = first four, row 2 = rest. */
export const NEOPETS_NAV_ITEMS = [
  { href: NEOPETS_PATHS.home, label: "Home", icon: "home" as const },
  { href: NEOPETS_PATHS.explorer, label: "Explorer", icon: "explore" as const },
  { href: NEOPETS_PATHS.alerts, label: "Rescue Alerts", icon: "emergency_home" as const },
  { href: NEOPETS_PATHS.adventure, label: "Lost & Found", icon: "map" as const },
  { href: NEOPETS_PATHS.about, label: "About", icon: "diversity_3" as const },
  { href: NEOPETS_PATHS.successStories, label: "Success Stories", icon: "auto_stories" as const },
  { href: NEOPETS_PATHS.volunteers, label: "Volunteers", icon: "volunteer_activism" as const },
  { href: NEOPETS_PATHS.quests, label: "Quests", icon: "flag" as const },
  { href: NEOPETS_PATHS.library, label: "Library", icon: "menu_book" as const },
  { href: NEOPETS_PATHS.community, label: "Community", icon: "groups" as const },
  { href: NEOPETS_PATHS.profile, label: "Profile", icon: "person" as const },
] as const;

export type NeopetsNavItem = (typeof NEOPETS_NAV_ITEMS)[number];

/** Header nav row 1: Home, Explorer, Rescue Alerts, Lost & Found */
export const NEOPETS_NAV_ROW_PRIMARY = NEOPETS_NAV_ITEMS.slice(0, 4);

/** Header nav row 2: all remaining links */
export const NEOPETS_NAV_ROW_SECONDARY = NEOPETS_NAV_ITEMS.slice(4);

export function isNeopetsNavActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  const base = NEOPETS_BASE.replace(/\/$/, "") || "/";
  if (target === base) {
    return path === base;
  }
  return path === target || path.startsWith(`${target}/`);
}
