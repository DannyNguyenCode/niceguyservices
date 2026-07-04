import {
  createPetMarketCheckoutReservation,
  type PetMarketCreateReservationInput,
} from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, readJsonBody } from "../_lib/http";

/** POST /api/pet-market/reservations — hold cart items for checkout (15 min) */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody<PetMarketCreateReservationInput>(request);
    return createPetMarketCheckoutReservation(body);
  });
}
