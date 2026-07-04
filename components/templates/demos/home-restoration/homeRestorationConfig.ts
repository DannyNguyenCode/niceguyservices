export const HR_BASE = "/template/demo/home-restoration" as const;

export const HR_SECTIONS = {
  hero: "hero",
  sanctuary: "sanctuary",
  trust: "trust",
  spaces: "spaces",
  process: "process",
  gallery: "gallery",
  packages: "packages",
  stories: "stories",
  contact: "contact",
} as const;

export type HrSectionId = (typeof HR_SECTIONS)[keyof typeof HR_SECTIONS];

export const HR_NAV_ITEMS = [
  { id: HR_SECTIONS.hero, label: "Home" },
  { id: HR_SECTIONS.process, label: "Process" },
  { id: HR_SECTIONS.spaces, label: "Spaces" },
  { id: HR_SECTIONS.packages, label: "Packages" },
  { id: HR_SECTIONS.stories, label: "Stories" },
  { id: HR_SECTIONS.contact, label: "Contact" },
] as const;

export function hrSectionHref(id: HrSectionId): string {
  return `${HR_BASE}#${id}`;
}
