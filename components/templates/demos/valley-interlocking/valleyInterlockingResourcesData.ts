import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_HOW_TO_LAY_INTERLOCKING } from "./valleyInterlockingHowToLayInterlockingContent";
import { VI_LANDSCAPE_LIGHTING_INSTALL } from "./valleyInterlockingLandscapeLightingInstallContent";
import { VI_LANDSCAPE_PLANNING } from "./valleyInterlockingLandscapePlanningContent";
import { VI_PATIO_DESIGN_GUIDE } from "./valleyInterlockingPatioDesignGuideContent";
import { VI_BACKYARD_DESIGN_GUIDE } from "./valleyInterlockingBackyardDesignGuideContent";
import { VI_DRIVEWAY_PAVING_GUIDE } from "./valleyInterlockingDrivewayPavingGuideContent";
import { VI_LAWN_CARE_MAINTENANCE_GUIDE } from "./valleyInterlockingLawnCareMaintenanceGuideContent";
import { VI_PERGOLA_BUILD_GUIDE } from "./valleyInterlockingPergolaBuildGuideContent";
import { VI_PORCH_BUILD_GUIDE } from "./valleyInterlockingPorchBuildGuideContent";
import { VI_IMG } from "./valleyInterlockingImages";

export const VI_RESOURCE_CATEGORIES = [
  "All Resources",
  "Installation Guides",
  "Maintenance",
  "Design Trends",
  "FAQs",
] as const;

export type ViResourceCategory = (typeof VI_RESOURCE_CATEGORIES)[number];

export type ViResourceArticle = {
  id: string;
  title: string;
  excerpt: string;
  category: Exclude<ViResourceCategory, "All Resources">;
  readTime: string;
  image: string;
  imageAlt: string;
  href?: string;
  featured?: boolean;
};

export const VI_FEATURED_RESOURCE: ViResourceArticle = {
  id: VI_HOW_TO_LAY_INTERLOCKING.slug,
  title: VI_HOW_TO_LAY_INTERLOCKING.title,
  excerpt: VI_HOW_TO_LAY_INTERLOCKING.serviceSummary,
  category: VI_HOW_TO_LAY_INTERLOCKING.category,
  readTime: VI_HOW_TO_LAY_INTERLOCKING.readTime,
  image: VI_HOW_TO_LAY_INTERLOCKING.heroImage,
  imageAlt: VI_HOW_TO_LAY_INTERLOCKING.heroImageAlt,
  href: VI_HOW_TO_LAY_INTERLOCKING.path,
  featured: true,
};

export const VI_RESOURCE_ARTICLES: ViResourceArticle[] = [
  {
    id: VI_HOW_TO_LAY_INTERLOCKING.slug,
    title: VI_HOW_TO_LAY_INTERLOCKING.title,
    excerpt:
      "From excavation and soil compaction to base filling and bedding sand — the complete professional installation sequence.",
    category: VI_HOW_TO_LAY_INTERLOCKING.category,
    readTime: VI_HOW_TO_LAY_INTERLOCKING.readTime,
    image: VI_IMG.resources.article.compaction,
    imageAlt: "Plate compactor preparing crushed stone base for interlocking pavers.",
    href: VI_HOW_TO_LAY_INTERLOCKING.path,
    featured: true,
  },
  {
    id: VI_LANDSCAPE_PLANNING.slug,
    title: VI_LANDSCAPE_PLANNING.title,
    excerpt: VI_LANDSCAPE_PLANNING.summary,
    category: VI_LANDSCAPE_PLANNING.category,
    readTime: VI_LANDSCAPE_PLANNING.readTime,
    image: VI_LANDSCAPE_PLANNING.galleryImage,
    imageAlt: VI_LANDSCAPE_PLANNING.galleryImageAlt,
    href: VI_LANDSCAPE_PLANNING.path,
  },
  {
    id: VI_LANDSCAPE_LIGHTING_INSTALL.slug,
    title: VI_LANDSCAPE_LIGHTING_INSTALL.title,
    excerpt: VI_LANDSCAPE_LIGHTING_INSTALL.serviceSummary,
    category: VI_LANDSCAPE_LIGHTING_INSTALL.category,
    readTime: VI_LANDSCAPE_LIGHTING_INSTALL.readTime,
    image: VI_LANDSCAPE_LIGHTING_INSTALL.heroImage,
    imageAlt: VI_LANDSCAPE_LIGHTING_INSTALL.heroImageAlt,
    href: VI_LANDSCAPE_LIGHTING_INSTALL.path,
  },
  {
    id: VI_PATIO_DESIGN_GUIDE.slug,
    title: VI_PATIO_DESIGN_GUIDE.title,
    excerpt: VI_PATIO_DESIGN_GUIDE.serviceSummary,
    category: VI_PATIO_DESIGN_GUIDE.category,
    readTime: VI_PATIO_DESIGN_GUIDE.readTime,
    image: VI_PATIO_DESIGN_GUIDE.heroImage,
    imageAlt: VI_PATIO_DESIGN_GUIDE.heroImageAlt,
    href: VI_PATIO_DESIGN_GUIDE.path,
  },
  {
    id: VI_PORCH_BUILD_GUIDE.slug,
    title: VI_PORCH_BUILD_GUIDE.title,
    excerpt: VI_PORCH_BUILD_GUIDE.serviceSummary,
    category: VI_PORCH_BUILD_GUIDE.category,
    readTime: VI_PORCH_BUILD_GUIDE.readTime,
    image: VI_PORCH_BUILD_GUIDE.heroImage,
    imageAlt: VI_PORCH_BUILD_GUIDE.heroImageAlt,
    href: VI_PORCH_BUILD_GUIDE.path,
  },
  {
    id: VI_PERGOLA_BUILD_GUIDE.slug,
    title: VI_PERGOLA_BUILD_GUIDE.title,
    excerpt: VI_PERGOLA_BUILD_GUIDE.serviceSummary,
    category: VI_PERGOLA_BUILD_GUIDE.category,
    readTime: VI_PERGOLA_BUILD_GUIDE.readTime,
    image: VI_PERGOLA_BUILD_GUIDE.heroImage,
    imageAlt: VI_PERGOLA_BUILD_GUIDE.heroImageAlt,
    href: VI_PERGOLA_BUILD_GUIDE.path,
  },
  {
    id: VI_DRIVEWAY_PAVING_GUIDE.slug,
    title: VI_DRIVEWAY_PAVING_GUIDE.title,
    excerpt: VI_DRIVEWAY_PAVING_GUIDE.serviceSummary,
    category: VI_DRIVEWAY_PAVING_GUIDE.category,
    readTime: VI_DRIVEWAY_PAVING_GUIDE.readTime,
    image: VI_DRIVEWAY_PAVING_GUIDE.heroImage,
    imageAlt: VI_DRIVEWAY_PAVING_GUIDE.heroImageAlt,
    href: VI_DRIVEWAY_PAVING_GUIDE.path,
  },
  {
    id: VI_LAWN_CARE_MAINTENANCE_GUIDE.slug,
    title: VI_LAWN_CARE_MAINTENANCE_GUIDE.title,
    excerpt: VI_LAWN_CARE_MAINTENANCE_GUIDE.serviceSummary,
    category: VI_LAWN_CARE_MAINTENANCE_GUIDE.category,
    readTime: VI_LAWN_CARE_MAINTENANCE_GUIDE.readTime,
    image: VI_LAWN_CARE_MAINTENANCE_GUIDE.heroImage,
    imageAlt: VI_LAWN_CARE_MAINTENANCE_GUIDE.heroImageAlt,
    href: VI_LAWN_CARE_MAINTENANCE_GUIDE.path,
  },
  {
    id: VI_BACKYARD_DESIGN_GUIDE.slug,
    title: VI_BACKYARD_DESIGN_GUIDE.title,
    excerpt: VI_BACKYARD_DESIGN_GUIDE.serviceSummary,
    category: VI_BACKYARD_DESIGN_GUIDE.category,
    readTime: VI_BACKYARD_DESIGN_GUIDE.readTime,
    image: VI_BACKYARD_DESIGN_GUIDE.heroImage,
    imageAlt: VI_BACKYARD_DESIGN_GUIDE.heroImageAlt,
    href: VI_BACKYARD_DESIGN_GUIDE.path,
  },
  {
    id: "interlocking-maintenance",
    title: "Maintaining Your Interlocking Paving for Lifelong Durability",
    excerpt:
      "Learn the seasonal cleaning protocols and resealing schedules necessary to prevent weed growth and stone degradation.",
    category: "Maintenance",
    readTime: "8 min read",
    image: VI_IMG.resources.maintenance,
    imageAlt: "Limestone interlocking surface being sprayed with water to clean it.",
  },
  {
    id: "pool-deck-stone-texture",
    title: "Choosing the Right Stone Texture for Modern Pool Decks",
    excerpt:
      "An exploration of slip-resistant surfaces and thermal properties of various stone types for high-traffic water areas.",
    category: "Design Trends",
    readTime: "6 min read",
    image: VI_IMG.resources.designTrends,
    imageAlt: "Luxury backyard pool deck with modern large-format paving stones in slate grey.",
  },
  {
    id: "soil-compaction-drainage",
    title: "Engineered Foundations: Soil Compaction & Drainage Solutions",
    excerpt:
      "A deep dive into the geological considerations for high-integrity stone installations in variable clay and sandy environments.",
    category: "Installation Guides",
    readTime: "15 min read",
    image: VI_IMG.resources.technical,
    imageAlt: "Cross-section view of driveway base layers including crushed stone and interlocking units.",
  },
];

export function viResourceArticlePath(slug: string): string {
  return `${VI_PATHS.resources}/${slug}`;
}
