import { revokePetMarketSession } from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute } from "../../_lib/http";

function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

/** POST /api/pet-market/auth/logout */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const token = readBearerToken(request);
    await revokePetMarketSession(token);
    return { logged_out: true };
  });
}
