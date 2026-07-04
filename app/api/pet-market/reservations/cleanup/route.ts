import { expireStalePetMarketReservations } from "@/lib/templates/db/pet-market";
import { handlePetMarketRoute } from "../../_lib/http";

/** POST /api/pet-market/reservations/cleanup — mark expired active holds */
export async function POST() {
  return handlePetMarketRoute(async () => {
    const expired = await expireStalePetMarketReservations();
    return { expired };
  });
}
