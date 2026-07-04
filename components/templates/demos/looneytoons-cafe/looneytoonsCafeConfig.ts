export const LOONEYTOONS_CAFE_BASE = "/template/demo/looneytunes-services" as const;

/** Default demo admin seeded in MongoDB on first auth request. */
export const LT_DEMO_ADMIN = {
  email: "admin@cometcup.local",
  password: "admin",
} as const;

export function isLtAdminUser(email: string | null | undefined): boolean {
  const value = email?.trim().toLowerCase();
  return value === LT_DEMO_ADMIN.email || value === "admin";
}

export const LT_PATHS = {
  home: LOONEYTOONS_CAFE_BASE,
  menu: `${LOONEYTOONS_CAFE_BASE}/menu`,
  about: `${LOONEYTOONS_CAFE_BASE}/about`,
  rewards: `${LOONEYTOONS_CAFE_BASE}/rewards`,
  blog: `${LOONEYTOONS_CAFE_BASE}/blog`,
  checkout: `${LOONEYTOONS_CAFE_BASE}/checkout`,
  checkoutSuccess: `${LOONEYTOONS_CAFE_BASE}/checkout/success`,
  login: `${LOONEYTOONS_CAFE_BASE}/login`,
  account: `${LOONEYTOONS_CAFE_BASE}/account`,
} as const;
