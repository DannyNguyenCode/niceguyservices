import type { Filter } from "mongodb";
import type {
  PetMarketProduct,
  PetMarketProductDocument,
  PetMarketProductFilter,
  PetMarketProductSearchQuery,
  PetMarketProductSearchResult,
} from "./types";
import { PET_MARKET_SEARCH_FIELDS } from "./types";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function exactMatchFilter(value: string) {
  return { $regex: `^${escapeRegex(value.trim())}$`, $options: "i" as const };
}

function exactMatchInFilter(values: string[]) {
  const normalized = values.map((value) => value.trim()).filter(Boolean);
  if (normalized.length === 0) return undefined;
  if (normalized.length === 1) return exactMatchFilter(normalized[0]);
  return {
    $in: normalized.map((value) => new RegExp(`^${escapeRegex(value)}$`, "i")),
  };
}

export function readPetMarketFilterValues(
  value: string | string[] | undefined,
): string[] | undefined {
  if (!value) return undefined;
  const values = (Array.isArray(value) ? value : [value])
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
}

export function buildPetMarketMongoFilter(
  filter: PetMarketProductFilter = {},
): Filter<PetMarketProductDocument> {
  const mongoFilter: Filter<PetMarketProductDocument> = {};

  const categories = readPetMarketFilterValues(filter.category);
  const petTypes = readPetMarketFilterValues(filter.pet_type);
  const brands = readPetMarketFilterValues(filter.brand);

  if (categories) mongoFilter.category = exactMatchInFilter(categories);
  if (petTypes) mongoFilter.pet_type = exactMatchInFilter(petTypes);
  if (brands) mongoFilter.brand = exactMatchInFilter(brands);
  if (typeof filter.veterinarian_approved === "boolean") {
    mongoFilter.veterinarian_approved = filter.veterinarian_approved;
  }
  if (typeof filter.in_stock === "boolean" && filter.in_stock) {
    mongoFilter.quantity = { $gt: 0 };
  }
  if (typeof filter.price_min === "number" || typeof filter.price_max === "number") {
    mongoFilter.price = {};
    if (typeof filter.price_min === "number") {
      mongoFilter.price.$gte = filter.price_min;
    }
    if (typeof filter.price_max === "number") {
      mongoFilter.price.$lte = filter.price_max;
    }
  }

  return mongoFilter;
}

export function buildPetMarketTextSearchFilter(
  query: string,
): Filter<PetMarketProductDocument> {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return {};

  return {
    $and: terms.map((term) => ({
      $or: PET_MARKET_SEARCH_FIELDS.map((field) => ({
        [field]: { $regex: term, $options: "i" },
      })),
    })),
  };
}

function matchesExactValues(fieldValue: string, allowed: string[]): boolean {
  const normalized = fieldValue.trim().toLowerCase();
  return allowed.some((value) => normalized === value.trim().toLowerCase());
}

/** In-memory mirror of `buildPetMarketMongoFilter` for unit tests and fixtures. */
export function productMatchesPetMarketFilter(
  product: PetMarketProduct,
  filter: PetMarketProductFilter = {},
): boolean {
  const categories = readPetMarketFilterValues(filter.category);
  const petTypes = readPetMarketFilterValues(filter.pet_type);
  const brands = readPetMarketFilterValues(filter.brand);

  if (categories && !matchesExactValues(product.category, categories)) return false;
  if (petTypes && !matchesExactValues(product.pet_type, petTypes)) return false;
  if (brands && !matchesExactValues(product.brand, brands)) return false;

  if (
    typeof filter.veterinarian_approved === "boolean" &&
    product.veterinarian_approved !== filter.veterinarian_approved
  ) {
    return false;
  }

  if (typeof filter.in_stock === "boolean" && filter.in_stock && product.quantity <= 0) {
    return false;
  }

  if (typeof filter.price_min === "number" && product.price < filter.price_min) return false;
  if (typeof filter.price_max === "number" && product.price > filter.price_max) return false;

  return true;
}

/** In-memory mirror of `buildPetMarketTextSearchFilter` for unit tests and fixtures. */
export function productMatchesPetMarketTextSearch(
  product: PetMarketProduct,
  query: string,
): boolean {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;

  return terms.every((term) => {
    const pattern = new RegExp(term, "i");
    return PET_MARKET_SEARCH_FIELDS.some((field) => {
      const value = product[field];
      return pattern.test(String(value ?? ""));
    });
  });
}

export function productMatchesPetMarketQuery(
  product: PetMarketProduct,
  query: PetMarketProductSearchQuery,
): boolean {
  if (query.q && !productMatchesPetMarketTextSearch(product, query.q)) return false;
  if (query.filter && !productMatchesPetMarketFilter(product, query.filter)) return false;
  return true;
}

function sortPetMarketProducts(
  products: PetMarketProduct[],
  sort: PetMarketProductSearchQuery["sort"] = "name-asc",
): PetMarketProduct[] {
  const items = [...products];
  switch (sort) {
    case "price-asc":
      return items.sort((a, b) => a.price - b.price);
    case "price-desc":
      return items.sort((a, b) => b.price - a.price);
    case "name-desc":
      return items.sort((a, b) => b.product_name.localeCompare(a.product_name));
    case "newest":
      return items;
    default:
      return items.sort((a, b) => a.product_name.localeCompare(b.product_name));
  }
}

type SearchableProduct = PetMarketProduct & { _id?: string };

/** Applies the same query contract as `GET /api/pet-market/products` against an in-memory catalog. */
export function searchPetMarketProductsInMemory(
  products: SearchableProduct[],
  query: PetMarketProductSearchQuery,
): PetMarketProductSearchResult {
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, query.pageSize ?? 24);
  const matched = sortPetMarketProducts(
    products.filter((product) => productMatchesPetMarketQuery(product, query)),
    query.sort,
  );
  const total = matched.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const slice = matched.slice(start, start + pageSize) as SearchableProduct[];

  return {
    items: slice.map((product, index) => {
      const { _id, ...rest } = product;
      return {
        ...rest,
        _id: _id ?? `fixture-${index}`,
      };
    }),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
