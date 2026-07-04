import {
  registerLooneyTunesUser,
  type LooneyTunesRegisterInput,
} from "@/lib/templates/db/looney-tunes";
import { handleLooneyTunesMutationRoute, readJsonBody } from "../../_lib/http";

/** POST /api/looney-tunes/auth/register */
export async function POST(request: Request) {
  return handleLooneyTunesMutationRoute(async () => {
    const body = await readJsonBody<LooneyTunesRegisterInput>(request);
    const session = await registerLooneyTunesUser(body);
    return { session, message: "Welcome to the Comet Streak rewards club!" };
  });
}
