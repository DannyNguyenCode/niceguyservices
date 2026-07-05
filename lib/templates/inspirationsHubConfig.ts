import type { GalleryFilterId } from "@/lib/templates/galleryConfig";

export type InspirationRowId = "business-websites" | "e-commerce" | "portfolio";

export type InspirationRowConfig = {
  id: InspirationRowId;
  title: string;
  filterId: GalleryFilterId;
  /** Slugs shown first in the row (Netflix-style featured picks). */
  featuredSlugs: string[];
};

export const INSPIRATION_ROWS: InspirationRowConfig[] = [
  {
    id: "business-websites",
    title: "Business Websites",
    filterId: "services",
    featuredSlugs: [
      "comfortflow-hvac",
      "hardscape-landscaping",
      "pawsmatch-rescue",
      "home-restoration",
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
