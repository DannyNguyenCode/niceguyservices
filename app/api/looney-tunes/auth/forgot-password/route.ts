import { startLooneyTunesPasswordReset } from "@/lib/templates/db/looney-tunes";
import { handleLooneyTunesMutationRoute, readJsonBody } from "../../_lib/http";

type ForgotBody = { email: string };

/** POST /api/looney-tunes/auth/forgot-password */
export async function POST(request: Request) {
  return handleLooneyTunesMutationRoute(async () => {
    const body = await readJsonBody<ForgotBody>(request);
    return startLooneyTunesPasswordReset(body.email);
  });
}
