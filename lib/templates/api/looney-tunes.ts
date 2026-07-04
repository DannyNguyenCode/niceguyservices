import type {
  LooneyTunesProductDTO,
  LooneyTunesProductSearchQuery,
  LooneyTunesProductSearchResult,
} from "@/lib/templates/db/looney-tunes";
import { DATABASE_UNAVAILABLE_CODE } from "@/lib/templates/db/errors";

export const LOONEY_TUNES_API = {
  health: "/api/looney-tunes/health",
  products: "/api/looney-tunes/products",
  product: (id: string) => `/api/looney-tunes/products/${encodeURIComponent(id)}`,
  categories: "/api/looney-tunes/categories",
  authRegister: "/api/looney-tunes/auth/register",
  authLogin: "/api/looney-tunes/auth/login",
  authMe: "/api/looney-tunes/auth/me",
  authLogout: "/api/looney-tunes/auth/logout",
  authForgotPassword: "/api/looney-tunes/auth/forgot-password",
  authResetPassword: "/api/looney-tunes/auth/reset-password",
} as const;

export { LOONEY_TUNES_MIN_PASSWORD_LENGTH } from "@/lib/templates/db/looney-tunes/auth/constants";

export type LooneyTunesApiError = {
  error: string;
  code?: string;
};

export class LooneyTunesDatabaseUnavailableError extends Error {
  readonly code = DATABASE_UNAVAILABLE_CODE;

  constructor(message: string) {
    super(message);
    this.name = "LooneyTunesDatabaseUnavailableError";
  }
}

export class LooneyTunesProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Product not found: ${id}`);
    this.name = "LooneyTunesProductNotFoundError";
  }
}

export class LooneyTunesApiRequestError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "LooneyTunesApiRequestError";
    this.status = status;
    this.code = code;
  }
}

export class LooneyTunesNetworkError extends Error {
  constructor(message = "Could not reach the store. Check your connection and try again.") {
    super(message);
    this.name = "LooneyTunesNetworkError";
  }
}

export type LooneyTunesHealthResponse = {
  ok: boolean;
  configured: boolean;
  database: string;
  collection?: string;
  code?: string;
  error?: string;
};

export async function looneyTunesFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, { cache: "no-store", ...init });
  } catch {
    throw new LooneyTunesNetworkError();
  }
}

export async function readLooneyTunesJson<T>(response: Response): Promise<T> {
  let data: unknown;

  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    if (!response.ok) {
      throw new LooneyTunesApiRequestError(
        response.statusText || "Request failed",
        response.status,
      );
    }
    throw new LooneyTunesApiRequestError(
      "Invalid response from server",
      502,
      "INVALID_RESPONSE",
    );
  }

  if (!response.ok) {
    const payload =
      typeof data === "object" && data !== null ? (data as LooneyTunesApiError) : undefined;
    const message = payload?.error ?? response.statusText ?? "Request failed";
    if (response.status === 503 && payload?.code === DATABASE_UNAVAILABLE_CODE) {
      throw new LooneyTunesDatabaseUnavailableError(message);
    }
    if (response.status === 404) {
      throw new LooneyTunesProductNotFoundError(message);
    }
    throw new LooneyTunesApiRequestError(message, response.status, payload?.code);
  }

  return data as T;
}

function appendCsvParam(params: URLSearchParams, key: string, value: string | string[] | undefined) {
  if (!value) return;
  const values = Array.isArray(value) ? value : [value];
  values.forEach((item) => {
    if (item.trim()) params.append(key, item.trim());
  });
}

function toSearchParams(query: LooneyTunesProductSearchQuery = {}): string {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.page) params.set("page", String(query.page));
  if (query.pageSize) params.set("pageSize", String(query.pageSize));
  if (query.sort) params.set("sort", query.sort);

  appendCsvParam(params, "category", query.filter?.category);
  appendCsvParam(params, "size", query.filter?.size);
  if (typeof query.filter?.best_seller === "boolean") {
    params.set("best_seller", String(query.filter.best_seller));
  }
  if (typeof query.filter?.price_min === "number") {
    params.set("price_min", String(query.filter.price_min));
  }
  if (typeof query.filter?.price_max === "number") {
    params.set("price_max", String(query.filter.price_max));
  }

  return params.toString();
}

export async function fetchLooneyTunesProducts(
  query: LooneyTunesProductSearchQuery = {},
): Promise<LooneyTunesProductSearchResult> {
  const qs = toSearchParams(query);
  const url = qs ? `${LOONEY_TUNES_API.products}?${qs}` : LOONEY_TUNES_API.products;
  const response = await looneyTunesFetch(url);
  return readLooneyTunesJson<LooneyTunesProductSearchResult>(response);
}

export async function fetchLooneyTunesProduct(id: string): Promise<LooneyTunesProductDTO> {
  const response = await looneyTunesFetch(LOONEY_TUNES_API.product(id));
  return readLooneyTunesJson<LooneyTunesProductDTO>(response);
}

export async function fetchLooneyTunesHealth(): Promise<LooneyTunesHealthResponse> {
  const response = await looneyTunesFetch(LOONEY_TUNES_API.health);
  return readLooneyTunesJson<LooneyTunesHealthResponse>(response);
}

export function getLooneyTunesErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function consumeLooneyTunesApiError(error: unknown, fallback: string): string | null {
  if (error instanceof LooneyTunesApiRequestError) return error.message;
  if (error instanceof LooneyTunesDatabaseUnavailableError) return error.message;
  if (error instanceof LooneyTunesNetworkError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
