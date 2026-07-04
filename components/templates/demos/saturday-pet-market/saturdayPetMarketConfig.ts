export const SPM_BASE = "/template/demo/saturday-pet-market" as const;

export const SPM_SITE = "Pet Market";
export const SPM_TAGLINE = "Saturday Morning Pet Market";

/** Default demo admin seeded in MongoDB on first auth request. */
export const SPM_DEMO_ADMIN = {
  email: "admin@petmarket.local",
  password: "admin",
} as const;

/** @deprecated Demo login is now email-based with 2FA */
export const SPM_DEMO_CREDENTIALS = {
  username: SPM_DEMO_ADMIN.email,
  password: SPM_DEMO_ADMIN.password,
} as const;

export function isSpmAdminUsername(username: string | null | undefined): boolean {
  const value = username?.trim().toLowerCase();
  return value === SPM_DEMO_ADMIN.email || value === "admin";
}

export function spmShopSearchHref(query: string): string {
  const trimmed = query.trim();
  if (!trimmed) return SPM_PATHS.shop;
  return `${SPM_PATHS.shop}?q=${encodeURIComponent(trimmed)}`;
}

export function spmProductHref(id: string): string {
  return `${SPM_BASE}/product/${encodeURIComponent(id)}`;
}

export function isSpmProductPath(pathname: string): boolean {
  const path = normalizeSpmPath(pathname);
  return path === SPM_PATHS.product || path.startsWith(`${SPM_PATHS.product}/`);
}

export const SPM_PATHS = {
  home: SPM_BASE,
  shop: `${SPM_BASE}/shop`,
  product: `${SPM_BASE}/product`,
  cart: `${SPM_BASE}/cart`,
  account: `${SPM_BASE}/account`,
  rewards: `${SPM_BASE}/rewards`,
  checkout: `${SPM_BASE}/checkout`,
  community: `${SPM_BASE}/community`,
  resources: `${SPM_BASE}/resources`,
  locations: `${SPM_BASE}/locations`,
  contact: `${SPM_BASE}/contact`,
  login: `${SPM_BASE}/login`,
  inventory: `${SPM_BASE}/inventory`,
  faq: `${SPM_BASE}/faq`,
  databaseError: `${SPM_BASE}/database-error`,
} as const;

export type SpmNavKey = "shop" | "community" | "rewards" | "locations" | "faq" | "resources" | "contact";

export const SPM_NAV_ITEMS: { key: SpmNavKey; href: string; label: string }[] = [
  { key: "shop", href: SPM_PATHS.shop, label: "Shop" },
  { key: "community", href: SPM_PATHS.community, label: "Community" },
  { key: "rewards", href: SPM_PATHS.rewards, label: "Rewards" },
  { key: "locations", href: SPM_PATHS.locations, label: "Locations" },
  { key: "faq", href: SPM_PATHS.faq, label: "FAQ" },
  { key: "resources", href: SPM_PATHS.resources, label: "Resource Center" },
  { key: "contact", href: SPM_PATHS.contact, label: "Contact Us" },
];

function normalizeSpmPath(pathname: string): string {
  return pathname.replace(/\/$/, "") || "/";
}

export function isSpmNavActive(pathname: string, key: SpmNavKey): boolean {
  const path = normalizeSpmPath(pathname);
  if (key === "shop") {
    return (
      path === SPM_PATHS.shop ||
      path.startsWith(`${SPM_PATHS.shop}/`) ||
      isSpmProductPath(path)
    );
  }
  if (key === "community") {
    return path === SPM_PATHS.community || path.startsWith(`${SPM_PATHS.community}/`);
  }
  if (key === "rewards") {
    return path === SPM_PATHS.rewards || path.startsWith(`${SPM_PATHS.rewards}/`);
  }
  if (key === "locations") {
    return path === SPM_PATHS.locations;
  }
  if (key === "faq") {
    return path === SPM_PATHS.faq;
  }
  if (key === "resources") {
    return path === SPM_PATHS.resources || path.startsWith(`${SPM_PATHS.resources}/`);
  }
  if (key === "contact") {
    return path === SPM_PATHS.contact;
  }
  return false;
}

export function isSpmCheckoutPath(pathname: string): boolean {
  return normalizeSpmPath(pathname) === SPM_PATHS.checkout;
}

export function isSpmLoginPath(pathname: string): boolean {
  return normalizeSpmPath(pathname) === SPM_PATHS.login;
}

export function isSpmMinimalChromePath(pathname: string): boolean {
  return isSpmCheckoutPath(pathname);
}
