import { revokeLooneyTunesSession } from "@/lib/templates/db/looney-tunes";
import { handleLooneyTunesMutationRoute } from "../../_lib/http";

function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

/** POST /api/looney-tunes/auth/logout */
export async function POST(request: Request) {
  return handleLooneyTunesMutationRoute(async () => {
    const token = readBearerToken(request);
    await revokeLooneyTunesSession(token);
    return { logged_out: true };
  });
}
