import { startPetMarketLogin, type PetMarketLoginInput } from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, readJsonBody } from "../../_lib/http";

/** POST /api/pet-market/auth/login — validates credentials and starts a session */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody<PetMarketLoginInput>(request);
    const session = await startPetMarketLogin(body);
    return { session };
  });
}
