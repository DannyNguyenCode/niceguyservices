/**
 * Product search facade for Saturday Morning Pet Market.
 *
 * **Today (small catalog):** in-memory provider with a prebuilt index — no network, no per-query haystack rebuild.
 *
 * **At scale (100k+ SKUs):**
 * 1. Implement `SpmProductSearchProvider` with `kind: "remote"` (API route + search engine or DB FTS).
 * 2. Call `setSpmProductSearchProvider(remoteProvider)` once at app bootstrap.
 * 3. Build the index at ingest/webhook time — never ship the full catalog to the browser.
 * 4. Keep this `SpmProductSearchQuery` shape so shop UI only changes the provider wiring.
 * 5. Debounce nav search input; pass `page` / `pageSize` so the server returns one page only.
 */

import { spmInMemoryProductSearchProvider } from "./spmInMemoryProductSearch";
import type { SpmProductSearchProvider, SpmProductSearchQuery, SpmProductSearchResult } from "./spmProductSearchTypes";

let activeProvider: SpmProductSearchProvider = spmInMemoryProductSearchProvider;

export function setSpmProductSearchProvider(provider: SpmProductSearchProvider): void {
  activeProvider = provider;
}

export function getSpmProductSearchProvider(): SpmProductSearchProvider {
  return activeProvider;
}

export function searchSpmProducts(query: SpmProductSearchQuery): SpmProductSearchResult {
  const result = activeProvider.search(query);
  if (result instanceof Promise) {
    throw new Error(
      "searchSpmProducts received a Promise. Use searchSpmProductsAsync when a remote provider is configured.",
    );
  }
  return result;
}

export async function searchSpmProductsAsync(query: SpmProductSearchQuery): Promise<SpmProductSearchResult> {
  return await activeProvider.search(query);
}

export const spmProductSearch = {
  search: searchSpmProducts,
  searchAsync: searchSpmProductsAsync,
  setProvider: setSpmProductSearchProvider,
  getProvider: getSpmProductSearchProvider,
};

export type { SpmProductSearchQuery, SpmProductSearchResult, SpmProductSearchProvider, SpmProductSort } from "./spmProductSearchTypes";
export { SPM_SEARCH_DEFAULT_PAGE_SIZE } from "./spmProductSearchConfig";
export { sortSpmProducts } from "./spmProductSearchSorting";
