import type { ObjectId } from "mongodb";

/** Raw product shape stored in the `pet_market` collection. */
export interface PetMarketProduct {
  product_name: string;
  brand: string;
  category: string;
  price: number;
  quantity: number;
  description: string;
  size: string;
  color: string;
  material: string;
  weight: number;
  expiration_date: string;
  recommended_age: number;
  breed_size: string;
  pet_type: string;
  veterinarian_approved: boolean;
  /** When true, product may appear in homepage Saturday Morning Specials. */
  featured?: boolean;
}

/** Document as returned from MongoDB (includes ObjectId). */
export interface PetMarketProductDocument extends PetMarketProduct {
  _id: ObjectId;
}

/** JSON-safe shape for Server Components, API routes, and client props. */
export interface PetMarketProductDTO extends PetMarketProduct {
  _id: string;
  /** Physical stock minus active unexpired reservations. */
  available_quantity?: number;
  /** Quantity currently held in active checkout reservations. */
  reserved_quantity?: number;
}

export type PetMarketProductFilter = {
  category?: string | string[];
  pet_type?: string | string[];
  brand?: string | string[];
  veterinarian_approved?: boolean;
  price_min?: number;
  price_max?: number;
  in_stock?: boolean;
};

export type PetMarketProductSearchQuery = {
  q?: string;
  filter?: PetMarketProductFilter;
  page?: number;
  pageSize?: number;
  sort?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
};

export type PetMarketProductSearchResult = {
  items: PetMarketProductDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/** Payload for creating a product (no `_id`). */
export type PetMarketProductInput = PetMarketProduct;

/** Partial update — at least one field required at the API layer. */
export type PetMarketProductUpdateInput = Partial<PetMarketProduct>;

export type PetMarketOrderLineItem = {
  product_id: string;
  quantity: number;
};

export type PetMarketFulfillOrderInput = {
  items: PetMarketOrderLineItem[];
};

export type PetMarketFulfillOrderResult = {
  confirmation_number: string;
  items: PetMarketProductDTO[];
};

export type PetMarketReservationStatus = "active" | "completed" | "expired" | "cancelled";

export interface PetMarketInventoryReservation {
  session_id: string;
  checkout_session_id: string;
  product_id: string;
  quantity: number;
  status: PetMarketReservationStatus;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface PetMarketInventoryReservationDocument extends PetMarketInventoryReservation {
  _id: ObjectId;
}

export interface PetMarketInventoryReservationDTO
  extends Omit<PetMarketInventoryReservation, "expires_at" | "created_at" | "updated_at"> {
  _id: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export type PetMarketCreateReservationInput = {
  session_id: string;
  items: PetMarketOrderLineItem[];
};

export type PetMarketCreateReservationResult = {
  checkout_session_id: string;
  expires_at: string;
  reservations: PetMarketInventoryReservationDTO[];
};

export type PetMarketValidateReservationResult = {
  valid: boolean;
  checkout_session_id: string;
  expires_at: string;
  expired: boolean;
  reservations: PetMarketInventoryReservationDTO[];
};

export type PetMarketCompleteReservationResult = {
  confirmation_number: string;
  checkout_session_id: string;
  items: PetMarketProductDTO[];
};

export type PetMarketAvailabilitySnapshot = {
  product_id: string;
  stock_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
};

/** Fields used for text search across product documents. */
export const PET_MARKET_SEARCH_FIELDS = [
  "product_name",
  "brand",
  "category",
  "description",
  "pet_type",
  "breed_size",
  "material",
  "color",
] as const satisfies readonly (keyof PetMarketProduct)[];
