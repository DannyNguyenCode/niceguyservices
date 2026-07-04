import type {
  SpecialistChatMessage,
  SpecialistChatReply,
} from "@/lib/templates/db/pet-market/specialist-chat";
import { consumePetMarketApiError, PET_MARKET_API, petMarketFetch, readJson } from "./pet-market";

export async function sendSpmSpecialistMessage(
  messages: SpecialistChatMessage[],
): Promise<SpecialistChatReply> {
  const response = await petMarketFetch(PET_MARKET_API.specialistChat, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await readJson<{ reply: SpecialistChatReply }>(response);
  return data.reply;
}

export function getSpmSpecialistChatErrorMessage(error: unknown, fallback: string): string | null {
  return consumePetMarketApiError(error, fallback);
}

export type { SpecialistChatMessage, SpecialistChatReply };
