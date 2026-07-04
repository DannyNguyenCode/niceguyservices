export const PS_BASE = "/template/demo/pawsome" as const;

export const PS_SITE = "Pawsome";
export const PS_TAGLINE = "Premium pet wellness ecosystem (fictional demo)";

export const PS_PATHS = {
  home: PS_BASE,
  shop: `${PS_BASE}/shop`,
  shopSalmon: `${PS_BASE}/shop/artisan-salmon`,
  shopLuna: `${PS_BASE}/shop/luna`,
  rewards: `${PS_BASE}/rewards`,
  resources: `${PS_BASE}/resources`,
  account: `${PS_BASE}/account`,
  accountOrders: `${PS_BASE}/account/orders`,
  accountAddPet: `${PS_BASE}/account/add-pet`,
  accountAddPetHealth: `${PS_BASE}/account/add-pet/health`,
  accountAddPetSuccess: `${PS_BASE}/account/add-pet/success`,
  orderTrack: `${PS_BASE}/account/orders/track`,
  subscriptions: `${PS_BASE}/subscriptions`,
  checkout: `${PS_BASE}/checkout`,
  checkoutSuccess: `${PS_BASE}/checkout/success`,
  login: `${PS_BASE}/login`,
  databaseError: `${PS_BASE}/database-error`,
  review: `${PS_BASE}/review`,
  reviewWrite: `${PS_BASE}/review/write`,
  reviewSuccess: `${PS_BASE}/review/success`,
} as const;

export const PS_DEMO_ADMIN = {
  email: "admin@petmarket.local",
  password: "admin",
} as const;

export const PS_NAV_ITEMS = [
  { href: PS_PATHS.home, label: "Home", icon: "home" },
  { href: PS_PATHS.shop, label: "Shop", icon: "storefront" },
  { href: PS_PATHS.rewards, label: "Rewards", icon: "military_tech" },
  { href: PS_PATHS.account, label: "Account", icon: "person" },
] as const;

export type PsNavIcon = (typeof PS_NAV_ITEMS)[number]["icon"];

export function isPsNavActive(pathname: string, href: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const [targetPath] = href.split("#");
  const target = targetPath.replace(/\/$/, "") || "/";
  const base = PS_BASE.replace(/\/$/, "") || "/";
  if (target === base) return path === base;
  if (target === PS_PATHS.shop.replace(/\/$/, "")) {
    return path === target || path.startsWith(`${target}/`);
  }
  return path === target || path.startsWith(`${target}/`);
}
