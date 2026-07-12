import { DEMO_HERO_BY_SLUG } from "@/lib/templates/demoHeroImages";

export type GalleryFilterId = "all" | "ecommerce" | "services" | "portfolio";

export type GalleryStackType = "ecommerce" | "services";

export const GALLERY_FILTERS: { id: GalleryFilterId; label: string }[] = [
  { id: "all", label: "All Inspirations" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "services", label: "Business Websites" },
  { id: "portfolio", label: "Portfolio" },
];

export type InspirationDescription = {
  theme: string;
  colorPalette: string;
  layout: string;
};

export type GalleryCardMeta = {
  /** When omitted, the card preview shows `themeColors` in vertical columns. */
  image?: string;
  imageAlt?: string;
  /** Brand colors from the demo — used when no hero image is available. */
  themeColors: string[];
  icon: string;
  badgeLabel: string;
  iconClassName: string;
  gradientClassName: string;
  filterTags: GalleryFilterId[];
  stackType: GalleryStackType;
  inspiration: InspirationDescription;
};

function galleryHero(slug: string): Pick<GalleryCardMeta, "image" | "imageAlt"> {
  const hero = DEMO_HERO_BY_SLUG[slug];
  if (!hero?.src) return {};
  return { image: hero.src, imageAlt: hero.alt };
}

function servicesCard(
  slug: string | undefined,
  meta: Omit<GalleryCardMeta, "filterTags" | "badgeLabel" | "stackType"> &
    Partial<Pick<GalleryCardMeta, "image" | "imageAlt">>,
): GalleryCardMeta {
  return {
    ...(slug ? galleryHero(slug) : {}),
    ...meta,
    badgeLabel: "SERVICES",
    stackType: "services",
    filterTags: ["all", "services"],
  };
}

function ecommerceCard(
  slug: string,
  meta: Omit<GalleryCardMeta, "filterTags" | "badgeLabel" | "stackType"> &
    Partial<Pick<GalleryCardMeta, "image" | "imageAlt">>,
): GalleryCardMeta {
  return {
    ...galleryHero(slug),
    ...meta,
    badgeLabel: "E-COMMERCE",
    stackType: "ecommerce",
    filterTags: ["all", "ecommerce"],
  };
}

function portfolioCard(
  slug: string,
  meta: Omit<GalleryCardMeta, "filterTags" | "badgeLabel" | "stackType"> &
    Partial<Pick<GalleryCardMeta, "image" | "imageAlt">>,
): GalleryCardMeta {
  return {
    ...galleryHero(slug),
    ...meta,
    badgeLabel: "PORTFOLIO",
    stackType: "services",
    filterTags: ["all", "portfolio"],
  };
}

export const GALLERY_CARD_META: Record<string, GalleryCardMeta> = {
  "saturday-pet-market": ecommerceCard("saturday-pet-market", {
    themeColors: ["#006a6a", "#b7102a", "#fff9ec", "#df759d", "#f4eddd", "#00a8a8"],
    icon: "shopping_bag",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#006a6a]/35 to-[#b7102a]/25",
    inspiration: {
      theme: "Retro neighborhood pet market — Saturday morning shopfront warmth with MD3 polish.",
      colorPalette: "Cream (#fff9ec), teal (#006a6a), cherry red (#b7102a), blush pink accents.",
      layout: "Twelve-route full-stack shop — catalog, cart, checkout holds, admin CRUD, and rewards.",
    },
  }),
  "neopets-nonprofit": servicesCard("neopets-nonprofit", {
    themeColors: ["#0d658c", "#2e6b29", "#eec750", "#adf19e", "#fcf2e6", "#8fd3ff"],
    icon: "favorite",
    iconClassName: "text-tertiary-fixed-dim",
    gradientClassName: "bg-linear-to-br from-purple-500/20 to-[#121212]",
    inspiration: {
      theme: "Neopets-era scrapbook nonprofit — playful rescue alerts and explorer-card quests.",
      colorPalette: "Ocean blue (#0d658c), forest green (#2e6b29), golden yellow (#eec750), mint (#adf19e).",
      layout: "Single-page scroll with rescue alerts, explorer cards, quests, and lost-and-found hub.",
    },
  }),
  "tmnt-trades": servicesCard("tmnt-trades", {
    themeColors: ["#216b41", "#a8f3bd", "#225cb4", "#ac3231", "#ecefe9", "#bfc9be"],
    icon: "engineering",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-green-900/40 to-[#121212]",
    inspiration: {
      theme: "TMNT comic tactical trades — sewer-green mission deck with panel-style storytelling.",
      colorPalette: "Emerald green (#216b41), hero blue (#225cb4), brick red (#ac3231), sage tint.",
      layout: "Six-route multi-page — home base, services, comic panels, project logs, and contact.",
    },
  }),
  "looneytunes-services": ecommerceCard("looneytunes-services", {
    themeColors: ["#151c28", "#495e84", "#d4daec", "#dde2f4", "#f9f9ff", "#e2e8fa"],
    icon: "shopping_bag",
    iconClassName: "text-secondary-container",
    gradientClassName: "bg-linear-to-br from-orange-600/20 to-[#121212]",
    inspiration: {
      theme: "Comic-brutalist cafe shop — bold outlines and exaggerated menu energy.",
      colorPalette: "Navy slate (#151c28), periwinkle (#495e84), cool gray-blue surfaces.",
      layout: "MongoDB-backed shop — menu catalog, client cart, checkout, rewards login, and admin.",
    },
  }),
  "party-smile-dental": servicesCard(undefined, {
    themeColors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#fffef8", "#1a1a1a"],
    icon: "medical_services",
    iconClassName: "text-secondary-container",
    gradientClassName: "bg-[#ef4444]/25",
    inspiration: {
      theme: "N64 party board game dental — tile-based journey with playful family-practice copy.",
      colorPalette: "Primary red, blue, yellow, and green on warm white — arcade-party primaries.",
      layout: "Eight-route board-game flow — dentist tiles, services, FAQ accordion, and booking wizard.",
    },
  }),
  "companion-pet": ecommerceCard("companion-pet", {
    themeColors: ["#fafaf9", "#5b8def", "#e8954c", "#6bbf8a", "#1c1c1e", "#f0eeeb"],
    icon: "shopping_bag",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#5b8def]/20 to-[#121212]",
    inspiration: {
      theme: "Premium pet supply boutique — warm editorial retail with lifestyle product focus.",
      colorPalette: "Warm stone (#fafaf9), sky blue (#5b8def), terracotta (#e8954c), sage green.",
      layout: "Six-route premium shop — live MongoDB inventory, rewards login, and guest checkout.",
    },
  }),
  pawsome: ecommerceCard("pawsome", {
    themeColors: ["#f9f9f9", "#0060ac", "#cc8600", "#68abff", "#181919", "#ffffff"],
    icon: "shopping_bag",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#0060ac]/25 to-[#121212]",
    inspiration: {
      theme: "Material Design 3 pet wellness — clean surfaces and confident product hierarchy.",
      colorPalette: "Clean white, deep blue (#0060ac), amber accent (#cc8600), light sky blue.",
      layout: "MD3 multi-route retail — MongoDB shop, rewards login, checkout holds, and confirmation.",
    },
  }),
  "starlight-command": servicesCard("starlight-command", {
    themeColors: ["#ee671c", "#ffb595", "#ffdd74", "#131313", "#594238", "#353535"],
    icon: "bolt",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#ee671c]/25 to-[#121212]",
    inspiration: {
      theme: "Retro arcade command deck — CRT chrome, mission cards, and industrial trades energy.",
      colorPalette: "Orange blaze (#ee671c), peach (#ffb595), golden yellow (#ffdd74) on charcoal.",
      layout: "Seven-route mission hub — services, stage-select portfolio filters, leaderboard, and contact.",
    },
  }),
  "evergreen-alpine": servicesCard("evergreen-alpine", {
    themeColors: ["#012d1d", "#1b4332", "#c1ecd4", "#fbf9f8", "#653d26", "#171b2b"],
    icon: "eco",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#012d1d]/40 to-[#121212]",
    inspiration: {
      theme: "Year-round property stewardship — premium landscaping with seasonal narrative arcs.",
      colorPalette: "Deep forest (#012d1d), sage mint (#c1ecd4), warm earth brown (#653d26), cream.",
      layout: "Single-page seasonal journey — split hero, masonry portfolio, dark winter section, and CTA.",
    },
  }),
  "lumina-landscapes": servicesCard("lumina-landscapes", {
    themeColors: ["#121412", "#b8956a", "#6b7f62", "#f4efe6", "#1a1c1a", "#8a7355"],
    icon: "park",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#6b7f62]/30 to-[#121212]",
    inspiration: {
      theme: "Cinematic landscape architecture studio — resort retreats and blueprint design process.",
      colorPalette: "Charcoal (#121412), warm bronze (#b8956a), muted sage (#6b7f62), linen cream.",
      layout: "Single-page editorial — material library, case-study portfolio, and consultation intake.",
    },
  }),
  "pawsmatch-rescue": servicesCard("pawsmatch-rescue", {
    themeColors: ["#faf7f2", "#c67b5c", "#8ba888", "#3d2e2a", "#fffdf9", "#f3ede4"],
    icon: "pets",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#c67b5c]/20 to-[#121212]",
    inspiration: {
      theme: "Premium pet adoption matching — storybook warmth with compatibility-first storytelling.",
      colorPalette: "Cream (#faf7f2), terracotta (#c67b5c), sage green (#8ba888), espresso brown.",
      layout: "Single-page adoption hub — filterable pets, journey timeline, volunteer board, and FAQ.",
    },
  }),
  "luxe-co": servicesCard("luxe-co", {
    themeColors: ["#f9f8f3", "#1a1a1a", "#c5a059", "#e5e1d8", "#fffdf9", "#5c5c5c"],
    icon: "home_work",
    iconClassName: "text-secondary-container",
    gradientClassName: "bg-linear-to-br from-[#c5a059]/25 to-[#121212]",
    inspiration: {
      theme: "Editorial luxury real estate concierge — lifestyle matching and neighborhood city guides.",
      colorPalette: "Ivory (#f9f8f3), black (#1a1a1a), champagne gold (#c5a059), warm gray.",
      layout: "Single-page editorial — curated property collection, market intelligence, and buyer roadmap.",
    },
  }),
  "home-restoration": servicesCard("home-restoration", {
    themeColors: ["#faf9f6", "#1c1c1c", "#b8956a", "#e8e3d8", "#fffdf9", "#5a5a5a"],
    icon: "spa",
    iconClassName: "text-secondary-container",
    gradientClassName: "bg-linear-to-br from-[#b8956a]/25 to-[#1c1c1c]",
    inspiration: {
      theme: "Luxury residential restoration — magazine editorial with arch motifs and sanctuary tone.",
      colorPalette: "Warm ivory (#faf9f6), charcoal (#1c1c1c), antique gold (#b8956a), linen.",
      layout: "Single-page concierge flow — space services, before/after sliders, and multi-step booking.",
    },
  }),
  "liquid-occasions": servicesCard(undefined, {
    themeColors: ["#bf0014", "#fdd815", "#f7f9fb", "#1a1c1e", "#ffffff", "#6a758a"],
    icon: "celebration",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#bf0014]/30 to-[#121212]",
    inspiration: {
      theme: "Premium event planning studio — liquid motion paths and dream-cluster hero energy.",
      colorPalette: "Crimson red (#bf0014), sunny yellow path (#fdd815), cool gray MD3 surfaces.",
      layout: "Five-route journey — milestone timeline, experience showcases, portfolio case studies, intake.",
    },
  }),
  "kinship-capital": servicesCard("kinship-capital", {
    themeColors: ["#0058be", "#2170e4", "#d8e2ff", "#f7f9fb", "#191c1e", "#6a758a"],
    icon: "account_balance",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#0058be]/30 to-[#121212]",
    inspiration: {
      theme: "Heritage family wealth — concierge financial services with trust-forward MD3 styling.",
      colorPalette: "Trust blue (#0058be), light periwinkle (#d8e2ff), clean gray-white surfaces.",
      layout: "Six-route wealth hub — services marketplace, pricing tiers, FAQ accordion, and contact form.",
    },
  }),
  "skyline-designs": portfolioCard("skyline-designs", {
    themeColors: ["#0c6780", "#87ceeb", "#baeaff", "#f7f9ff", "#091d2e", "#d1e4fb"],
    icon: "cloud",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#0c6780]/30 to-[#e3efff]",
    inspiration: {
      theme: "Toronto digital craftsman — ethereal cloud motifs and sky-open portfolio presence.",
      colorPalette: "Teal cyan (#0c6780), sky blue (#87ceeb), pale cloud white (#f7f9ff).",
      layout: "Five-route portfolio — bento skills grid, education timeline, agency journey, and contact map.",
    },
  }),
  "hardscape-landscaping": servicesCard("hardscape-landscaping", {
    themeColors: ["#0A6847", "#0D7A52", "#4A9D7A", "#f9f9f9", "#1a1c1c", "#5f5e5e"],
    icon: "landscape",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#0A6847]/30 to-[#121212]",
    inspiration: {
      theme: "Premium interlocking and landscaping — stone-craft contractor with location-first trust.",
      colorPalette: "Forest stone green (#0A6847), mint accent (#4A9D7A), neutral gray MD3.",
      layout: "Multi-route contractor site — Toronto & Edmonton hubs, services bento, and detail pages.",
    },
  }),
  "power-pellet-electric": servicesCard("power-pellet-electric", {
    themeColors: ["#e9ea00", "#ffaaf7", "#006d8d", "#141408", "#e6e3ce", "#791a7b"],
    icon: "bolt",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#e9ea00]/25 to-[#0f0f04]",
    inspiration: {
      theme: "Retro arcade electrician — Pac-Man neon maze energy on a trades services site.",
      colorPalette: "Neon yellow (#e9ea00), hot pink (#ffaaf7), deep teal (#006d8d) on dark ground.",
      layout: "Multi-route trades demo — services grid, panel upgrade detail, resource articles, mobile nav.",
    },
  }),
  "comfortflow-hvac": servicesCard("comfortflow-hvac", {
    themeColors: ["#0a1422", "#00668a", "#40c2fd", "#fbf9fa", "#6366f1", "#44474c"],
    icon: "ac_unit",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#00668a]/25 to-[#fbf9fa]",
    inspiration: {
      theme: "Precision engineered HVAC — Geist typography with light-mode technical confidence.",
      colorPalette: "Midnight navy (#0a1422), cyan blue (#40c2fd), indigo accent (#6366f1), light gray.",
      layout: "Multi-route comfort hub — network map home, maintenance plans, service verticals, and booking.",
    },
  }),
  "spark-frame": servicesCard("spark-frame", {
    themeColors: ["#050505", "#D71920", "#F1222A", "#F2EDE4", "#111111", "#B8B3AC"],
    icon: "bolt",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#D71920]/20 to-[#050505]",
    inspiration: {
      theme: "Editorial comic-panel electrician — controlled energy through architectural cutaway illustration.",
      colorPalette: "Charcoal black (#050505), primary red (#D71920), warm off-white (#F2EDE4).",
      layout: "Multi-route trades demo — animated hero, editorial service grid, process circuit, resources.",
    },
  }),
};

export function templateMatchesFilter(slug: string, filter: GalleryFilterId): boolean {
  if (filter === "all") return true;
  const meta = GALLERY_CARD_META[slug];
  if (filter === "portfolio") return meta?.filterTags.includes("portfolio") ?? false;
  return meta?.filterTags.includes(filter) ?? filter === "services";
}

export function galleryFilterEmptyMessage(filter: GalleryFilterId): string {
  if (filter === "portfolio") {
    return "Portfolio inspirations are on the way — creative showcases and case-study layouts coming soon.";
  }
  if (filter === "ecommerce") {
    return "No e-commerce inspirations match this filter yet.";
  }
  return "No inspirations match this filter yet.";
}
