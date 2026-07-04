import type { SpmProduct } from "./saturdayPetMarketData";

export type SpmHomeFeaturedCard = {
  product: SpmProduct;
  desc: string;
  badge: string;
  badgeClass: string;
};

/** Flyer badge + blurb keyed by catalog `product_name` (case-insensitive). */
const DISPLAY_BY_PRODUCT_NAME: Record<string, Omit<SpmHomeFeaturedCard, "product">> = {
  "premium grain-free kibble": {
    desc: "A neighborhood favorite! High protein, ethically sourced, and pets love the taste.",
    badge: "LIMITED STOCK",
    badgeClass: "bg-[var(--spm-primary)]",
  },
  "interactive squeakies": {
    desc: "Keep them busy for hours with our new collection of retro-styled plushies.",
    badge: "BUY 2 GET 1",
    badgeClass: "bg-[var(--spm-tertiary)]",
  },
  "artisan bakery biscuits": {
    desc: "Baked fresh every morning in-store. Natural honey and pumpkin flavors.",
    badge: "LOCAL FAVORITE",
    badgeClass: "bg-[var(--spm-secondary)]",
  },
};

const DEFAULT_BADGES = [
  { badge: "LIMITED STOCK", badgeClass: "bg-[var(--spm-primary)]" },
  { badge: "BUY 2 GET 1", badgeClass: "bg-[var(--spm-tertiary)]" },
  { badge: "LOCAL FAVORITE", badgeClass: "bg-[var(--spm-secondary)]" },
] as const;

export function toSpmHomeFeaturedCard(product: SpmProduct, index: number): SpmHomeFeaturedCard {
  const display = DISPLAY_BY_PRODUCT_NAME[product.name.trim().toLowerCase()];
  const fallbackBadge = DEFAULT_BADGES[index % DEFAULT_BADGES.length];

  return {
    product,
    desc:
      display?.desc ??
      product.description ??
      "Quality treats and supplies from our neighborhood market.",
    badge: display?.badge ?? fallbackBadge.badge,
    badgeClass: display?.badgeClass ?? fallbackBadge.badgeClass,
  };
}

export function toSpmHomeFeaturedCards(products: SpmProduct[]): SpmHomeFeaturedCard[] {
  return products.map((product, index) => toSpmHomeFeaturedCard(product, index));
}
