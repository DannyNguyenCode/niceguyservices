import { startPetMarketPasswordReset } from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, readJsonBody } from "../../_lib/http";

type ForgotBody = { email: string };

/** POST /api/pet-market/auth/forgot-password */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody<ForgotBody>(request);
    return startPetMarketPasswordReset(body.email);
  });
}
