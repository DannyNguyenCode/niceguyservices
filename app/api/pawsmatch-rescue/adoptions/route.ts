import { getPetMarketSession } from "@/lib/templates/db/pet-market";
import { PetMarketInventoryError } from "@/lib/templates/db/pet-market/errors";
import {
  createPmrPendingApplication,
  getPmrAdoptionApplicationForUserPet,
  listAllPmrAdoptionApplications,
  listPmrAdoptionApplicationsByUser,
  submitPmrAdoptionApplication,
  type PmrSubmitAdoptionApplicationInput,
} from "@/lib/templates/db/pawsmatch-rescue";
import { handlePmrRoute, readBearerToken, readJsonBody } from "../_lib/http";

async function requireSession(request: Request) {
  const token = readBearerToken(request);
  const session = await getPetMarketSession(token);
  if (!session) {
    throw new PetMarketInventoryError("Session expired or invalid", "INVALID_SESSION", 401);
  }
  return session;
}

/** GET /api/pawsmatch-rescue/adoptions — list applications or fetch one by ?petId= */
export async function GET(request: Request) {
  return handlePmrRoute(async () => {
    const session = await requireSession(request);
    const petId = new URL(request.url).searchParams.get("petId");

    if (session.user.role === "admin") {
      const applications = await listAllPmrAdoptionApplications();
      return { applications };
    }

    if (petId) {
      const application = await getPmrAdoptionApplicationForUserPet(session.user.email, petId);
      return { application };
    }

    const applications = await listPmrAdoptionApplicationsByUser(session.user.email);
    return { applications };
  });
}

/** POST /api/pawsmatch-rescue/adoptions — start pending draft or submit application */
export async function POST(request: Request) {
  return handlePmrRoute(async () => {
    const session = await requireSession(request);
    const body = await readJsonBody<
      PmrSubmitAdoptionApplicationInput & { action?: "pending" | "submit" }
    >(request);

    if (!body.petId?.trim()) {
      throw new Error("petId is required");
    }

    if (body.action === "pending") {
      const application = await createPmrPendingApplication(session.user.email, body.petId.trim());
      return { application };
    }

    if (!body.form) {
      throw new Error("form is required to submit");
    }

    const application = await submitPmrAdoptionApplication(session.user.email, {
      petId: body.petId.trim(),
      form: body.form,
    });
    return { application };
  });
}
