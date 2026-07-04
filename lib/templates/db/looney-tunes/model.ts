import "server-only";

import { ObjectId, type Filter, type Sort } from "mongodb";
import { getTemplateCollection } from "../collections";
import {
  LOONEY_TUNES_COLLECTION,
  parseLooneyTunesProductDocument,
  parseLooneyTunesProductDocuments,
  toLooneyTunesProductDTO,
} from "./schema";
import type {
  LooneyTunesProductDocument,
  LooneyTunesProductDTO,
  LooneyTunesProductFilter,
  LooneyTunesProductSearchQuery,
  LooneyTunesProductSearchResult,
} from "./types";
import { LOONEY_TUNES_DEFAULT_PAGE_SIZE } from "./constants";
import {
  buildLooneyTunesMongoFilter,
  buildLooneyTunesTextSearchFilter,
} from "./search-filters";

export async function getLooneyTunesCollection() {
  return getTemplateCollection<LooneyTunesProductDocument>(LOONEY_TUNES_COLLECTION);
}

function buildSort(sort: LooneyTunesProductSearchQuery["sort"] = "name-asc"): Sort {
  switch (sort) {
    case "price-asc":
      return { price: 1 };
    case "price-desc":
      return { price: -1 };
    case "name-desc":
      return { product_name: -1 };
    case "newest":
      return { _id: -1 };
    default:
      return { product_name: 1 };
  }
}

export async function findLooneyTunesProducts(
  query: LooneyTunesProductSearchQuery = {},
): Promise<LooneyTunesProductSearchResult> {
  const collection = await getLooneyTunesCollection();
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, query.pageSize ?? LOONEY_TUNES_DEFAULT_PAGE_SIZE);
  const filter: Filter<LooneyTunesProductDocument> = {
    ...buildLooneyTunesMongoFilter(query.filter),
    ...buildLooneyTunesTextSearchFilter(query.q ?? ""),
  };

  const [docs, total] = await Promise.all([
    collection
      .find(filter)
      .sort(buildSort(query.sort))
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  const items = parseLooneyTunesProductDocuments(docs).map(toLooneyTunesProductDTO);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    items,
    total,
    page: totalPages === 0 ? 1 : Math.min(page, totalPages),
    pageSize,
    totalPages,
  };
}

export async function findLooneyTunesProductById(id: string): Promise<LooneyTunesProductDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getLooneyTunesCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;

  return toLooneyTunesProductDTO(parseLooneyTunesProductDocument(doc));
}

export async function listLooneyTunesCategories(): Promise<string[]> {
  const collection = await getLooneyTunesCollection();
  const values = await collection.distinct("category");
  return values.filter((value): value is string => typeof value === "string").sort();
}

export async function listLooneyTunesSizes(): Promise<string[]> {
  const collection = await getLooneyTunesCollection();
  const values = await collection.distinct("size");
  return values.filter((value): value is string => typeof value === "string").sort();
}

export async function countLooneyTunesProducts(filter: LooneyTunesProductFilter = {}): Promise<number> {
  const collection = await getLooneyTunesCollection();
  return collection.countDocuments(buildLooneyTunesMongoFilter(filter));
}
