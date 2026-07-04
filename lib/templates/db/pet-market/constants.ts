/** Default catalog page size for shop/search API requests. */
export const PET_MARKET_DEFAULT_PAGE_SIZE = 12;

/** How long checkout holds inventory before releasing back to the shelf. */
export const PET_MARKET_RESERVATION_TTL_MS = 15 * 60 * 1000;

export const PET_MARKET_RESERVATION_TTL_MINUTES = 15;

/** Homepage Saturday Morning Specials — shown when no `featured: true` rows exist yet. */
export const PET_MARKET_HOMEPAGE_FEATURED_LIMIT = 3;

/**
 * Hardcoded flyer picks until catalog rows include `featured: true`.
 * Matched case-insensitively against `product_name` in MongoDB.
 */
export const PET_MARKET_HOMEPAGE_FEATURED_NAMES = [
  "Premium Grain-Free Kibble",
  "Interactive Squeakies",
  "Artisan Bakery Biscuits",
] as const;
