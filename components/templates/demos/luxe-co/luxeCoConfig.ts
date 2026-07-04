export const LC_BASE = "/template/demo/luxe-co" as const;

export const LC_SECTIONS = {
  hero: "hero",
  lifestyle: "lifestyle",
  neighborhoods: "neighborhoods",
  properties: "properties",
  market: "market",
  roadmap: "roadmap",
  testimonials: "testimonials",
  contact: "contact",
} as const;

export type LcSectionId = (typeof LC_SECTIONS)[keyof typeof LC_SECTIONS];

export const LC_NAV_ITEMS = [
  { id: LC_SECTIONS.properties, label: "Buy" },
  { id: LC_SECTIONS.roadmap, label: "Sell" },
  { id: LC_SECTIONS.neighborhoods, label: "Neighborhoods" },
  { id: LC_SECTIONS.properties, label: "Listings" },
  { id: LC_SECTIONS.market, label: "Market Guide" },
  { id: LC_SECTIONS.contact, label: "Contact" },
] as const;

export function lcSectionHref(id: LcSectionId): string {
  return `${LC_BASE}#${id}`;
}
