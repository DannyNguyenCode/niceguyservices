import { releasePetMarketCheckoutReservation } from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute } from "../../../_lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** POST /api/pet-market/reservations/:id/release — cancel checkout hold */
export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handlePetMarketMutationRoute(() => releasePetMarketCheckoutReservation(id));
}
