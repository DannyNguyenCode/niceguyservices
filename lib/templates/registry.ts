import templatesContent from "@/components/templates/templatesContent.json";
import { GALLERY_CARD_META } from "@/lib/templates/galleryConfig";

export type TemplateContentEntry = {
  slug: string;
  title: string;
  description: string;
  link: string;
};

export type ExperienceTemplate = TemplateContentEntry & {
  /** Midnight Gallery stack: full-stack shop vs frontend-only services site. */
  category: "E-Commerce" | "Services" | "Portfolio";
};

function categoryFromSlug(slug: string): ExperienceTemplate["category"] {
  const meta = GALLERY_CARD_META[slug];
  if (meta?.filterTags.includes("portfolio")) return "Portfolio";
  if (meta?.filterTags.includes("ecommerce")) return "E-Commerce";
  return "Services";
}

export const EXPERIENCE_TEMPLATES: ExperienceTemplate[] =
  templatesContent.templates.map((template) => ({
    ...template,
    category: categoryFromSlug(template.slug),
  }));

export function getExperienceTemplate(
  slug: string,
): ExperienceTemplate | undefined {
  return EXPERIENCE_TEMPLATES.find((t) => t.slug === slug);
}

export const TEMPLATE_DEMO_BASE = "/template/demo" as const;

export function templateDemoHref(slug: string): string {
  const template = getExperienceTemplate(slug);
  return template?.link ?? `${TEMPLATE_DEMO_BASE}/${slug}`;
}

export const TEMPLATE_GALLERY_DEMO_CTA_BASE =
  "mt-6 inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90";

const TEMPLATE_GALLERY_DEMO_ACCENT_BY_SLUG: Record<string, string> = {
  "neopets-nonprofit": "bg-emerald-500 text-white",
  "tmnt-trades": "bg-[#216b41] text-white",
  "looneytunes-services": "bg-[#495E84] text-white",
  "party-smile-dental": "bg-[#ef4444] text-white",
  "companion-pet": "bg-[#5b8def] text-white",
  pawsome: "bg-[#0060ac] text-white",
  "starlight-command": "bg-[#ee671c] text-[#351000]",
  "evergreen-alpine": "bg-[#012d1d] text-white",
  "lumina-landscapes": "bg-[#b8956a] text-[#121412]",
  "pawsmatch-rescue": "bg-[#c67b5c] text-white",
  "luxe-co": "bg-[#1a1a1a] text-[#f9f8f3]",
  "home-restoration": "bg-[#1c1c1c] text-[#faf9f6]",
  "liquid-occasions": "bg-[#bf0014] text-white",
  "kinship-capital": "bg-[#0058be] text-white",
  "saturday-pet-market": "bg-[#006a6a] text-white",
  "skyline-designs": "bg-[#0c6780] text-white",
  "hardscape-landscaping": "bg-[#0A6847] text-[#ffffff]",
  "power-pellet-electric": "bg-[#e9ea00] text-[#323200]",
  "comfortflow-hvac": "bg-[#0a1422] text-[#ffffff]",
};

export function templateGalleryDemoButtonClass(slug: string): string {
  const accent = TEMPLATE_GALLERY_DEMO_ACCENT_BY_SLUG[slug] ?? "bg-white text-neutral-900";
  return `${TEMPLATE_GALLERY_DEMO_CTA_BASE} ${accent}`;
}

const MULTI_PAGE_TEMPLATE_SLUGS = new Set([
  "tmnt-trades",
  "looneytunes-services",
  "neopets-nonprofit",
  "party-smile-dental",
  "starlight-command",
  "companion-pet",
  "pawsome",
  "evergreen-alpine",
  "liquid-occasions",
  "kinship-capital",
  "saturday-pet-market",
  "skyline-designs",
  "hardscape-landscaping",
  "power-pellet-electric",
  "comfortflow-hvac",
]);

export function experienceTemplateSlugs(): string[] {
  return EXPERIENCE_TEMPLATES.filter((t) => !MULTI_PAGE_TEMPLATE_SLUGS.has(t.slug)).map(
    (t) => t.slug,
  );
}
