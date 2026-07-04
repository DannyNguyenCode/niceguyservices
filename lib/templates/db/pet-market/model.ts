import "server-only";

import { ObjectId, type Filter, type Sort } from "mongodb";
import { getTemplateCollection } from "../collections";
import {
  parsePetMarketProductDocument,
  parsePetMarketProductDocuments,
  parsePetMarketProductInput,
  parsePetMarketProductPatch,
  mergePetMarketProductUpdate,
  PET_MARKET_COLLECTION,
  toPetMarketProductDTO,
} from "./schema";
import type {
  PetMarketProductDocument,
  PetMarketProductFilter,
  PetMarketProductSearchQuery,
  PetMarketProductSearchResult,
  PetMarketProductDTO,
  PetMarketProductInput,
  PetMarketFulfillOrderInput,
  PetMarketFulfillOrderResult,
} from "./types";
import {
  PET_MARKET_DEFAULT_PAGE_SIZE,
  PET_MARKET_HOMEPAGE_FEATURED_LIMIT,
  PET_MARKET_HOMEPAGE_FEATURED_NAMES,
} from "./constants";
import { enrichPetMarketProductWithAvailability } from "./reservations";
import { PetMarketInventoryError } from "./errors";
import {
  buildPetMarketMongoFilter,
  buildPetMarketTextSearchFilter,
} from "./search-filters";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getPetMarketCollection() {
  return getTemplateCollection<PetMarketProductDocument>(PET_MARKET_COLLECTION);
}

function buildSort(sort: PetMarketProductSearchQuery["sort"] = "name-asc"): Sort {
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

function sortProductsByNameOrder(
  items: PetMarketProductDTO[],
  names: readonly string[],
): PetMarketProductDTO[] {
  const order = new Map(names.map((name, index) => [name.trim().toLowerCase(), index]));
  return [...items].sort((a, b) => {
    const aIndex = order.get(a.product_name.trim().toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    const bIndex = order.get(b.product_name.trim().toLowerCase()) ?? Number.MAX_SAFE_INTEGER;
    return aIndex - bIndex;
  });
}

async function enrichProductDtos(docs: PetMarketProductDocument[]): Promise<PetMarketProductDTO[]> {
  return Promise.all(
    parsePetMarketProductDocuments(docs)
      .map(toPetMarketProductDTO)
      .map((item) => enrichPetMarketProductWithAvailability(item)),
  );
}

/**
 * Homepage Saturday Morning Specials.
 * 1. Prefer rows with `featured: true` when present in the catalog.
 * 2. Until mock data has that flag, match `PET_MARKET_HOMEPAGE_FEATURED_NAMES`.
 * 3. Fill any remaining slots with in-stock products.
 */
export async function findPetMarketFeaturedProducts(
  limit = PET_MARKET_HOMEPAGE_FEATURED_LIMIT,
): Promise<PetMarketProductDTO[]> {
  const collection = await getPetMarketCollection();
  const resolved: PetMarketProductDTO[] = [];
  const seenIds = new Set<string>();

  const pushUnique = (items: PetMarketProductDTO[]) => {
    for (const item of items) {
      if (resolved.length >= limit) break;
      if (seenIds.has(item._id)) continue;
      seenIds.add(item._id);
      resolved.push(item);
    }
  };

  const featuredDocs = await collection
    .find({ featured: true })
    .sort({ product_name: 1 })
    .limit(limit)
    .toArray();
  pushUnique(await enrichProductDtos(featuredDocs));

  if (resolved.length < limit) {
    const namePatterns = PET_MARKET_HOMEPAGE_FEATURED_NAMES.map(
      (name) => new RegExp(`^${escapeRegex(name)}$`, "i"),
    );
    const excludeIds = [...seenIds]
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));
    const fallbackDocs = await collection
      .find({
        product_name: { $in: namePatterns },
        ...(excludeIds.length > 0 ? { _id: { $nin: excludeIds } } : {}),
      })
      .toArray();
    pushUnique(sortProductsByNameOrder(await enrichProductDtos(fallbackDocs), PET_MARKET_HOMEPAGE_FEATURED_NAMES));
  }

  if (resolved.length < limit) {
    const excludeIds = [...seenIds]
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));
    const fillerDocs = await collection
      .find({
        quantity: { $gt: 0 },
        ...(excludeIds.length > 0 ? { _id: { $nin: excludeIds } } : {}),
      })
      .sort({ product_name: 1 })
      .limit(limit - resolved.length)
      .toArray();
    pushUnique(await enrichProductDtos(fillerDocs));
  }

  return resolved.slice(0, limit);
}

export async function findPetMarketProducts(
  query: PetMarketProductSearchQuery = {},
): Promise<PetMarketProductSearchResult> {
  const collection = await getPetMarketCollection();
  const page = Math.max(1, query.page ?? 1);
  const pageSize = Math.max(1, query.pageSize ?? PET_MARKET_DEFAULT_PAGE_SIZE);
  const filter: Filter<PetMarketProductDocument> = {
    ...buildPetMarketMongoFilter(query.filter),
    ...buildPetMarketTextSearchFilter(query.q ?? ""),
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

  const items = await Promise.all(
    parsePetMarketProductDocuments(docs)
      .map(toPetMarketProductDTO)
      .map((item) => enrichPetMarketProductWithAvailability(item)),
  );
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    items,
    total,
    page: totalPages === 0 ? 1 : Math.min(page, totalPages),
    pageSize,
    totalPages,
  };
}

export async function findPetMarketProductById(id: string): Promise<PetMarketProductDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const collection = await getPetMarketCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return null;

  return enrichPetMarketProductWithAvailability(
    toPetMarketProductDTO(parsePetMarketProductDocument(doc)),
  );
}

export async function findAllPetMarketProducts(): Promise<PetMarketProductDTO[]> {
  const collection = await getPetMarketCollection();
  const docs = await collection.find({}).sort({ product_name: 1 }).toArray();
  return parsePetMarketProductDocuments(docs).map(toPetMarketProductDTO);
}

export async function countPetMarketProducts(filter: PetMarketProductFilter = {}): Promise<number> {
  const collection = await getPetMarketCollection();
  return collection.countDocuments(buildPetMarketMongoFilter(filter));
}

/** Distinct category values — useful for shop filters. */
export async function listPetMarketCategories(): Promise<string[]> {
  const collection = await getPetMarketCollection();
  return collection.distinct("category");
}

/** Distinct pet types — useful for shop filters. */
export async function listPetMarketPetTypes(): Promise<string[]> {
  const collection = await getPetMarketCollection();
  return collection.distinct("pet_type");
}

function productFromDto(dto: PetMarketProductDTO): PetMarketProductInput {
  const { _id, ...product } = dto;
  void _id;
  return product;
}

export async function createPetMarketProduct(input: PetMarketProductInput): Promise<PetMarketProductDTO> {
  if (input.quantity < 0) {
    throw new PetMarketInventoryError("Quantity cannot be negative", "INVALID_QUANTITY");
  }
  if (input.price < 0) {
    throw new PetMarketInventoryError("Price cannot be negative", "INVALID_PRICE");
  }

  const collection = await getPetMarketCollection();
  const result = await collection.insertOne(
    input as unknown as Parameters<typeof collection.insertOne>[0],
  );
  const doc = await collection.findOne({ _id: result.insertedId });
  if (!doc) {
    throw new Error("Failed to read product after insert");
  }
  return enrichPetMarketProductWithAvailability(
    toPetMarketProductDTO(parsePetMarketProductDocument(doc)),
  );
}

export async function updatePetMarketProduct(
  id: string,
  patch: Partial<PetMarketProductInput>,
): Promise<PetMarketProductDTO | null> {
  if (!ObjectId.isValid(id)) return null;

  const existing = await findPetMarketProductById(id);
  if (!existing) return null;

  const merged = mergePetMarketProductUpdate(productFromDto(existing), patch);
  if (merged.quantity < 0) {
    throw new PetMarketInventoryError("Quantity cannot be negative", "INVALID_QUANTITY");
  }
  if (merged.price < 0) {
    throw new PetMarketInventoryError("Price cannot be negative", "INVALID_PRICE");
  }

  const collection = await getPetMarketCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: patch },
    { returnDocument: "after" },
  );

  if (!result) return null;
  return toPetMarketProductDTO(parsePetMarketProductDocument(result));
}

export async function deletePetMarketProduct(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getPetMarketCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

function generateConfirmationNumber(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `SM-1989-${suffix}`;
}

export async function fulfillPetMarketOrder(
  input: PetMarketFulfillOrderInput,
): Promise<PetMarketFulfillOrderResult> {
  const lines = input.items ?? [];
  if (lines.length === 0) {
    throw new PetMarketInventoryError("Order must include at least one item", "EMPTY_ORDER");
  }

  const normalized = new Map<string, number>();
  for (const line of lines) {
    if (!line.product_id?.trim()) {
      throw new PetMarketInventoryError("Each item requires a product_id", "INVALID_ITEM");
    }
    if (!ObjectId.isValid(line.product_id)) {
      throw new PetMarketInventoryError(`Invalid product id: ${line.product_id}`, "INVALID_ITEM");
    }
    const qty = Number(line.quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new PetMarketInventoryError("Quantity must be a positive number", "INVALID_QUANTITY");
    }
    normalized.set(line.product_id, (normalized.get(line.product_id) ?? 0) + qty);
  }

  const collection = await getPetMarketCollection();
  const updated: PetMarketProductDTO[] = [];

  for (const [productId, quantity] of normalized) {
    const objectId = new ObjectId(productId);
    const doc = await collection.findOne({ _id: objectId });
    if (!doc) {
      throw new PetMarketInventoryError(`Product not found: ${productId}`, "NOT_FOUND", 404);
    }

    const product = parsePetMarketProductDocument(doc);
    if (product.quantity < quantity) {
      throw new PetMarketInventoryError(
        `Insufficient stock for ${product.product_name}. Available: ${product.quantity}, requested: ${quantity}`,
        "INSUFFICIENT_STOCK",
        409,
      );
    }

    const next = await collection.findOneAndUpdate(
      { _id: objectId, quantity: { $gte: quantity } },
      { $inc: { quantity: -quantity } },
      { returnDocument: "after" },
    );

    if (!next) {
      throw new PetMarketInventoryError(
        `Insufficient stock for ${product.product_name}`,
        "INSUFFICIENT_STOCK",
        409,
      );
    }

    updated.push(toPetMarketProductDTO(parsePetMarketProductDocument(next)));
  }

  return {
    confirmation_number: generateConfirmationNumber(),
    items: updated,
  };
}

export { parsePetMarketProductInput, parsePetMarketProductPatch };
