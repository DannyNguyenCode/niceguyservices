import type { LooneyTunesProductSearchQuery } from "@/lib/templates/db/looney-tunes";
import { LOONEY_TUNES_DEFAULT_PAGE_SIZE } from "@/lib/templates/db/looney-tunes/constants";

type LooneyTunesSort = NonNullable<LooneyTunesProductSearchQuery["sort"]>;

const SORT_VALUES = new Set<LooneyTunesSort>([
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
  "newest",
]);

function isLooneyTunesSort(value: string): value is LooneyTunesSort {
  return SORT_VALUES.has(value as LooneyTunesSort);
}

function readPositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readNonNegativeNumber(value: string | null): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function readBoolean(value: string | null): boolean | undefined {
  if (value === null || value === "") return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

function readCsvParam(searchParams: URLSearchParams, key: string): string[] | undefined {
  const values = searchParams
    .getAll(key)
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
}

export function parseLooneyTunesProductsQuery(
  searchParams: URLSearchParams,
): LooneyTunesProductSearchQuery {
  const sortParam = searchParams.get("sort");
  const sort = sortParam && isLooneyTunesSort(sortParam) ? sortParam : undefined;

  const categories = readCsvParam(searchParams, "category");
  const sizes = readCsvParam(searchParams, "size");

  const filter = {
    category: categories?.length === 1 ? categories[0] : categories,
    size: sizes?.length === 1 ? sizes[0] : sizes,
    best_seller: readBoolean(searchParams.get("best_seller")),
    price_min: readNonNegativeNumber(searchParams.get("price_min")),
    price_max: readNonNegativeNumber(searchParams.get("price_max")),
  };

  const hasFilter = Object.values(filter).some((value) => value !== undefined);

  return {
    q: searchParams.get("q") ?? undefined,
    page: readPositiveInt(searchParams.get("page"), 1),
    pageSize: readPositiveInt(searchParams.get("pageSize"), LOONEY_TUNES_DEFAULT_PAGE_SIZE),
    sort,
    filter: hasFilter ? filter : undefined,
  };
}
