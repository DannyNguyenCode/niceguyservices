import { getPetMarketSession } from "@/lib/templates/db/pet-market";
import { PetMarketInventoryError } from "@/lib/templates/db/pet-market/errors";
import {
  updatePmrAdoptionApplicationStatus,
  withdrawPmrAdoptionApplication,
  PMR_ADMIN_SETTABLE_STATUSES,
  type PmrApplicationStatus,
} from "@/lib/templates/db/pawsmatch-rescue";
import { handlePmrRoute, readBearerToken, readJsonBody } from "@/app/api/pawsmatch-rescue/_lib/http";

type RouteContext = { params: Promise<{ id: string }> };

/** PATCH /api/pawsmatch-rescue/adoptions/[id] — admin updates status; adopters can withdraw */
export async function PATCH(request: Request, context: RouteContext) {
  return handlePmrRoute(async () => {
    const token = readBearerToken(request);
    const session = await getPetMarketSession(token);
    if (!session) {
      throw new PetMarketInventoryError("Session expired or invalid", "INVALID_SESSION", 401);
    }

    const { id } = await context.params;
    const body = await readJsonBody<{ status?: PmrApplicationStatus; action?: "withdraw" }>(request);

    if (session.user.role === "admin") {
      if (!body.status || !PMR_ADMIN_SETTABLE_STATUSES.includes(body.status)) {
        throw new Error("status must be pending, under_review, denied, or approved");
      }

      const application = await updatePmrAdoptionApplicationStatus(id, body.status);
      return { application };
    }

    if (body.action !== "withdraw") {
      throw new PetMarketInventoryError("Only withdrawal is allowed here", "FORBIDDEN", 403);
    }

    const application = await withdrawPmrAdoptionApplication(session.user.email, id);
    return { application };
  });
}
