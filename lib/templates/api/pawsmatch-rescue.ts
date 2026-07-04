import type {
  PmrAdoptionApplicationAdminDTO,
  PmrAdoptionApplicationDTO,
  PmrAdoptionApplicationForm,
  PmrApplicationStatus,
} from "@/lib/templates/db/pawsmatch-rescue/types";
import {
  consumePetMarketApiError,
  petMarketFetch,
  readJson,
} from "./pet-market";

export const PMR_API = {
  adoptions: "/api/pawsmatch-rescue/adoptions",
  adoption: (id: string) => `/api/pawsmatch-rescue/adoptions/${encodeURIComponent(id)}`,
} as const;

function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchPmrApplications(
  token: string | null,
): Promise<PmrAdoptionApplicationDTO[] | PmrAdoptionApplicationAdminDTO[]> {
  if (!token) return [];

  const response = await petMarketFetch(PMR_API.adoptions, {
    headers: authHeaders(token),
  });
  const data = await readJson<{
    applications: PmrAdoptionApplicationDTO[] | PmrAdoptionApplicationAdminDTO[];
  }>(response);
  return data.applications;
}

export async function updatePmrApplicationStatus(
  token: string,
  applicationId: string,
  status: PmrApplicationStatus,
): Promise<PmrAdoptionApplicationAdminDTO> {
  const response = await petMarketFetch(PMR_API.adoption(applicationId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ status }),
  });
  const data = await readJson<{ application: PmrAdoptionApplicationAdminDTO }>(response);
  return data.application;
}

export async function withdrawPmrApplication(
  token: string,
  applicationId: string,
): Promise<PmrAdoptionApplicationDTO> {
  const response = await petMarketFetch(PMR_API.adoption(applicationId), {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ action: "withdraw" }),
  });
  const data = await readJson<{ application: PmrAdoptionApplicationDTO }>(response);
  return data.application;
}

export async function fetchPmrApplicationForPet(
  token: string | null,
  petId: string,
): Promise<PmrAdoptionApplicationDTO | null> {
  if (!token) return null;

  const response = await petMarketFetch(`${PMR_API.adoptions}?petId=${encodeURIComponent(petId)}`, {
    headers: authHeaders(token),
  });
  const data = await readJson<{ application: PmrAdoptionApplicationDTO | null }>(response);
  return data.application;
}

export async function startPmrPendingApplication(
  token: string,
  petId: string,
): Promise<PmrAdoptionApplicationDTO> {
  const response = await petMarketFetch(PMR_API.adoptions, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ petId, action: "pending" }),
  });
  const data = await readJson<{ application: PmrAdoptionApplicationDTO }>(response);
  return data.application;
}

export async function submitPmrAdoptionApplication(
  token: string,
  petId: string,
  form: PmrAdoptionApplicationForm,
): Promise<PmrAdoptionApplicationDTO> {
  const response = await petMarketFetch(PMR_API.adoptions, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ petId, action: "submit", form }),
  });
  const data = await readJson<{ application: PmrAdoptionApplicationDTO }>(response);
  return data.application;
}

export type { PmrApplicationStatus, PmrAdoptionApplicationDTO, PmrAdoptionApplicationAdminDTO };

export { consumePetMarketApiError };
