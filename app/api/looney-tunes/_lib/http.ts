import { NextResponse } from "next/server";
import { databaseUnavailablePayload, isDatabaseConnectionError } from "@/lib/templates/db/errors";
import { isMongoDbConfigured } from "@/lib/templates/db";
import { LooneyTunesProductError } from "@/lib/templates/db/looney-tunes/errors";

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

export function mapLooneyTunesErrorToResponse(error: unknown) {
  if (isDatabaseConnectionError(error)) {
    const payload = databaseUnavailablePayload();
    return jsonError(payload.error, 503, payload.code);
  }

  if (error instanceof LooneyTunesProductError) {
    return jsonError(error.message, error.status, error.code);
  }

  const status = (error as { status?: number }).status;
  if (typeof status === "number" && status >= 400 && status < 500) {
    const code = (error as { code?: string }).code;
    return jsonError(error instanceof Error ? error.message : "Request failed", status, code);
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  return jsonError(message, 500);
}

export async function handleLooneyTunesRoute<T>(handler: () => Promise<T>) {
  const configError = ensureMongoConfigured();
  if (configError) return configError;

  try {
    return jsonOk(await handler());
  } catch (error) {
    return mapLooneyTunesErrorToResponse(error);
  }
}

export async function readJsonBody<T = unknown>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Request body must be valid JSON");
  }
}

export async function handleLooneyTunesMutationRoute<T>(handler: () => Promise<T>) {
  const configError = ensureMongoConfigured();
  if (configError) return configError;

  try {
    return jsonOk(await handler());
  } catch (error) {
    return mapLooneyTunesErrorToResponse(error);
  }
}
