import type { SpmProduct } from "../saturdayPetMarketData";
import type { SpmProductSearchIndex, SpmProductSearchRecord } from "./spmProductSearchTypes";

/** Build once when the catalog is loaded or updated — not on every keystroke. */
export function buildSpmProductSearchRecord(product: SpmProduct): SpmProductSearchRecord {
  const haystack = [
    product.name,
    product.brand,
    product.subtitle,
    product.description,
    product.badge,
    product.tag,
    product.petType,
    ...product.categories,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return {
    id: product.id,
    product,
    haystack,
    categories: product.categories,
  };
}

export function buildSpmProductSearchIndex(products: readonly SpmProduct[]): SpmProductSearchIndex {
  return {
    records: products.map(buildSpmProductSearchRecord),
  };
}
