import type { SpmProduct, SpmProductCategory } from "../saturdayPetMarketData";

export type SpmProductSort = "relevant" | "price-asc" | "price-desc" | "newest";

/** Query contract shared by in-memory and future remote search backends. */
export type SpmProductSearchQuery = {
  q?: string;
  sort?: SpmProductSort;
  page?: number;
  pageSize?: number;
};

export type SpmProductSearchResult = {
  items: SpmProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Precomputed row for fast scans on small catalogs.
 * At scale, equivalent fields live in Elasticsearch/Typesense/Postgres FTS — not in the browser.
 */
export type SpmProductSearchRecord = {
  id: string;
  product: SpmProduct;
  haystack: string;
  categories: readonly SpmProductCategory[];
};

export type SpmProductSearchIndex = {
  records: readonly SpmProductSearchRecord[];
};

/**
 * Swappable search backend.
 *
 * Demo: `memory` — synchronous filter over a prebuilt index in the bundle.
 * Scale: `remote` — `fetch('/api/...')` with server-side index, debounced client, paginated responses.
 */
export interface SpmProductSearchProvider {
  readonly kind: "memory" | "remote";
  search(query: SpmProductSearchQuery): SpmProductSearchResult | Promise<SpmProductSearchResult>;
}
