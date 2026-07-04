import {
  resetLooneyTunesPassword,
  type LooneyTunesResetPasswordInput,
} from "@/lib/templates/db/looney-tunes";
import { handleLooneyTunesMutationRoute, readJsonBody } from "../../_lib/http";

/** POST /api/looney-tunes/auth/reset-password */
export async function POST(request: Request) {
  return handleLooneyTunesMutationRoute(async () => {
    const body = await readJsonBody<LooneyTunesResetPasswordInput>(request);
    return resetLooneyTunesPassword(body);
  });
}
