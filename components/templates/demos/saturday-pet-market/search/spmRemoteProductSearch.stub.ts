/**
 * Example remote provider — wire up when the catalog moves off the client.
 *
 * ```ts
 * import { setSpmProductSearchProvider } from "./spmProductSearch";
 * import { spmRemoteProductSearchProvider } from "./spmRemoteProductSearch.stub";
 *
 * setSpmProductSearchProvider(spmRemoteProductSearchProvider);
 * ```
 *
 * Pair with a Route Handler that queries Typesense, Elasticsearch, or Postgres FTS
 * and returns `SpmProductSearchResult` without loading the full catalog into memory.
 */

import type { SpmProductSearchProvider } from "./spmProductSearchTypes";

export const spmRemoteProductSearchProvider: SpmProductSearchProvider = {
  kind: "remote",
  async search(query) {
    const params = new URLSearchParams();
    if (query.q) params.set("q", query.q);
    if (query.sort) params.set("sort", query.sort);
    if (query.page) params.set("page", String(query.page));
    if (query.pageSize) params.set("pageSize", String(query.pageSize));

    const response = await fetch(`/api/spm/products/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`SPM product search failed (${response.status})`);
    }

    return (await response.json()) as Awaited<ReturnType<NonNullable<SpmProductSearchProvider["search"]>>>;
  },
};
