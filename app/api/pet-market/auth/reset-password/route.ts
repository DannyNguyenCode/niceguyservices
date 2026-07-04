import {
  resetPetMarketPassword,
  type PetMarketResetPasswordInput,
} from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, readJsonBody } from "../../_lib/http";

/** POST /api/pet-market/auth/reset-password */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody<PetMarketResetPasswordInput>(request);
    return resetPetMarketPassword(body);
  });
}
