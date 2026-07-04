import {
  getPetMarketAvailabilityBatch,
} from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, readJsonBody } from "../_lib/http";

type AvailabilityBody = {
  product_ids: string[];
  checkout_session_id?: string;
};

/** POST /api/pet-market/availability — batch available stock snapshot */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody<AvailabilityBody>(request);
    const productIds = body.product_ids ?? [];
    const items = await getPetMarketAvailabilityBatch(productIds, {
      excludeCheckoutSessionId: body.checkout_session_id,
    });
    return { items };
  });
}
