import { NextResponse } from "next/server";
import { databaseUnavailablePayload, isDatabaseConnectionError } from "@/lib/templates/db/errors";
import { isMongoDbConfigured } from "@/lib/templates/db";
import { PmrAdoptionError } from "@/lib/templates/db/pawsmatch-rescue";
import { PetMarketInventoryError } from "@/lib/templates/db/pet-market/errors";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(code ? { error: message, code } : { error: message }, { status });
}

export function ensureMongoConfigured() {
  if (!isMongoDbConfigured()) {
    return jsonError(
      "MongoDB is not configured. Set MONGODB_URI in .env.local.",
      503,
      databaseUnavailablePayload().code,
    );
  }
  return null;
}

export function mapPmrRouteError(error: unknown) {
  if (isDatabaseConnectionError(error)) {
    const payload = databaseUnavailablePayload();
    return jsonError(payload.error, 503, payload.code);
  }

  if (error instanceof PmrAdoptionError) {
    return jsonError(error.message, error.status, error.code);
  }

  if (error instanceof PetMarketInventoryError) {
    return jsonError(error.message, error.status, error.code);
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  const fallbackStatus = message.includes("must be") || message.includes("valid JSON") ? 400 : 500;
  return jsonError(message, fallbackStatus);
}

export async function handlePmrRoute<T>(handler: () => Promise<T>) {
  const configError = ensureMongoConfigured();
  if (configError) return configError;

  try {
    return jsonOk(await handler());
  } catch (error) {
    return mapPmrRouteError(error);
  }
}

export async function readJsonBody<T = unknown>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Request body must be valid JSON");
  }
}

export function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}
