import { listPetMarketPetTypes } from "@/lib/templates/db/pet-market";
import { handlePetMarketRoute } from "../_lib/http";

/** GET /api/pet-market/pet-types */
export async function GET() {
  return handlePetMarketRoute(async () => {
    const petTypes = await listPetMarketPetTypes();
    return { petTypes };
  });
}
