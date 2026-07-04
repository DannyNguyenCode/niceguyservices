import type { Filter } from "mongodb";
import type {
  LooneyTunesProductDocument,
  LooneyTunesProductFilter,
} from "./types";
import { LOONEY_TUNES_SEARCH_FIELDS } from "./types";

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

export function readLooneyTunesFilterValues(
  value: string | string[] | undefined,
): string[] | undefined {
  if (!value) return undefined;
  const values = (Array.isArray(value) ? value : [value])
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
  return values.length > 0 ? values : undefined;
}

export function buildLooneyTunesMongoFilter(
  filter: LooneyTunesProductFilter = {},
): Filter<LooneyTunesProductDocument> {
  const mongoFilter: Filter<LooneyTunesProductDocument> = {};

  const categories = readLooneyTunesFilterValues(filter.category);
  const sizes = readLooneyTunesFilterValues(filter.size);

  if (categories) mongoFilter.category = exactMatchInFilter(categories);
  if (sizes) mongoFilter.size = exactMatchInFilter(sizes);
  if (typeof filter.best_seller === "boolean") {
    mongoFilter.best_seller = filter.best_seller;
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

export function buildLooneyTunesTextSearchFilter(
  query: string,
): Filter<LooneyTunesProductDocument> {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return {};

  return {
    $and: terms.map((term) => ({
      $or: LOONEY_TUNES_SEARCH_FIELDS.map((field) => ({
        [field]: { $regex: term, $options: "i" },
      })),
    })),
  };
}
