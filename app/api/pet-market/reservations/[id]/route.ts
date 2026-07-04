import { validatePetMarketCheckoutReservation } from "@/lib/templates/db/pet-market";
import { handlePetMarketRoute } from "../../_lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** GET /api/pet-market/reservations/:id — validate active checkout hold */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handlePetMarketRoute(() => validatePetMarketCheckoutReservation(id));
}
