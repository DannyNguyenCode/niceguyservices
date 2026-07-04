import {
  registerPetMarketUser,
  type PetMarketRegisterInput,
} from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, readJsonBody } from "../../_lib/http";

/** POST /api/pet-market/auth/register */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody<PetMarketRegisterInput>(request);
    const session = await registerPetMarketUser(body);
    return { session, message: "Welcome to the Saturday Morning Rewards Club!" };
  });
}
