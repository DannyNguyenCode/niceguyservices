import { SPM_SEARCHABLE_PRODUCTS } from "../saturdayPetMarketData";
import { buildSpmProductSearchIndex } from "./buildSpmProductSearchIndex";
import { parseSpmSearchTerms, spmSearchRecordMatchesTerms } from "./spmProductSearchMatching";
import { SPM_SEARCH_DEFAULT_PAGE_SIZE } from "./spmProductSearchConfig";
import { sortSpmProducts } from "./spmProductSearchSorting";
import type {
  SpmProductSearchProvider,
  SpmProductSearchQuery,
  SpmProductSearchResult,
} from "./spmProductSearchTypes";

const catalogIndex = buildSpmProductSearchIndex(SPM_SEARCHABLE_PRODUCTS);

function searchInMemoryCatalog(query: SpmProductSearchQuery): SpmProductSearchResult {
  const terms = parseSpmSearchTerms(query.q ?? "");
  const sort = query.sort ?? "relevant";
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, query.pageSize ?? SPM_SEARCH_DEFAULT_PAGE_SIZE);

  const matched = catalogIndex.records
    .filter((record) => spmSearchRecordMatchesTerms(record, terms))
    .map((record) => record.product);

  const sorted = sortSpmProducts(matched, sort);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages: total === 0 ? 0 : totalPages,
  };
}

/** Default provider for the demo — replace via `setSpmProductSearchProvider` when catalog outgrows the client. */
export const spmInMemoryProductSearchProvider: SpmProductSearchProvider = {
  kind: "memory",
  search: searchInMemoryCatalog,
};
