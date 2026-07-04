export const DATABASE_UNAVAILABLE_CODE = "DATABASE_UNAVAILABLE" as const;

export type DatabaseUnavailablePayload = {
  error: string;
  code: typeof DATABASE_UNAVAILABLE_CODE;
};

export function isDatabaseConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const name = "name" in error && typeof error.name === "string" ? error.name : "";
  if (
    name === "MongoServerSelectionError" ||
    name === "MongoNetworkError" ||
    name === "MongoTimeoutError" ||
    name === "MongoParseError"
  ) {
    return true;
  }

  const message = "message" in error && typeof error.message === "string" ? error.message.toLowerCase() : "";
  return (
    message.includes("connect") ||
    message.includes("connection") ||
    message.includes("econnrefused") ||
    message.includes("timed out") ||
    message.includes("server selection")
  );
}

export function databaseUnavailablePayload(
  message = "Cannot connect to database.",
): DatabaseUnavailablePayload {
  return { error: message, code: DATABASE_UNAVAILABLE_CODE };
}
