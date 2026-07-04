import { completePetMarketCheckoutReservation } from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute } from "../../../_lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** POST /api/pet-market/reservations/:id/complete — convert hold to order */
export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handlePetMarketMutationRoute(() => completePetMarketCheckoutReservation(id));
}
