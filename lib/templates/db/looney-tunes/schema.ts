import { ObjectId } from "mongodb";
import type { LooneyTunesProduct, LooneyTunesProductDocument, LooneyTunesProductDTO } from "./types";

export const LOONEY_TUNES_COLLECTION = "looney_tunes" as const;

export const looneyTunesProductSchema = {
  product_name: { type: "string", required: true },
  description: { type: "string", required: true },
  price: { type: "number", required: true },
  category: { type: "string", required: true },
  size: { type: "string", required: true },
  ingredients: { type: "string", required: true },
  caffeine_content: { type: "number", required: true },
  availability_date: { type: "string", required: true },
  expiration_date: { type: "string", required: true },
  best_seller: { type: "boolean", required: false },
} as const;

function readString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(`looney_tunes.${field} must be a string`);
  }
  return value;
}

function readNumber(value: unknown, field: string): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  throw new Error(`looney_tunes.${field} must be a number`);
}

function readOptionalBoolean(value: unknown, field: string): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  throw new Error(`looney_tunes.${field} must be a boolean`);
}

export function parseLooneyTunesProductDocument(value: unknown): LooneyTunesProductDocument {
  if (!value || typeof value !== "object") {
    throw new Error("looney_tunes document must be an object");
  }

  const doc = value as Record<string, unknown>;
  const id = doc._id;

  if (!(id instanceof ObjectId)) {
    throw new Error("looney_tunes._id must be an ObjectId");
  }

  const product: LooneyTunesProduct = {
    product_name: readString(doc.product_name, "product_name"),
    description: readString(doc.description, "description"),
    price: readNumber(doc.price, "price"),
    category: readString(doc.category, "category"),
    size: readString(doc.size, "size"),
    ingredients: readString(doc.ingredients, "ingredients"),
    caffeine_content: readNumber(doc.caffeine_content, "caffeine_content"),
    availability_date: readString(doc.availability_date, "availability_date"),
    expiration_date: readString(doc.expiration_date, "expiration_date"),
    best_seller: readOptionalBoolean(doc.best_seller, "best_seller"),
  };

  return { _id: id, ...product };
}

export function toLooneyTunesProductDTO(doc: LooneyTunesProductDocument): LooneyTunesProductDTO {
  return {
    _id: doc._id.toHexString(),
    product_name: doc.product_name,
    description: doc.description,
    price: doc.price,
    category: doc.category,
    size: doc.size,
    ingredients: doc.ingredients,
    caffeine_content: doc.caffeine_content,
    availability_date: doc.availability_date,
    expiration_date: doc.expiration_date,
    ...(doc.best_seller !== undefined ? { best_seller: doc.best_seller } : {}),
  };
}

export function parseLooneyTunesProductDocuments(values: unknown[]): LooneyTunesProductDocument[] {
  const parsed: LooneyTunesProductDocument[] = [];

  for (const value of values) {
    try {
      parsed.push(parseLooneyTunesProductDocument(value));
    } catch {
      // Skip malformed documents in list responses.
    }
  }

  return parsed;
}
