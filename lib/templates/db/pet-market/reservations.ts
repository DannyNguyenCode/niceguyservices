import "server-only";

import { ObjectId, type ClientSession, type OptionalId } from "mongodb";
import { randomUUID } from "crypto";
import { getMongoClient } from "../mongodb";
import { getTemplateCollection } from "../collections";
import { PetMarketInventoryError } from "./errors";
import { parsePetMarketProductDocument, PET_MARKET_COLLECTION, toPetMarketProductDTO } from "./schema";
import {
  PET_MARKET_RESERVATIONS_COLLECTION,
  activeReservationFilter,
  parsePetMarketReservationDocument,
  toPetMarketReservationDTO,
} from "./reservation-schema";
import { PET_MARKET_RESERVATION_TTL_MS } from "./constants";
import type {
  PetMarketAvailabilitySnapshot,
  PetMarketCompleteReservationResult,
  PetMarketCreateReservationInput,
  PetMarketCreateReservationResult,
  PetMarketInventoryReservationDocument,
  PetMarketOrderLineItem,
  PetMarketProductDTO,
  PetMarketReservationStatus,
  PetMarketValidateReservationResult,
} from "./types";

async function getPetMarketProductsCollection() {
  return getTemplateCollection(PET_MARKET_COLLECTION);
}

export async function getPetMarketReservationsCollection() {
  return getTemplateCollection<PetMarketInventoryReservationDocument>(
    PET_MARKET_RESERVATIONS_COLLECTION,
  );
}

function generateConfirmationNumber(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `SM-1989-${suffix}`;
}

function normalizeOrderLines(items: PetMarketOrderLineItem[]): Map<string, number> {
  const normalized = new Map<string, number>();
  for (const line of items) {
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
  if (normalized.size === 0) {
    throw new PetMarketInventoryError("Reservation must include at least one item", "EMPTY_ORDER");
  }
  return normalized;
}

/**
 * Race-condition note: always call inside a transaction when reserving stock.
 * Counts only reservations with status=active AND expires_at > now so stale rows
 * never reduce availability even before the cleanup job runs.
 */
export async function sumActiveReservedQuantity(
  productId: string,
  options: { excludeCheckoutSessionId?: string; session?: ClientSession; now?: Date } = {},
): Promise<number> {
  const now = options.now ?? new Date();
  const collection = await getPetMarketReservationsCollection();
  const match: Record<string, unknown> = {
    product_id: productId,
    ...activeReservationFilter(now),
  };
  if (options.excludeCheckoutSessionId) {
    match.checkout_session_id = { $ne: options.excludeCheckoutSessionId };
  }

  const pipeline = [{ $match: match }, { $group: { _id: null, total: { $sum: "$quantity" } } }];
  const cursor = collection.aggregate<{ total: number }>(pipeline, {
    session: options.session,
  });
  const [result] = await cursor.toArray();
  return result?.total ?? 0;
}

export async function getPetMarketProductAvailability(
  productId: string,
  options: { excludeCheckoutSessionId?: string; session?: ClientSession; now?: Date } = {},
): Promise<PetMarketAvailabilitySnapshot | null> {
  if (!ObjectId.isValid(productId)) return null;

  const products = await getPetMarketProductsCollection();
  const doc = await products.findOne({ _id: new ObjectId(productId) }, { session: options.session });
  if (!doc) return null;

  const product = parsePetMarketProductDocument(doc);
  const reserved = await sumActiveReservedQuantity(productId, options);
  const available = Math.max(0, product.quantity - reserved);

  return {
    product_id: productId,
    stock_quantity: product.quantity,
    reserved_quantity: reserved,
    available_quantity: available,
  };
}

export async function enrichPetMarketProductWithAvailability(
  product: PetMarketProductDTO,
  options: { excludeCheckoutSessionId?: string; now?: Date } = {},
): Promise<PetMarketProductDTO> {
  const snapshot = await getPetMarketProductAvailability(product._id, options);
  if (!snapshot) return product;
  return {
    ...product,
    available_quantity: snapshot.available_quantity,
    reserved_quantity: snapshot.reserved_quantity,
  };
}

/** Marks active reservations past expires_at as expired (safe to call frequently). */
export async function expireStalePetMarketReservations(
  session?: ClientSession,
): Promise<number> {
  const now = new Date();
  const collection = await getPetMarketReservationsCollection();
  const result = await collection.updateMany(
    { status: "active", expires_at: { $lte: now } },
    { $set: { status: "expired" as PetMarketReservationStatus, updated_at: now } },
    { session },
  );
  return result.modifiedCount;
}

async function releaseCheckoutReservations(
  checkoutSessionId: string,
  status: Extract<PetMarketReservationStatus, "cancelled" | "expired">,
  session?: ClientSession,
): Promise<number> {
  const now = new Date();
  const collection = await getPetMarketReservationsCollection();
  const result = await collection.updateMany(
    { checkout_session_id: checkoutSessionId, status: "active" },
    { $set: { status, updated_at: now } },
    { session },
  );
  return result.modifiedCount;
}

export async function releaseActiveReservationsForSession(
  sessionId: string,
  session?: ClientSession,
): Promise<number> {
  const now = new Date();
  const collection = await getPetMarketReservationsCollection();
  const result = await collection.updateMany(
    { session_id: sessionId, status: "active" },
    { $set: { status: "cancelled" as PetMarketReservationStatus, updated_at: now } },
    { session },
  );
  return result.modifiedCount;
}

async function loadCheckoutReservations(checkoutSessionId: string, session?: ClientSession) {
  const collection = await getPetMarketReservationsCollection();
  const docs = await collection.find({ checkout_session_id: checkoutSessionId }, { session }).toArray();
  return docs.map(parsePetMarketReservationDocument);
}

/**
 * Creates checkout reservations inside a MongoDB transaction.
 * Two shoppers cannot reserve the last unit: each product row is checked against
 * physical stock minus all other active holds before inserts commit.
 */
export async function createPetMarketCheckoutReservation(
  input: PetMarketCreateReservationInput,
): Promise<PetMarketCreateReservationResult> {
  const sessionId = input.session_id?.trim();
  if (!sessionId) {
    throw new PetMarketInventoryError("session_id is required", "INVALID_SESSION");
  }

  const lines = normalizeOrderLines(input.items);
  const checkoutSessionId = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + PET_MARKET_RESERVATION_TTL_MS);
  const client = await getMongoClient();
  const mongoSession = client.startSession();

  try {
    let reservationDocs: PetMarketInventoryReservationDocument[] = [];

    await mongoSession.withTransaction(async () => {
      await expireStalePetMarketReservations(mongoSession);
      await releaseActiveReservationsForSession(sessionId, mongoSession);

      const reservations = await getPetMarketReservationsCollection();
      const products = await getPetMarketProductsCollection();
      const toInsert: OptionalId<PetMarketInventoryReservationDocument>[] = [];

      for (const [productId, quantity] of lines) {
        const objectId = new ObjectId(productId);
        const productDoc = await products.findOne({ _id: objectId }, { session: mongoSession });
        if (!productDoc) {
          throw new PetMarketInventoryError(`Product not found: ${productId}`, "NOT_FOUND", 404);
        }

        const product = parsePetMarketProductDocument(productDoc);
        const reserved = await sumActiveReservedQuantity(productId, {
          excludeCheckoutSessionId: checkoutSessionId,
          session: mongoSession,
          now,
        });
        const available = product.quantity - reserved;

        if (available < quantity) {
          throw new PetMarketInventoryError(
            `One or more items are no longer available in the quantity selected. ${product.product_name} has ${available} available.`,
            "INSUFFICIENT_STOCK",
            409,
          );
        }

        toInsert.push({
          session_id: sessionId,
          checkout_session_id: checkoutSessionId,
          product_id: productId,
          quantity,
          status: "active",
          expires_at: expiresAt,
          created_at: now,
          updated_at: now,
        });
      }

      const insertResult = await reservations.insertMany(
        toInsert as unknown as Parameters<typeof reservations.insertMany>[0],
        { session: mongoSession },
      );
      const insertedIds = Object.values(insertResult.insertedIds);
      const insertedDocs = await reservations
        .find({ _id: { $in: insertedIds } }, { session: mongoSession })
        .toArray();
      reservationDocs = insertedDocs.map(parsePetMarketReservationDocument);
    });

    return {
      checkout_session_id: checkoutSessionId,
      expires_at: expiresAt.toISOString(),
      reservations: reservationDocs.map(toPetMarketReservationDTO),
    };
  } finally {
    await mongoSession.endSession();
  }
}

export async function validatePetMarketCheckoutReservation(
  checkoutSessionId: string,
): Promise<PetMarketValidateReservationResult> {
  if (!checkoutSessionId?.trim()) {
    throw new PetMarketInventoryError("checkout_session_id is required", "INVALID_SESSION");
  }

  await expireStalePetMarketReservations();
  const now = new Date();
  const reservations = await loadCheckoutReservations(checkoutSessionId);
  const dtos = reservations.map(toPetMarketReservationDTO);

  if (reservations.length === 0) {
    return {
      valid: false,
      checkout_session_id: checkoutSessionId,
      expires_at: now.toISOString(),
      expired: true,
      reservations: [],
    };
  }

  const allActive = reservations.every((r) => r.status === "active" && r.expires_at > now);
  const expiresAt = reservations.reduce(
    (earliest, r) => (r.expires_at < earliest ? r.expires_at : earliest),
    reservations[0].expires_at,
  );

  return {
    valid: allActive,
    checkout_session_id: checkoutSessionId,
    expires_at: expiresAt.toISOString(),
    expired: !allActive,
    reservations: dtos,
  };
}

export async function releasePetMarketCheckoutReservation(
  checkoutSessionId: string,
): Promise<{ released: number }> {
  if (!checkoutSessionId?.trim()) {
    throw new PetMarketInventoryError("checkout_session_id is required", "INVALID_SESSION");
  }
  const released = await releaseCheckoutReservations(checkoutSessionId, "cancelled");
  return { released };
}

/**
 * Payment success / demo checkout completion.
 * Converts an active hold into a fulfilled order and permanently decrements stock.
 * If the hold expired before payment, we refuse auto-fulfillment (manual review path).
 */
export async function completePetMarketCheckoutReservation(
  checkoutSessionId: string,
): Promise<PetMarketCompleteReservationResult> {
  if (!checkoutSessionId?.trim()) {
    throw new PetMarketInventoryError("checkout_session_id is required", "INVALID_SESSION");
  }

  const client = await getMongoClient();
  const mongoSession = client.startSession();
  const confirmationNumber = generateConfirmationNumber();

  try {
    let updatedProducts: PetMarketProductDTO[] = [];

    await mongoSession.withTransaction(async () => {
      await expireStalePetMarketReservations(mongoSession);
      const now = new Date();
      const reservations = await loadCheckoutReservations(checkoutSessionId, mongoSession);

      if (reservations.length === 0) {
        throw new PetMarketInventoryError("Reservation not found", "NOT_FOUND", 404);
      }

      const invalid = reservations.some((r) => r.status !== "active" || r.expires_at <= now);
      if (invalid) {
        throw new PetMarketInventoryError(
          "Your reserved items have expired. Please return to your cart to check availability.",
          "RESERVATION_EXPIRED",
          409,
        );
      }

      const products = await getPetMarketProductsCollection();
      const reservationCollection = await getPetMarketReservationsCollection();
      const fulfilled: PetMarketProductDTO[] = [];

      for (const reservation of reservations) {
        const objectId = new ObjectId(reservation.product_id);
        const next = await products.findOneAndUpdate(
          { _id: objectId, quantity: { $gte: reservation.quantity } },
          { $inc: { quantity: -reservation.quantity } },
          { returnDocument: "after", session: mongoSession },
        );

        if (!next) {
          throw new PetMarketInventoryError(
            "One or more items are no longer available in the quantity selected.",
            "INSUFFICIENT_STOCK",
            409,
          );
        }

        await reservationCollection.updateOne(
          { _id: reservation._id, status: "active" },
          { $set: { status: "completed" as PetMarketReservationStatus, updated_at: now } },
          { session: mongoSession },
        );

        fulfilled.push(toPetMarketProductDTO(parsePetMarketProductDocument(next)));
      }

      updatedProducts = fulfilled;
    });

    return {
      confirmation_number: confirmationNumber,
      checkout_session_id: checkoutSessionId,
      items: updatedProducts,
    };
  } finally {
    await mongoSession.endSession();
  }
}

export async function getPetMarketAvailabilityBatch(
  productIds: string[],
  options: { excludeCheckoutSessionId?: string } = {},
): Promise<PetMarketAvailabilitySnapshot[]> {
  const unique = [...new Set(productIds.filter((id) => ObjectId.isValid(id)))];
  const snapshots = await Promise.all(
    unique.map((productId) => getPetMarketProductAvailability(productId, options)),
  );
  return snapshots.filter((item): item is PetMarketAvailabilitySnapshot => item !== null);
}
