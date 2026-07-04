import {
  isPetMarketApiRequestError,
  isPetMarketDatabaseUnavailableError,
  isPetMarketInsufficientStockError,
  isPetMarketProductNotFoundError,
  isPetMarketReservationExpiredError,
  PetMarketNetworkError,
  redirectToPetMarketDatabaseError,
} from "./pet-market";

/** Known API error codes returned by pet-market routes. */
export const PET_MARKET_API_ERROR_CODES = {
  DATABASE_UNAVAILABLE: "DATABASE_UNAVAILABLE",
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  RESERVATION_EXPIRED: "RESERVATION_EXPIRED",
  NOT_FOUND: "NOT_FOUND",
  INVALID_SESSION: "INVALID_SESSION",
  INVALID_ITEM: "INVALID_ITEM",
  INVALID_QUANTITY: "INVALID_QUANTITY",
  EMPTY_ORDER: "EMPTY_ORDER",
  INVALID_RESPONSE: "INVALID_RESPONSE",
} as const;

const FRIENDLY_MESSAGES: Record<string, string> = {
  [PET_MARKET_API_ERROR_CODES.INSUFFICIENT_STOCK]:
    "One or more items are no longer available in the quantity selected.",
  [PET_MARKET_API_ERROR_CODES.RESERVATION_EXPIRED]:
    "Your reserved items have expired. Please return to your cart to check availability.",
  [PET_MARKET_API_ERROR_CODES.NOT_FOUND]: "We couldn't find that in our store.",
  [PET_MARKET_API_ERROR_CODES.INVALID_SESSION]:
    "Your checkout session expired. Please return to your cart and try again.",
  [PET_MARKET_API_ERROR_CODES.EMPTY_ORDER]: "Your cart is empty.",
  [PET_MARKET_API_ERROR_CODES.INVALID_ITEM]: "Something in your cart needs a quick fix.",
  [PET_MARKET_API_ERROR_CODES.INVALID_QUANTITY]: "Please choose a valid quantity for each item.",
  [PET_MARKET_API_ERROR_CODES.INVALID_RESPONSE]:
    "The store had trouble responding. Please try again in a moment.",
};

export type PetMarketApiErrorOutcome =
  | { type: "redirect-database" }
  | { type: "product-not-found"; message: string }
  | { type: "reservation-expired"; message: string }
  | { type: "insufficient-stock"; message: string }
  | { type: "message"; message: string; code?: string; status?: number };

/** Map a thrown client error to a structured outcome for UI handling. */
export function classifyPetMarketApiError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): PetMarketApiErrorOutcome {
  if (isPetMarketDatabaseUnavailableError(error)) {
    return { type: "redirect-database" };
  }

  if (isPetMarketProductNotFoundError(error)) {
    return { type: "product-not-found", message: error.message };
  }

  if (isPetMarketReservationExpiredError(error)) {
    return {
      type: "reservation-expired",
      message: getPetMarketErrorMessage(error, fallback),
    };
  }

  if (isPetMarketInsufficientStockError(error)) {
    return {
      type: "insufficient-stock",
      message: getPetMarketErrorMessage(error, fallback),
    };
  }

  return {
    type: "message",
    message: getPetMarketErrorMessage(error, fallback),
    code: isPetMarketApiRequestError(error) ? error.code : undefined,
    status: isPetMarketApiRequestError(error) ? error.status : undefined,
  };
}

/** User-facing copy for any pet-market API error. */
export function getPetMarketErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error instanceof PetMarketNetworkError) {
    return error.message;
  }

  if (isPetMarketApiRequestError(error)) {
    if (error.code && FRIENDLY_MESSAGES[error.code]) {
      return FRIENDLY_MESSAGES[error.code];
    }
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/**
 * Handles database redirects automatically.
 * Returns null when redirected; otherwise returns a message to display.
 */
export function consumePetMarketApiError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
  databaseErrorPath?: string,
): string | null {
  const outcome = classifyPetMarketApiError(error, fallback);
  if (outcome.type === "redirect-database") {
    redirectToPetMarketDatabaseError(databaseErrorPath);
    return null;
  }

  if (outcome.type === "product-not-found") return outcome.message;
  if (outcome.type === "reservation-expired") return outcome.message;
  if (outcome.type === "insufficient-stock") return outcome.message;
  return outcome.message;
}

export function isPetMarketNetworkError(error: unknown): error is PetMarketNetworkError {
  return error instanceof PetMarketNetworkError;
}

export function isPetMarketNotFoundError(error: unknown): boolean {
  return (
    isPetMarketProductNotFoundError(error) ||
    (isPetMarketApiRequestError(error) && error.code === PET_MARKET_API_ERROR_CODES.NOT_FOUND)
  );
}
