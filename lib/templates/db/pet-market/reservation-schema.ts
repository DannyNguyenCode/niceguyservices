import { ObjectId } from "mongodb";
import type {
  PetMarketInventoryReservation,
  PetMarketInventoryReservationDocument,
  PetMarketInventoryReservationDTO,
  PetMarketReservationStatus,
} from "./types";

export const PET_MARKET_RESERVATIONS_COLLECTION = "pet_market_inventory_reservations" as const;

const RESERVATION_STATUSES = new Set<PetMarketReservationStatus>([
  "active",
  "completed",
  "expired",
  "cancelled",
]);

function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`reservation.${field} must be a non-empty string`);
  }
  return value.trim();
}

function readNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`reservation.${field} must be a number`);
  }
  return value;
}

function readDate(value: unknown, field: string): Date {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  throw new Error(`reservation.${field} must be a date`);
}

function readStatus(value: unknown): PetMarketReservationStatus {
  if (typeof value !== "string" || !RESERVATION_STATUSES.has(value as PetMarketReservationStatus)) {
    throw new Error("reservation.status must be active, completed, expired, or cancelled");
  }
  return value as PetMarketReservationStatus;
}

export function parsePetMarketReservationDocument(
  value: unknown,
): PetMarketInventoryReservationDocument {
  if (!value || typeof value !== "object") {
    throw new Error("reservation document must be an object");
  }

  const doc = value as Record<string, unknown>;
  if (!(doc._id instanceof ObjectId)) {
    throw new Error("reservation._id must be an ObjectId");
  }

  return {
    _id: doc._id,
    session_id: readString(doc.session_id, "session_id"),
    checkout_session_id: readString(doc.checkout_session_id, "checkout_session_id"),
    product_id: readString(doc.product_id, "product_id"),
    quantity: readNumber(doc.quantity, "quantity"),
    status: readStatus(doc.status),
    expires_at: readDate(doc.expires_at, "expires_at"),
    created_at: readDate(doc.created_at, "created_at"),
    updated_at: readDate(doc.updated_at, "updated_at"),
  };
}

export function toPetMarketReservationDTO(
  doc: PetMarketInventoryReservationDocument,
): PetMarketInventoryReservationDTO {
  return {
    _id: doc._id.toHexString(),
    session_id: doc.session_id,
    checkout_session_id: doc.checkout_session_id,
    product_id: doc.product_id,
    quantity: doc.quantity,
    status: doc.status,
    expires_at: doc.expires_at.toISOString(),
    created_at: doc.created_at.toISOString(),
    updated_at: doc.updated_at.toISOString(),
  };
}

export function activeReservationFilter(now = new Date()) {
  return {
    status: "active" as const,
    expires_at: { $gt: now },
  };
}

export type PetMarketReservationInsert = PetMarketInventoryReservation;
