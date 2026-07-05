import { DEMO_HERO_BY_SLUG } from "@/lib/templates/demoHeroImages";

export type GalleryFilterId = "all" | "ecommerce" | "services" | "portfolio";

export type GalleryStackType = "ecommerce" | "services";

export const GALLERY_FILTERS: { id: GalleryFilterId; label: string }[] = [
  { id: "all", label: "All Inspirations" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "services", label: "Business Websites" },
  { id: "portfolio", label: "Portfolio" },
];

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
  }),
  "neopets-nonprofit": servicesCard("neopets-nonprofit", {
    themeColors: ["#0d658c", "#2e6b29", "#eec750", "#adf19e", "#fcf2e6", "#8fd3ff"],
    icon: "favorite",
    iconClassName: "text-tertiary-fixed-dim",
    gradientClassName: "bg-linear-to-br from-purple-500/20 to-[#121212]",
  }),
  "tmnt-trades": servicesCard("tmnt-trades", {
    themeColors: ["#216b41", "#a8f3bd", "#225cb4", "#ac3231", "#ecefe9", "#bfc9be"],
    icon: "engineering",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-green-900/40 to-[#121212]",
  }),
  "looneytunes-services": ecommerceCard("looneytunes-services", {
    themeColors: ["#151c28", "#495e84", "#d4daec", "#dde2f4", "#f9f9ff", "#e2e8fa"],
    icon: "shopping_bag",
    iconClassName: "text-secondary-container",
    gradientClassName: "bg-linear-to-br from-orange-600/20 to-[#121212]",
  }),
  "party-smile-dental": servicesCard(undefined, {
    themeColors: ["#ef4444", "#3b82f6", "#eab308", "#22c55e", "#fffef8", "#1a1a1a"],
    icon: "medical_services",
    iconClassName: "text-secondary-container",
    gradientClassName: "bg-[#ef4444]/25",
  }),
  "companion-pet": ecommerceCard("companion-pet", {
    themeColors: ["#fafaf9", "#5b8def", "#e8954c", "#6bbf8a", "#1c1c1e", "#f0eeeb"],
    icon: "shopping_bag",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#5b8def]/20 to-[#121212]",
  }),
  pawsome: ecommerceCard("pawsome", {
    themeColors: ["#f9f9f9", "#0060ac", "#cc8600", "#68abff", "#181919", "#ffffff"],
    icon: "shopping_bag",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#0060ac]/25 to-[#121212]",
  }),
  "starlight-command": servicesCard("starlight-command", {
    themeColors: ["#ee671c", "#ffb595", "#ffdd74", "#131313", "#594238", "#353535"],
    icon: "bolt",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#ee671c]/25 to-[#121212]",
  }),
  "evergreen-alpine": servicesCard("evergreen-alpine", {
    themeColors: ["#012d1d", "#1b4332", "#c1ecd4", "#fbf9f8", "#653d26", "#171b2b"],
    icon: "eco",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#012d1d]/40 to-[#121212]",
  }),
  "lumina-landscapes": servicesCard("lumina-landscapes", {
    themeColors: ["#121412", "#b8956a", "#6b7f62", "#f4efe6", "#1a1c1a", "#8a7355"],
    icon: "park",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#6b7f62]/30 to-[#121212]",
  }),
  "pawsmatch-rescue": servicesCard("pawsmatch-rescue", {
    themeColors: ["#faf7f2", "#c67b5c", "#8ba888", "#3d2e2a", "#fffdf9", "#f3ede4"],
    icon: "pets",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#c67b5c]/20 to-[#121212]",
  }),
  "luxe-co": servicesCard("luxe-co", {
    themeColors: ["#f9f8f3", "#1a1a1a", "#c5a059", "#e5e1d8", "#fffdf9", "#5c5c5c"],
    icon: "home_work",
    iconClassName: "text-secondary-container",
    gradientClassName: "bg-linear-to-br from-[#c5a059]/25 to-[#121212]",
  }),
  "home-restoration": servicesCard("home-restoration", {
    themeColors: ["#faf9f6", "#1c1c1c", "#b8956a", "#e8e3d8", "#fffdf9", "#5a5a5a"],
    icon: "spa",
    iconClassName: "text-secondary-container",
    gradientClassName: "bg-linear-to-br from-[#b8956a]/25 to-[#1c1c1c]",
  }),
  "liquid-occasions": servicesCard(undefined, {
    themeColors: ["#bf0014", "#fdd815", "#f7f9fb", "#1a1c1e", "#ffffff", "#6a758a"],
    icon: "celebration",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#bf0014]/30 to-[#121212]",
  }),
  "kinship-capital": servicesCard("kinship-capital", {
    themeColors: ["#0058be", "#2170e4", "#d8e2ff", "#f7f9fb", "#191c1e", "#6a758a"],
    icon: "account_balance",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#0058be]/30 to-[#121212]",
  }),
  "skyline-designs": portfolioCard("skyline-designs", {
    themeColors: ["#0c6780", "#87ceeb", "#baeaff", "#f7f9ff", "#091d2e", "#d1e4fb"],
    icon: "cloud",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#0c6780]/30 to-[#e3efff]",
  }),
  "hardscape-landscaping": servicesCard("hardscape-landscaping", {
    themeColors: ["#0A6847", "#0D7A52", "#4A9D7A", "#f9f9f9", "#1a1c1c", "#5f5e5e"],
    icon: "landscape",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#0A6847]/30 to-[#121212]",
  }),
  "power-pellet-electric": servicesCard("power-pellet-electric", {
    themeColors: ["#e9ea00", "#ffaaf7", "#006d8d", "#141408", "#e6e3ce", "#791a7b"],
    icon: "bolt",
    iconClassName: "text-primary-fixed",
    gradientClassName: "bg-linear-to-br from-[#e9ea00]/25 to-[#0f0f04]",
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
