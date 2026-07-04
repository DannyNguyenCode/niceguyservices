"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PmrAdoptionApplicationAdminDTO, PmrApplicationStatus } from "@/lib/templates/db/pawsmatch-rescue/types";
import {
  consumePetMarketApiError,
  fetchPmrApplications,
  updatePmrApplicationStatus,
} from "@/lib/templates/api/pawsmatch-rescue";
import { pmrPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { usePawsMatchAuth, usePawsMatchRequireAuth } from "./PawsMatchAuthContext";
import { PMR_APPLICATION_STATUS, pmrStatusBadgeClass, PMR_ADMIN_SETTABLE_STATUSES } from "./pmrApplicationStatus";
import { isPmrAdminUser, PMR_PATHS } from "./pawsMatchRescueConfig";
import { getPmrPetById } from "./pawsMatchRescueData";
import { PmrButton, PmrContainer, PmrSectionHeading, PmrSectionLabel } from "./PawsMatchShared";

const STATUS_OPTIONS = PMR_ADMIN_SETTABLE_STATUSES;

export function PawsMatchAdminBody() {
  const router = useRouter();
  const loginRedirect = `${PMR_PATHS.login}?returnTo=${encodeURIComponent(PMR_PATHS.admin)}`;
  const { hydrated } = usePawsMatchRequireAuth(loginRedirect);
  const { user, logout } = usePawsMatchAuth();
  const [applications, setApplications] = useState<PmrAdoptionApplicationAdminDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isAdmin = isPmrAdminUser(user);

  useEffect(() => {
    if (!hydrated || !user || !isAdmin) return;
    const token = pmrPetMarketAuth.getAuthToken();
    if (!token) return;

    void fetchPmrApplications(token)
      .then((rows) => setApplications(rows as PmrAdoptionApplicationAdminDTO[]))
      .catch((err) => {
        const message = consumePetMarketApiError(err, "Could not load applications");
        if (message) setError(message);
      })
      .finally(() => setLoading(false));
  }, [hydrated, user, isAdmin]);

  useEffect(() => {
    if (hydrated && user && !isAdmin) {
      router.replace(PMR_PATHS.account);
    }
  }, [hydrated, user, isAdmin, router]);

  if (!hydrated || !user) {
    return (
      <main className="py-24 text-center text-sm text-[var(--pmr-brown-muted)]">
        Loading admin…
      </main>
    );
  }

  if (!isAdmin) return null;

  async function handleStatusChange(applicationId: string, status: PmrApplicationStatus) {
    const token = pmrPetMarketAuth.getAuthToken();
    if (!token) return;
    setUpdatingId(applicationId);
    setError(null);
    try {
      await updatePmrApplicationStatus(token, applicationId, status);
      const rows = await fetchPmrApplications(token);
      setApplications(rows as PmrAdoptionApplicationAdminDTO[]);
    } catch (err) {
      const message = consumePetMarketApiError(err, "Could not update status");
      if (message) setError(message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleSignOut() {
    await logout();
    router.push(PMR_PATHS.login);
  }

  return (
    <main className="py-10 md:py-14">
      <PmrContainer className="max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <PmrSectionLabel>Demo admin</PmrSectionLabel>
            <PmrSectionHeading as="h1" className="text-3xl">
              Adoption applications
            </PmrSectionHeading>
            <p className="mt-1 text-sm text-[var(--pmr-brown-muted)]">
              Review submissions and update status. Approving one applicant automatically marks other
              under-review applications for the same pet as unavailable.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="pmr-focus-ring rounded-full border border-[var(--pmr-line)] px-5 py-2.5 text-sm font-semibold"
          >
            Sign out
          </button>
        </div>

        {error ? (
          <p className="mt-6 text-sm text-rose-700" role="alert">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-8 text-sm text-[var(--pmr-brown-muted)]">Loading applications…</p>
        ) : applications.length === 0 ? (
          <div className="pmr-card mt-8 p-8 text-center text-sm text-[var(--pmr-brown-muted)]">
            No applications yet. Sign in as an adopter, apply for a pet, then refresh this page.
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {applications.map((app) => {
              const pet = getPmrPetById(app.petId);
              const meta = PMR_APPLICATION_STATUS[app.status];
              return (
                <li key={app.id} className="pmr-card p-5 md:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-lg font-bold text-[var(--pmr-brown)]">
                          {pet?.name ?? app.petId}
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${pmrStatusBadgeClass(meta.tone)}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--pmr-brown-muted)]">
                        Applicant: <strong>{app.userEmail}</strong>
                      </p>
                      {app.submittedAt ? (
                        <p className="mt-1 text-xs text-[var(--pmr-brown-light)]">
                          Submitted {new Date(app.submittedAt).toLocaleString()}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-amber-700">Draft — not submitted yet</p>
                      )}
                      {app.form.whyAdopt ? (
                        <p className="mt-3 text-sm leading-relaxed text-[var(--pmr-brown-muted)]">
                          &ldquo;{app.form.whyAdopt}&rdquo;
                        </p>
                      ) : null}
                    </div>

                    <div className="shrink-0">
                      <label htmlFor={`status-${app.id}`} className="mb-1 block text-xs font-semibold uppercase tracking-wide">
                        Update status
                      </label>
                      {STATUS_OPTIONS.includes(app.status) ? (
                        <select
                          id={`status-${app.id}`}
                          value={app.status}
                          disabled={updatingId === app.id}
                          onChange={(e) =>
                            void handleStatusChange(app.id, e.target.value as PmrApplicationStatus)
                          }
                          className="pmr-input pmr-focus-ring min-w-[11rem] px-3 py-2.5 text-sm"
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {PMR_APPLICATION_STATUS[status].label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p
                          id={`status-${app.id}`}
                          className="min-w-[11rem] rounded-xl border border-[var(--pmr-line)] bg-[var(--pmr-bg-warm)] px-3 py-2.5 text-sm text-[var(--pmr-brown-muted)]"
                        >
                          {meta.label} — set by applicant or system
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10">
          <PmrButton href={PMR_PATHS.pets} variant="outline">
            View adoptable pets
          </PmrButton>
        </div>
      </PmrContainer>
    </main>
  );
}
