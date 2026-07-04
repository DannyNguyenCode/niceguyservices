import type { SpmProduct } from "./saturdayPetMarketData";
import type { SpmAvailabilityId, SpmShopFilters } from "./spmShopFilters";

export type SpmEnrichedProduct = SpmProduct & {
  availability: SpmAvailabilityId[];
};

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 1000;
  }
  return hash;
}

export function enrichSpmProduct(product: SpmProduct): SpmEnrichedProduct {
  const hash = hashId(product.id);
  const availability: SpmAvailabilityId[] = ["in_stock"];

  if (hash % 3 === 0) availability.push("local_pickup");
  if (hash % 5 === 0) availability.push("same_day");
  if (hash % 4 === 0) availability.push("online_only");

  return { ...product, availability };
}

export function applySpmClientFilters(
  products: SpmProduct[],
  filters: SpmShopFilters,
): SpmProduct[] {
  const needsClientFilter = Boolean(
    filters.ratingMin ||
      filters.saleOnly ||
      filters.availability.some((item) => item !== "in_stock"),
  );

  if (!needsClientFilter) return products;

  return products
    .map(enrichSpmProduct)
    .filter((product) => {
      if (filters.ratingMin && product.rating < filters.ratingMin) return false;
      if (filters.saleOnly && !product.salePrice) return false;

      const clientAvailability = filters.availability.filter((item) => item !== "in_stock");
      if (clientAvailability.length > 0) {
        const matches = clientAvailability.some((item) => product.availability.includes(item));
        if (!matches) return false;
      }

      return true;
    });
}

export function spmNeedsClientFetchAll(filters: SpmShopFilters): boolean {
  return Boolean(
    filters.ratingMin ||
      filters.saleOnly ||
      filters.availability.some((item) => item !== "in_stock"),
  );
}
