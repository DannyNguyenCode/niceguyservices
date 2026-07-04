import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function readJsonBody<T = unknown>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("Request body must be valid JSON");
  }
}

export async function handleViInquiryRoute<T>(handler: () => Promise<T>) {
  try {
    return jsonOk(await handler());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected server error";
    const status =
      message.includes("required") ||
      message.includes("valid") ||
      message.includes("invalid") ||
      message.includes("must be valid JSON")
        ? 400
        : 500;
    return jsonError(message, status);
  }
}
