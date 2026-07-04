import {
  generateSpecialistReply,
  type SpecialistChatRequest,
} from "@/lib/templates/db/pet-market/specialist-chat";
import { jsonOk, mapPetMarketErrorToResponse, readJsonBody } from "../_lib/http";

/** POST /api/pet-market/specialist-chat — demo specialist replies (rule-based + optional product search) */
export async function POST(request: Request) {
  try {
    const body = await readJsonBody<SpecialistChatRequest>(request);
    const messages = Array.isArray(body.messages) ? body.messages : [];

    if (messages.length > 40) {
      return mapPetMarketErrorToResponse(new Error("Conversation is too long. Please start fresh."));
    }

    const reply = await generateSpecialistReply(
      messages.filter(
        (message): message is SpecialistChatRequest["messages"][number] =>
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0,
      ),
    );

    return jsonOk({ reply });
  } catch (error) {
    return mapPetMarketErrorToResponse(error);
  }
}
