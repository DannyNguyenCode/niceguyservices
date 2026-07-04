import { fulfillPetMarketOrder, type PetMarketFulfillOrderInput } from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, readJsonBody } from "../_lib/http";

/** POST /api/pet-market/orders — fulfill checkout and decrement inventory */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody<PetMarketFulfillOrderInput>(request);
    return fulfillPetMarketOrder(body);
  });
}
