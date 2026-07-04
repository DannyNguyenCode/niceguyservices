import {
  verifyPetMarketLogin,
  type PetMarketVerifyCodeInput,
} from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, readJsonBody } from "../../_lib/http";

type VerifyBody = PetMarketVerifyCodeInput & {
  purpose?: PetMarketVerifyCodeInput["purpose"];
};

/** POST /api/pet-market/auth/verify — complete login with emailed 2FA code (unused while 2FA is disabled) */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody<VerifyBody>(request);
    const session = await verifyPetMarketLogin({
      email: body.email,
      code: body.code,
      purpose: "login_2fa",
    });
    return { session };
  });
}
