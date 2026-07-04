import type {
  PetMarketAvailabilitySnapshot,
  PetMarketCompleteReservationResult,
  PetMarketCreateReservationInput,
  PetMarketCreateReservationResult,
  PetMarketFulfillOrderInput,
  PetMarketFulfillOrderResult,
  PetMarketProductDTO,
  PetMarketProductInput,
  PetMarketProductSearchQuery,
  PetMarketProductSearchResult,
  PetMarketProductUpdateInput,
  PetMarketValidateReservationResult,
} from "@/lib/templates/db/pet-market";
import { DATABASE_UNAVAILABLE_CODE } from "@/lib/templates/db/errors";
import { SPM_PATHS } from "@/components/templates/demos/saturday-pet-market/saturdayPetMarketConfig";

export {
  classifyPetMarketApiError,
  consumePetMarketApiError,
  getPetMarketErrorMessage,
  isPetMarketNetworkError,
  isPetMarketNotFoundError,
  PET_MARKET_API_ERROR_CODES,
  type PetMarketApiErrorOutcome,
} from "./pet-market-client-errors";

export const PET_MARKET_API = {
  health: "/api/pet-market/health",
  products: "/api/pet-market/products",
  featuredProducts: "/api/pet-market/products/featured",
  product: (id: string) => `/api/pet-market/products/${encodeURIComponent(id)}`,
  orders: "/api/pet-market/orders",
  reservations: "/api/pet-market/reservations",
  reservation: (id: string) => `/api/pet-market/reservations/${encodeURIComponent(id)}`,
  reservationComplete: (id: string) =>
    `/api/pet-market/reservations/${encodeURIComponent(id)}/complete`,
  reservationRelease: (id: string) =>
    `/api/pet-market/reservations/${encodeURIComponent(id)}/release`,
  reservationCleanup: "/api/pet-market/reservations/cleanup",
  availability: "/api/pet-market/availability",
  categories: "/api/pet-market/categories",
  petTypes: "/api/pet-market/pet-types",
  authRegister: "/api/pet-market/auth/register",
  authLogin: "/api/pet-market/auth/login",
  authVerify: "/api/pet-market/auth/verify",
  authForgotPassword: "/api/pet-market/auth/forgot-password",
  authResetPassword: "/api/pet-market/auth/reset-password",
  authMe: "/api/pet-market/auth/me",
  authLogout: "/api/pet-market/auth/logout",
  specialistChat: "/api/pet-market/specialist-chat",
} as const;

export { PET_MARKET_MIN_PASSWORD_LENGTH } from "@/lib/templates/db/pet-market/auth/constants";

export type PetMarketApiError = {
  error: string;
  code?: string;
};

export class PetMarketDatabaseUnavailableError extends Error {
  readonly code = DATABASE_UNAVAILABLE_CODE;

  constructor(message: string) {
    super(message);
    this.name = "PetMarketDatabaseUnavailableError";
  }
}

export class PetMarketProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product not found: ${id}`);
    this.name = "PetMarketProductNotFoundError";
  }
}

export class PetMarketApiRequestError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "PetMarketApiRequestError";
    this.status = status;
    this.code = code;
  }
}

export class PetMarketNetworkError extends Error {
  constructor(message = "Could not reach the store. Check your connection and try again.") {
    super(message);
    this.name = "PetMarketNetworkError";
  }
}

export function isPetMarketApiRequestError(error: unknown): error is PetMarketApiRequestError {
  return error instanceof PetMarketApiRequestError;
}

export function isPetMarketInsufficientStockError(error: unknown): boolean {
  return isPetMarketApiRequestError(error) && error.code === "INSUFFICIENT_STOCK";
}

export function isPetMarketReservationExpiredError(error: unknown): boolean {
  return isPetMarketApiRequestError(error) && error.code === "RESERVATION_EXPIRED";
}

export function isPetMarketDatabaseUnavailableError(
  error: unknown,
): error is PetMarketDatabaseUnavailableError {
  return error instanceof PetMarketDatabaseUnavailableError;
}

export function isPetMarketProductNotFoundError(
  error: unknown,
): error is PetMarketProductNotFoundError {
  return error instanceof PetMarketProductNotFoundError;
}

export function redirectToPetMarketDatabaseError(databaseErrorPath?: string) {
  if (typeof window !== "undefined") {
    window.location.assign(databaseErrorPath ?? SPM_PATHS.databaseError);
  }
}

export type PetMarketHealthResponse = {
  ok: boolean;
  configured: boolean;
  database: string;
  collection?: string;
  code?: string;
  error?: string;
};

export type PetMarketCategoriesResponse = {
  categories: string[];
};

export type PetMarketPetTypesResponse = {
  petTypes: string[];
};

export async function petMarketFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { cache: "no-store", ...init });
  } catch {
    throw new PetMarketNetworkError();
  }
}

export async function readJson<T>(response: Response): Promise<T> {
  let data: unknown;

  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    if (!response.ok) {
      throw new PetMarketApiRequestError(
        response.statusText || "Request failed",
        response.status,
      );
    }
    throw new PetMarketApiRequestError(
      "Invalid response from server",
      502,
      "INVALID_RESPONSE",
    );
  }

  if (!response.ok) {
    const payload =
      typeof data === "object" && data !== null ? (data as PetMarketApiError) : undefined;
    const message = payload?.error ?? response.statusText ?? "Request failed";
    if (response.status === 503 && payload?.code === DATABASE_UNAVAILABLE_CODE) {
      throw new PetMarketDatabaseUnavailableError(message);
    }
    throw new PetMarketApiRequestError(message, response.status, payload?.code);
  }

  return data as T;
}

async function mutateJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await petMarketFetch(url, init);
  return readJson<T>(response);
}

function appendCsvParam(params: URLSearchParams, key: string, value: string | string[] | undefined) {
  if (!value) return;
  const values = Array.isArray(value) ? value : [value];
  values.forEach((item) => {
    if (item.trim()) params.append(key, item.trim());
  });
}

function toSearchParams(query: PetMarketProductSearchQuery = {}): string {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.sort) params.set("sort", query.sort);

  appendCsvParam(params, "category", query.filter?.category);
  appendCsvParam(params, "pet_type", query.filter?.pet_type);
  appendCsvParam(params, "brand", query.filter?.brand);
  if (typeof query.filter?.veterinarian_approved === "boolean") {
    params.set("veterinarian_approved", String(query.filter.veterinarian_approved));
  }
  if (typeof query.filter?.price_min === "number") {
    params.set("price_min", String(query.filter.price_min));
  }
  if (typeof query.filter?.price_max === "number") {
    params.set("price_max", String(query.filter.price_max));
  }
  if (typeof query.filter?.in_stock === "boolean") {
    params.set("in_stock", String(query.filter.in_stock));
  }

  return params.toString();
}

export async function fetchPetMarketHealth(): Promise<PetMarketHealthResponse> {
  const response = await petMarketFetch(PET_MARKET_API.health);
  return readJson<PetMarketHealthResponse>(response);
}

export async function fetchPetMarketProducts(
  query: PetMarketProductSearchQuery = {},
): Promise<PetMarketProductSearchResult> {
  const qs = toSearchParams(query);
  const url = qs ? `${PET_MARKET_API.products}?${qs}` : PET_MARKET_API.products;
  const response = await petMarketFetch(url);
  return readJson<PetMarketProductSearchResult>(response);
}

export async function fetchPetMarketFeaturedProducts(): Promise<PetMarketProductDTO[]> {
  const data = await readJson<{ items: PetMarketProductDTO[] }>(
    await petMarketFetch(PET_MARKET_API.featuredProducts),
  );
  return data.items;
}

export async function fetchPetMarketProductById(id: string): Promise<PetMarketProductDTO> {
  const response = await petMarketFetch(PET_MARKET_API.product(id));
  try {
    return await readJson<PetMarketProductDTO>(response);
  } catch (error) {
    if (isPetMarketApiRequestError(error) && error.status === 404) {
      throw new PetMarketProductNotFoundError(id);
    }
    throw error;
  }
}

export async function fetchPetMarketCategories(): Promise<PetMarketCategoriesResponse> {
  const response = await petMarketFetch(PET_MARKET_API.categories);
  return readJson<PetMarketCategoriesResponse>(response);
}

export async function fetchPetMarketPetTypes(): Promise<PetMarketPetTypesResponse> {
  const response = await petMarketFetch(PET_MARKET_API.petTypes);
  return readJson<PetMarketPetTypesResponse>(response);
}

export async function createPetMarketProduct(
  input: PetMarketProductInput,
): Promise<PetMarketProductDTO> {
  const data = await mutateJson<{ product: PetMarketProductDTO }>(PET_MARKET_API.products, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return data.product;
}

export async function updatePetMarketProduct(
  id: string,
  patch: PetMarketProductUpdateInput,
): Promise<PetMarketProductDTO> {
  const data = await mutateJson<{ product: PetMarketProductDTO }>(PET_MARKET_API.product(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return data.product;
}

export async function deletePetMarketProduct(id: string): Promise<void> {
  await mutateJson<{ deleted: boolean; id: string }>(PET_MARKET_API.product(id), {
    method: "DELETE",
  });
}

export async function fulfillPetMarketOrder(
  input: PetMarketFulfillOrderInput,
): Promise<PetMarketFulfillOrderResult> {
  return mutateJson<PetMarketFulfillOrderResult>(PET_MARKET_API.orders, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function createPetMarketCheckoutReservation(
  input: PetMarketCreateReservationInput,
): Promise<PetMarketCreateReservationResult> {
  return mutateJson<PetMarketCreateReservationResult>(PET_MARKET_API.reservations, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function validatePetMarketCheckoutReservation(
  checkoutSessionId: string,
): Promise<PetMarketValidateReservationResult> {
  const response = await petMarketFetch(PET_MARKET_API.reservation(checkoutSessionId));
  return readJson<PetMarketValidateReservationResult>(response);
}

export async function releasePetMarketCheckoutReservation(
  checkoutSessionId: string,
): Promise<{ released: number }> {
  return mutateJson<{ released: number }>(PET_MARKET_API.reservationRelease(checkoutSessionId), {
    method: "POST",
  });
}

/** Payment success handler — attach reservationId in Stripe metadata for webhooks. */
export async function completePetMarketCheckoutReservation(
  checkoutSessionId: string,
): Promise<PetMarketCompleteReservationResult> {
  return mutateJson<PetMarketCompleteReservationResult>(
    PET_MARKET_API.reservationComplete(checkoutSessionId),
    { method: "POST" },
  );
}

export async function fetchPetMarketAvailabilityBatch(
  productIds: string[],
  checkoutSessionId?: string,
): Promise<PetMarketAvailabilitySnapshot[]> {
  const data = await mutateJson<{ items: PetMarketAvailabilitySnapshot[] }>(
    PET_MARKET_API.availability,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_ids: productIds,
        checkout_session_id: checkoutSessionId,
      }),
    },
  );
  return data.items;
}

export async function cleanupExpiredPetMarketReservations(): Promise<{ expired: number }> {
  return mutateJson<{ expired: number }>(PET_MARKET_API.reservationCleanup, { method: "POST" });
}
