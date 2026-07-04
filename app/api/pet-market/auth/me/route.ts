import { getPetMarketSession } from "@/lib/templates/db/pet-market";
import { PetMarketInventoryError } from "@/lib/templates/db/pet-market/errors";
import { handlePetMarketRoute } from "../../_lib/http";

function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

/** GET /api/pet-market/auth/me */
export async function GET(request: Request) {
  return handlePetMarketRoute(async () => {
    const token = readBearerToken(request);
    const session = await getPetMarketSession(token);
    if (!session) {
      throw new PetMarketInventoryError("Session expired or invalid", "INVALID_SESSION", 401);
    }
    return { session };
  });
}
