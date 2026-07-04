import { startLooneyTunesLogin, type LooneyTunesLoginInput } from "@/lib/templates/db/looney-tunes";
import { handleLooneyTunesMutationRoute, readJsonBody } from "../../_lib/http";

/** POST /api/looney-tunes/auth/login */
export async function POST(request: Request) {
  return handleLooneyTunesMutationRoute(async () => {
    const body = await readJsonBody<LooneyTunesLoginInput>(request);
    const session = await startLooneyTunesLogin(body);
    return { session };
  });
}
