export type ExperienceTemplate = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
};

export const EXPERIENCE_TEMPLATES: ExperienceTemplate[] = [
  {
    slug: "neopets-nonprofit",
    title: "Neopets — Nonprofit",
    tagline: "Toronto Adopt-A-Pet (fictional)",
    description:
      "Scrapbook-soft nonprofit demo with rescue alerts, explorer cards, quests, and lost-and-found — playful Neopets-era energy, all fictional Toronto shelter copy.",
    category: "nonprofit / playful",
  },
  {
    slug: "tmnt-trades",
    title: "TMNT — Trades",
    tagline: "Tactical turf & patch crew (fictional)",
    description:
      "Six emerald-tinted routes from home base to contact — walk the walk through comic panels, faux project logs, and mission chatter that is all hat and no cattle (demo turf, not a real yard).",
    category: "Trade / cinematic",
  },
  {
    slug: "looneytunes-services",
    title: "LooneyTunes — Services",
    tagline: "Comic-brutalist cafe (fictional)",
    description:
      "Bold outlines, halftone panels, faux menu and rewards, and a playful blog — all placeholder copy for a services-forward cartoon energy demo.",
    category: "services / playful",
  },
  {
    slug: "starlight-command",
    title: "Arcade — Trades",
    tagline: "Industrial command deck (fictional)",
    description:
      "Seven routes from command home to contact — CRT chrome, mission cards, services hub with FAQ, stage-select portfolio filters, reputation leaderboard, and mission log about page; demo brand Arcade Trades, Toronto placeholder copy only.",
    category: "Trade / industrial",
  },
];

export function getExperienceTemplate(
  slug: string,
): ExperienceTemplate | undefined {
  return EXPERIENCE_TEMPLATES.find((t) => t.slug === slug);
}

export const TEMPLATE_DEMO_BASE = "/template/demo" as const;

export function templateDemoHref(slug: string): string {
  return `${TEMPLATE_DEMO_BASE}/${slug}`;
}

export const TEMPLATE_GALLERY_DEMO_CTA_BASE =
  "mt-6 inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90";

const TEMPLATE_GALLERY_DEMO_ACCENT_BY_SLUG: Record<string, string> = {
  "neopets-nonprofit": "bg-emerald-500 text-white",
  "tmnt-trades": "bg-[#216b41] text-white",
  "looneytunes-services": "bg-[#495E84] text-white",
  "starlight-command": "bg-[#ee671c] text-[#351000]",
};

export function templateGalleryDemoButtonClass(slug: string): string {
  const accent = TEMPLATE_GALLERY_DEMO_ACCENT_BY_SLUG[slug] ?? "bg-white text-neutral-900";
  return `${TEMPLATE_GALLERY_DEMO_CTA_BASE} ${accent}`;
}

const MULTI_PAGE_TEMPLATE_SLUGS = new Set([
  "tmnt-trades",
  "looneytunes-services",
  "neopets-nonprofit",
  "starlight-command",
]);

export function experienceTemplateSlugs(): string[] {
  return EXPERIENCE_TEMPLATES.filter((t) => !MULTI_PAGE_TEMPLATE_SLUGS.has(t.slug)).map(
    (t) => t.slug,
  );
}
