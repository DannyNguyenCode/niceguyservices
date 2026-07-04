import type { PetMarketProductSearchQuery } from "@/lib/templates/db/pet-market";
import { PET_MARKET_DEFAULT_PAGE_SIZE } from "@/lib/templates/db/pet-market/constants";

type PetMarketSort = NonNullable<PetMarketProductSearchQuery["sort"]>;

const SORT_VALUES = new Set<PetMarketSort>([
  "price-asc",
  "price-desc",
  "name-asc",
  "name-desc",
  "newest",
]);

function isPetMarketSort(value: string): value is PetMarketSort {
  return SORT_VALUES.has(value as PetMarketSort);
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

export function parsePetMarketProductsQuery(
  searchParams: URLSearchParams,
): PetMarketProductSearchQuery {
  const sortParam = searchParams.get("sort");
  const sort = sortParam && isPetMarketSort(sortParam) ? sortParam : undefined;

  const categories = readCsvParam(searchParams, "category");
  const petTypes =
    readCsvParam(searchParams, "pet_type") ?? readCsvParam(searchParams, "petType");
  const brands = readCsvParam(searchParams, "brand");

  const filter = {
    category: categories?.length === 1 ? categories[0] : categories,
    pet_type: petTypes?.length === 1 ? petTypes[0] : petTypes,
    brand: brands?.length === 1 ? brands[0] : brands,
    veterinarian_approved: readBoolean(searchParams.get("veterinarian_approved")),
    price_min: readNonNegativeNumber(searchParams.get("price_min")),
    price_max: readNonNegativeNumber(searchParams.get("price_max")),
    in_stock: readBoolean(searchParams.get("in_stock")),
  };

  const hasFilter = Object.values(filter).some((value) => value !== undefined);

  return {
    q: searchParams.get("q") ?? undefined,
    page: readPositiveInt(searchParams.get("page"), 1),
    pageSize: readPositiveInt(searchParams.get("pageSize"), PET_MARKET_DEFAULT_PAGE_SIZE),
    sort,
    filter: hasFilter ? filter : undefined,
  };
}
