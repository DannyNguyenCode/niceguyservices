export const SD_BASE = "/template/demo/skyline-designs" as const;

export const SD_SITE = "Skyline Designs";
export const SD_TAGLINE = "Toronto-based Digital Craftsman";
export const SD_EMAIL = "hello@skylinedesigns.com";
export const SD_EMAIL_HREF = "mailto:hello@skylinedesigns.com";

export const SD_PATHS = {
  home: SD_BASE,
  skills: `${SD_BASE}/skills`,
  education: `${SD_BASE}/education`,
  experience: `${SD_BASE}/experience`,
  contact: `${SD_BASE}/contact`,
} as const;

export type SdNavKey = "home" | "skills" | "education" | "experience" | "contact";

export const SD_NAV_ITEMS: { key: SdNavKey; href: string; label: string }[] = [
  { key: "home", href: SD_PATHS.home, label: "Home" },
  { key: "skills", href: SD_PATHS.skills, label: "Skills" },
  { key: "education", href: SD_PATHS.education, label: "Education" },
  { key: "experience", href: SD_PATHS.experience, label: "Experience" },
  { key: "contact", href: SD_PATHS.contact, label: "Contact" },
];

export function isSdNavActive(pathname: string, key: SdNavKey): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  const href = SD_NAV_ITEMS.find((item) => item.key === key)?.href ?? SD_BASE;
  const target = href.replace(/\/$/, "") || "/";
  if (target === SD_BASE) return path === SD_BASE;
  return path === target || path.startsWith(`${target}/`);
}
