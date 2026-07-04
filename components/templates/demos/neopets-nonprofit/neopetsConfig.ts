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
  adoptionProcess: `${NEOPETS_BASE}/adoption-process`,
  checklist: `${NEOPETS_BASE}/checklist`,
  petDetail: (id: string) => `${NEOPETS_BASE}/explorer/${id}`,
} as const;

export type NeopetsNavItem = {
  href: string;
  label: string;
  icon: string;
};

/** Primary header links — single main row */
export const NEOPETS_MAIN_NAV: readonly NeopetsNavItem[] = [
  { href: NEOPETS_PATHS.explorer, label: "Explore", icon: "explore" },
  { href: NEOPETS_PATHS.adoptionProcess, label: "Journey", icon: "map" },
] as const;

/** Community dropdown */
export const NEOPETS_COMMUNITY_NAV: readonly NeopetsNavItem[] = [
  { href: NEOPETS_PATHS.volunteers, label: "Volunteers", icon: "volunteer_activism" },
  { href: NEOPETS_PATHS.successStories, label: "Happy Tails", icon: "auto_stories" },
  { href: NEOPETS_PATHS.alerts, label: "Rescue Alerts", icon: "emergency_home" },
  { href: NEOPETS_PATHS.about, label: "About Us", icon: "diversity_3" },
  { href: NEOPETS_PATHS.community, label: "Join Community", icon: "groups" },
] as const;

/** Resources dropdown */
export const NEOPETS_RESOURCES_NAV: readonly NeopetsNavItem[] = [
  { href: NEOPETS_PATHS.checklist, label: "Checklist", icon: "checklist" },
  { href: NEOPETS_PATHS.library, label: "Library", icon: "menu_book" },
  { href: NEOPETS_PATHS.adventure, label: "Lost & Found", icon: "map" },
  { href: NEOPETS_PATHS.quests, label: "Quests", icon: "flag" },
] as const;

/** Flat list of every demo page (sitemap / legacy) */
export const NEOPETS_NAV_ITEMS: readonly NeopetsNavItem[] = [
  { href: NEOPETS_PATHS.home, label: "Home", icon: "home" },
  ...NEOPETS_MAIN_NAV,
  ...NEOPETS_COMMUNITY_NAV,
  ...NEOPETS_RESOURCES_NAV,
  { href: NEOPETS_PATHS.profile, label: "Profile", icon: "person" },
] as const;

/** Mobile bottom bar on the impact-first home */
export const NEOPETS_BOTTOM_NAV_ITEMS = [
  { href: NEOPETS_PATHS.explorer, label: "Explorer", icon: "explore" as const },
  { href: NEOPETS_PATHS.adoptionProcess, label: "Journey", icon: "map" as const },
  { href: NEOPETS_PATHS.volunteers, label: "Volunteers", icon: "volunteer_activism" as const },
  { href: NEOPETS_PATHS.profile, label: "Profile", icon: "person" as const },
] as const;

export type NeopetsBottomNavItem = (typeof NEOPETS_BOTTOM_NAV_ITEMS)[number];

export type NeopetsNavSection = "explore" | "journey" | "community" | "resources";

export function normalizeNeopetsPath(pathname: string): string {
  const path = pathname.split("?")[0]?.split("#")[0] ?? "";
  return path.replace(/\/$/, "") || "/";
}

export function isNeopetsNavActive(pathname: string, href: string): boolean {
  const path = normalizeNeopetsPath(pathname);
  const target = normalizeNeopetsPath(href);
  const base = normalizeNeopetsPath(NEOPETS_BASE);

  if (target === base) {
    return path === base;
  }

  return path === target || path.startsWith(`${target}/`);
}

export function isNeopetsNavGroupActive(
  pathname: string,
  items: readonly NeopetsNavItem[],
): boolean {
  return items.some((item) => isNeopetsNavActive(pathname, item.href));
}

/** Exactly one top-level header section, if any. */
export function getNeopetsActiveSection(pathname: string): NeopetsNavSection | null {
  const path = normalizeNeopetsPath(pathname);
  const base = normalizeNeopetsPath(NEOPETS_BASE);

  if (path === base) {
    return null;
  }

  if (isNeopetsNavActive(path, NEOPETS_PATHS.explorer)) {
    return "explore";
  }

  if (isNeopetsNavActive(path, NEOPETS_PATHS.adoptionProcess)) {
    return "journey";
  }

  if (isNeopetsNavGroupActive(path, NEOPETS_COMMUNITY_NAV)) {
    return "community";
  }

  if (isNeopetsNavGroupActive(path, NEOPETS_RESOURCES_NAV)) {
    return "resources";
  }

  return null;
}

export function isNeopetsProfileActive(pathname: string): boolean {
  return isNeopetsNavActive(pathname, NEOPETS_PATHS.profile);
}

export type NeopetsDropdownId = "community" | "resources";

export function getNeopetsPinnedDropdown(pathname: string): NeopetsDropdownId | null {
  const section = getNeopetsActiveSection(pathname);
  if (section === "community" || section === "resources") {
    return section;
  }
  return null;
}
