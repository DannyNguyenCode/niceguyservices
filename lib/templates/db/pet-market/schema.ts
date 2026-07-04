import { ObjectId } from "mongodb";
import type { PetMarketProduct, PetMarketProductDocument, PetMarketProductDTO } from "./types";

export const PET_MARKET_COLLECTION = "pet_market" as const;

/** Runtime field definitions for validation and documentation. */
export const petMarketProductSchema = {
  product_name: { type: "string", required: true },
  brand: { type: "string", required: true },
  category: { type: "string", required: true },
  price: { type: "number", required: true },
  quantity: { type: "number", required: true },
  description: { type: "string", required: true },
  size: { type: "string", required: true },
  color: { type: "string", required: true },
  material: { type: "string", required: true },
  weight: { type: "number", required: true },
  expiration_date: { type: "string", required: true },
  recommended_age: { type: "number", required: true },
  breed_size: { type: "string", required: true },
  pet_type: { type: "string", required: true },
  veterinarian_approved: { type: "boolean", required: true },
  featured: { type: "boolean", required: false },
} as const;

function readString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`pet_market.${field} must be a string`);
  }
  return value;
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`pet_market.${field} must be a number`);
  }
  return value;
}

function readBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`pet_market.${field} must be a boolean`);
  }
  return value;
}

/** Validate and map a MongoDB document to a typed `PetMarketProductDocument`. */
export function parsePetMarketProductDocument(value: unknown): PetMarketProductDocument {
  if (!value || typeof value !== "object") {
    throw new Error("pet_market document must be an object");
  }

  const doc = value as Record<string, unknown>;
  const id = doc._id;

  if (!(id instanceof ObjectId)) {
    throw new Error("pet_market._id must be an ObjectId");
  }

  const product: PetMarketProduct = {
    product_name: readString(doc.product_name, "product_name"),
    brand: readString(doc.brand, "brand"),
    category: readString(doc.category, "category"),
    price: readNumber(doc.price, "price"),
    quantity: readNumber(doc.quantity, "quantity"),
    description: readString(doc.description, "description"),
    size: readString(doc.size, "size"),
    color: readString(doc.color, "color"),
    material: readString(doc.material, "material"),
    weight: readNumber(doc.weight, "weight"),
    expiration_date: readString(doc.expiration_date, "expiration_date"),
    recommended_age: readNumber(doc.recommended_age, "recommended_age"),
    breed_size: readString(doc.breed_size, "breed_size"),
    pet_type: readString(doc.pet_type, "pet_type"),
    veterinarian_approved: readBoolean(doc.veterinarian_approved, "veterinarian_approved"),
    featured: readOptionalBoolean(doc.featured, "featured"),
  };

  return { _id: id, ...product };
}

/** Map a typed MongoDB document to a JSON-serializable DTO. */
export function toPetMarketProductDTO(doc: PetMarketProductDocument): PetMarketProductDTO {
  return {
    _id: doc._id.toHexString(),
    product_name: doc.product_name,
    brand: doc.brand,
    category: doc.category,
    price: doc.price,
    quantity: doc.quantity,
    description: doc.description,
    size: doc.size,
    color: doc.color,
    material: doc.material,
    weight: doc.weight,
    expiration_date: doc.expiration_date,
    recommended_age: doc.recommended_age,
    breed_size: doc.breed_size,
    pet_type: doc.pet_type,
    veterinarian_approved: doc.veterinarian_approved,
    ...(doc.featured !== undefined ? { featured: doc.featured } : {}),
  };
}

/** Parse many documents, skipping invalid rows instead of failing the whole batch. */
export function parsePetMarketProductDocuments(values: unknown[]): PetMarketProductDocument[] {
  const parsed: PetMarketProductDocument[] = [];

  for (const value of values) {
    try {
      parsed.push(parsePetMarketProductDocument(value));
    } catch {
      // Skip malformed documents in list responses.
    }
  }

  return parsed;
}

function readOptionalNumber(value: unknown, field: string): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) {
    throw new Error(`pet_market.${field} must be a number`);
  }
  return num;
}

function readOptionalBoolean(value: unknown, field: string): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  throw new Error(`pet_market.${field} must be a boolean`);
}

/** Validate create payload from JSON (coerces numeric strings). */
export function parsePetMarketProductInput(value: unknown): PetMarketProduct {
  if (!value || typeof value !== "object") {
    throw new Error("pet_market payload must be an object");
  }

  const body = value as Record<string, unknown>;

  return {
    product_name: readString(body.product_name, "product_name"),
    brand: readString(body.brand, "brand"),
    category: readString(body.category, "category"),
    price: readOptionalNumber(body.price, "price")!,
    quantity: readOptionalNumber(body.quantity, "quantity")!,
    description: readString(body.description, "description"),
    size: readString(body.size, "size"),
    color: readString(body.color, "color"),
    material: readString(body.material, "material"),
    weight: readOptionalNumber(body.weight, "weight")!,
    expiration_date: readString(body.expiration_date, "expiration_date"),
    recommended_age: readOptionalNumber(body.recommended_age, "recommended_age")!,
    breed_size: readString(body.breed_size, "breed_size"),
    pet_type: readString(body.pet_type, "pet_type"),
    veterinarian_approved: readOptionalBoolean(body.veterinarian_approved, "veterinarian_approved") ?? false,
    featured: readOptionalBoolean(body.featured, "featured"),
  };
}

/** Validate a partial update — only fields present in the body are returned. */
export function parsePetMarketProductPatch(value: unknown): Partial<PetMarketProduct> {
  if (!value || typeof value !== "object") {
    throw new Error("pet_market patch must be an object");
  }

  const body = value as Record<string, unknown>;
  const patch: Partial<PetMarketProduct> = {};

  if (body.product_name !== undefined) patch.product_name = readString(body.product_name, "product_name");
  if (body.brand !== undefined) patch.brand = readString(body.brand, "brand");
  if (body.category !== undefined) patch.category = readString(body.category, "category");
  if (body.price !== undefined) patch.price = readOptionalNumber(body.price, "price")!;
  if (body.quantity !== undefined) patch.quantity = readOptionalNumber(body.quantity, "quantity")!;
  if (body.description !== undefined) patch.description = readString(body.description, "description");
  if (body.size !== undefined) patch.size = readString(body.size, "size");
  if (body.color !== undefined) patch.color = readString(body.color, "color");
  if (body.material !== undefined) patch.material = readString(body.material, "material");
  if (body.weight !== undefined) patch.weight = readOptionalNumber(body.weight, "weight")!;
  if (body.expiration_date !== undefined) {
    patch.expiration_date = readString(body.expiration_date, "expiration_date");
  }
  if (body.recommended_age !== undefined) {
    patch.recommended_age = readOptionalNumber(body.recommended_age, "recommended_age")!;
  }
  if (body.breed_size !== undefined) patch.breed_size = readString(body.breed_size, "breed_size");
  if (body.pet_type !== undefined) patch.pet_type = readString(body.pet_type, "pet_type");
  if (body.veterinarian_approved !== undefined) {
    patch.veterinarian_approved = readOptionalBoolean(body.veterinarian_approved, "veterinarian_approved")!;
  }
  if (body.featured !== undefined) {
    patch.featured = readOptionalBoolean(body.featured, "featured")!;
  }

  if (Object.keys(patch).length === 0) {
    throw new Error("pet_market patch must include at least one field");
  }

  return patch;
}

/** Merge and re-validate a product after a partial update. */
export function mergePetMarketProductUpdate(
  existing: PetMarketProduct,
  patch: Partial<PetMarketProduct>,
): PetMarketProduct {
  return parsePetMarketProductInput({ ...existing, ...patch });
}
