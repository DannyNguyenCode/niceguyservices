import { SPM_CATEGORY_SEARCH_EXPANSION } from "./spmProductSearchConfig";
import type { SpmProductSearchRecord } from "./spmProductSearchTypes";

export function parseSpmSearchTerms(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

export function spmSearchRecordMatchesTerms(record: SpmProductSearchRecord, terms: string[]): boolean {
  if (terms.length === 0) return true;
  return terms.every((term) => spmSearchTermMatchesRecord(term, record));
}

function spmSearchTermMatchesRecord(term: string, record: SpmProductSearchRecord): boolean {
  if (record.haystack.includes(term)) return true;

  const expanded = SPM_CATEGORY_SEARCH_EXPANSION[term];
  if (expanded?.some((category) => record.categories.includes(category))) {
    return true;
  }

  return record.categories.some((category) => category.includes(term));
}
