import { CP_PATHS } from "./companionPetConfig";
import { createPetMarketCheckoutSessionHelpers } from "@/lib/templates/pet-market-checkout/session";

export const cpCheckoutSession = createPetMarketCheckoutSessionHelpers("cp", CP_PATHS.checkout);
