import { PS_PATHS } from "./pawsomeConfig";
import { createPetMarketCheckoutSessionHelpers } from "@/lib/templates/pet-market-checkout/session";

export const psCheckoutSession = createPetMarketCheckoutSessionHelpers("ps", PS_PATHS.checkout);
