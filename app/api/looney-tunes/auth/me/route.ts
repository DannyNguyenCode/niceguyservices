import { getLooneyTunesSession } from "@/lib/templates/db/looney-tunes";
import { LooneyTunesProductError } from "@/lib/templates/db/looney-tunes/errors";
import { handleLooneyTunesRoute } from "../../_lib/http";

function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

/** GET /api/looney-tunes/auth/me */
export async function GET(request: Request) {
  return handleLooneyTunesRoute(async () => {
    const token = readBearerToken(request);
    const session = await getLooneyTunesSession(token);
    if (!session) {
      throw new LooneyTunesProductError("Session expired or invalid", "INVALID_SESSION", 401);
    }
    return { session };
  });
}
