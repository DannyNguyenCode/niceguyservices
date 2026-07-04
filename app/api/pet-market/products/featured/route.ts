import { findPetMarketFeaturedProducts } from "@/lib/templates/db/pet-market";
import { handlePetMarketRoute } from "../../_lib/http";

/** GET /api/pet-market/products/featured — homepage Saturday Morning Specials */
export async function GET() {
  return handlePetMarketRoute(async () => {
    const items = await findPetMarketFeaturedProducts();
    return { items };
  });
}
