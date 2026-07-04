import { completePetMarketCheckoutReservation } from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, readJsonBody } from "../../_lib/http";

type StripeWebhookBody = {
  type?: string;
  data?: {
    object?: {
      metadata?: {
        reservationId?: string;
      };
    };
  };
};

/**
 * Demo Stripe webhook handler.
 * Attach `reservationId` to PaymentIntent/Checkout Session metadata when creating payment.
 * On success: complete reservation and reduce stock.
 * On failure/cancel: client should call /reservations/:id/release.
 */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody<StripeWebhookBody>(request);
    const eventType = body.type ?? "";
    const reservationId = body.data?.object?.metadata?.reservationId;

    if (!reservationId) {
      return { handled: false, reason: "missing_reservation_metadata" };
    }

    if (eventType.includes("payment_intent.succeeded") || eventType.includes("checkout.session.completed")) {
      try {
        return await completePetMarketCheckoutReservation(reservationId);
      } catch (error) {
        return {
          handled: false,
          reservationId,
          requires_manual_review: true,
          error: error instanceof Error ? error.message : "completion_failed",
        };
      }
    }

    return { handled: false, reservationId, eventType };
  });
}
