import { listPetMarketCategories } from "@/lib/templates/db/pet-market";
import { handlePetMarketRoute } from "../_lib/http";

/** GET /api/pet-market/categories */
export async function GET() {
  return handlePetMarketRoute(async () => {
    const categories = await listPetMarketCategories();
    return { categories };
  });
}
