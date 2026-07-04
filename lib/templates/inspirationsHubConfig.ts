import type { GalleryFilterId } from "@/lib/templates/galleryConfig";

export type InspirationRowId = "business-websites" | "e-commerce" | "portfolio";

export type InspirationRowConfig = {
  id: InspirationRowId;
  title: string;
  filterId: GalleryFilterId;
  /** Slugs shown first in the row (Netflix-style featured picks). */
  featuredSlugs: string[];
};

/** Short industry-style labels for Netflix poster cards. */
export const INSPIRATION_POSTER_LABELS: Record<string, string> = {
  "valley-interlocking": "Landscaping",
  "evergreen-alpine": "Landscaping",
  "lumina-landscapes": "Landscapes",
  "pawsmatch-rescue": "Vet",
  "party-smile-dental": "Dental",
  "kinship-capital": "Accountant",
  "tmnt-trades": "Trades",
  "starlight-command": "Industrial",
  "neopets-nonprofit": "Nonprofit",
  "luxe-co": "Real Estate",
  "home-restoration": "Cleaning",
  "liquid-occasions": "Events",
  "saturday-pet-market": "Pet Store",
  pawsome: "Pet Store",
  "companion-pet": "Pet Supply",
  "looneytunes-services": "Coffee",
  "skyline-designs": "Developer",
};

export const INSPIRATION_ROWS: InspirationRowConfig[] = [
  {
    id: "business-websites",
    title: "Business Websites",
    filterId: "services",
    featuredSlugs: [
      "valley-interlocking",
      "pawsmatch-rescue",
      "home-restoration",
      "kinship-capital",
    ],
  },
  {
    id: "e-commerce",
    title: "E-commerce",
    filterId: "ecommerce",
    featuredSlugs: ["saturday-pet-market", "looneytunes-services", "pawsome", "companion-pet"],
  },
  {
    id: "portfolio",
    title: "Portfolio",
    filterId: "portfolio",
    featuredSlugs: ["skyline-designs"],
  },
];

export function inspirationPosterLabel(slug: string, fallbackTitle: string): string {
  return INSPIRATION_POSTER_LABELS[slug] ?? fallbackTitle;
}

export function sortTemplatesForRow<T extends { slug: string }>(
  templates: T[],
  featuredSlugs: string[],
): T[] {
  const order = new Map(featuredSlugs.map((slug, index) => [slug, index]));
  return [...templates].sort((a, b) => {
    const aOrder = order.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = order.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.slug.localeCompare(b.slug);
  });
}
