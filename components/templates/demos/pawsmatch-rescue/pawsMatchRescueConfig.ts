export const PMR_BASE = "/template/demo/pawsmatch-rescue" as const;

export const PMR_PATHS = {
  home: PMR_BASE,
  pets: `${PMR_BASE}/pets`,
  pet: (id: string) => `${PMR_BASE}/pets/${encodeURIComponent(id)}`,
  apply: `${PMR_BASE}/apply`,
  applySuccess: `${PMR_BASE}/apply/success`,
  login: `${PMR_BASE}/login`,
  account: `${PMR_BASE}/account`,
  admin: `${PMR_BASE}/admin`,
  databaseError: `${PMR_BASE}/database-error`,
  process: `${PMR_BASE}/#process`,
  stories: `${PMR_BASE}/#stories`,
  donate: `${PMR_BASE}/#donate`,
  contact: `${PMR_BASE}/#contact`,
} as const;

export function pmrApplyHref(petId?: string): string {
  if (!petId) return PMR_PATHS.apply;
  return `${PMR_PATHS.apply}?pet=${encodeURIComponent(petId)}`;
}

/** Legacy section ids for home page anchors */
export const PMR_SECTIONS = {
  hero: "hero",
  process: "process",
  stories: "stories",
  donate: "donate",
  contact: "contact",
} as const;

export type PmrSectionId = (typeof PMR_SECTIONS)[keyof typeof PMR_SECTIONS];

export const PMR_NAV_ITEMS = [
  { href: PMR_PATHS.home, label: "Home" },
  { href: PMR_PATHS.pets, label: "Discover" },
  { href: PMR_PATHS.process, label: "Process" },
  { href: PMR_PATHS.stories, label: "Stories" },
  { href: PMR_PATHS.donate, label: "Donate" },
  { href: PMR_PATHS.contact, label: "Contact" },
] as const;

export const PMR_SITE = "PawsMatch Rescue";

/** Shared pet-market demo admin (seeded on first auth request). */
export const PMR_DEMO_ADMIN = {
  email: "admin@petmarket.local",
  password: "admin",
} as const;

export function isPmrAdminUser(user: { email: string; role?: string } | null | undefined): boolean {
  if (!user) return false;
  return user.role === "admin" || user.email.toLowerCase() === PMR_DEMO_ADMIN.email;
}

export function pmrSectionHref(id: PmrSectionId): string {
  return `${PMR_BASE}#${id}`;
}
