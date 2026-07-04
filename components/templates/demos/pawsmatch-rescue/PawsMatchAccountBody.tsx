"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { PmrAdoptionApplicationDTO } from "@/lib/templates/db/pawsmatch-rescue/types";
import {
  consumePetMarketApiError,
  fetchPmrApplications,
  withdrawPmrApplication,
} from "@/lib/templates/api/pawsmatch-rescue";
import { pmrPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { usePawsMatchAuth, usePawsMatchRequireAuth } from "./PawsMatchAuthContext";
import { PMR_APPLICATION_STATUS, pmrStatusBadgeClass } from "./pmrApplicationStatus";
import { PmrAdoptionProgressTracker } from "./PmrAdoptionProgressTracker";
import { PMR_PATHS } from "./pawsMatchRescueConfig";
import { getPmrPetById } from "./pawsMatchRescueData";
import {
  PmrButton,
  PmrContainer,
  PmrIcon,
  PmrSectionHeading,
  PmrSectionLabel,
} from "./PawsMatchShared";

export function PawsMatchAccountBody() {
  const router = useRouter();
  const { hydrated } = usePawsMatchRequireAuth();
  const { user, logout } = usePawsMatchAuth();
  const [applications, setApplications] = useState<PmrAdoptionApplicationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [confirmWithdrawId, setConfirmWithdrawId] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || !user) return;
    const token = pmrPetMarketAuth.getAuthToken();
    if (!token) return;

    void fetchPmrApplications(token)
      .then(setApplications)
      .catch((err) => {
        const message = consumePetMarketApiError(err, "Could not load applications");
        if (message) setError(message);
      })
      .finally(() => setLoading(false));
  }, [hydrated, user]);

  if (!hydrated || !user) {
    return (
      <main className="py-24 text-center text-sm text-[var(--pmr-brown-muted)]">
        Loading your profile…
      </main>
    );
  }

  async function handleSignOut() {
    await logout();
    router.push(PMR_PATHS.login);
  }

  async function handleWithdraw(applicationId: string) {
    const token = pmrPetMarketAuth.getAuthToken();
    if (!token) return;
    setWithdrawingId(applicationId);
    setError(null);
    try {
      const updated = await withdrawPmrApplication(token, applicationId);
      setApplications((prev) => prev.map((row) => (row.id === applicationId ? updated : row)));
      setConfirmWithdrawId(null);
    } catch (err) {
      const message = consumePetMarketApiError(err, "Could not withdraw application");
      if (message) setError(message);
    } finally {
      setWithdrawingId(null);
    }
  }

  return (
    <main className="py-10 md:py-14">
      <PmrContainer className="max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <PmrSectionLabel>Your profile</PmrSectionLabel>
            <PmrSectionHeading as="h1" className="text-3xl">
              Hello, {user.name}
            </PmrSectionHeading>
            <p className="mt-1 text-sm text-[var(--pmr-brown-muted)]">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="pmr-focus-ring rounded-full border border-[var(--pmr-line)] px-5 py-2.5 text-sm font-semibold text-[var(--pmr-brown-muted)]"
          >
            Sign out
          </button>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-[var(--pmr-brown)]">Adoption applications</h2>
          <p className="mt-1 text-sm text-[var(--pmr-brown-muted)]">
            Track each application here. If your plans change while we&apos;re reviewing, you can
            withdraw. If a pet is approved for another home, we&apos;ll update your status so you
            know right away.
          </p>

          {loading ? (
            <p className="mt-6 text-sm text-[var(--pmr-brown-muted)]">Loading applications…</p>
          ) : error ? (
            <p className="mt-6 text-sm text-rose-700" role="alert">
              {error}
            </p>
          ) : applications.length === 0 ? (
            <div className="pmr-card mt-6 p-8 text-center">
              <PmrIcon name="pets" className="mx-auto mb-3 text-4xl text-[var(--pmr-brown-light)]" />
              <p className="font-semibold text-[var(--pmr-brown)]">No applications yet</p>
              <p className="mt-2 text-sm text-[var(--pmr-brown-muted)]">
                When you find a pet you love, start an application — we&apos;ll guide you step by step.
              </p>
              <PmrButton href={PMR_PATHS.pets} className="mt-6">
                Discover pets
              </PmrButton>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {applications.map((app) => {
                const pet = getPmrPetById(app.petId);
                const meta = PMR_APPLICATION_STATUS[app.status];
                return (
                  <li key={app.id} className="pmr-card overflow-hidden">
                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                      {pet ? (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={pet.image}
                            alt={pet.imageAlt}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-[var(--pmr-brown)]">
                            {pet?.name ?? app.petId}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide ${pmrStatusBadgeClass(meta.tone)}`}
                          >
                            {meta.label}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-[var(--pmr-brown)]">
                          {meta.headline}
                        </p>
                        <p className="mt-1 text-sm text-[var(--pmr-brown-muted)]">{meta.message}</p>
                        <PmrAdoptionProgressTracker status={app.status} className="mt-4" />
                        {app.submittedAt ? (
                          <p className="mt-2 text-xs text-[var(--pmr-brown-light)]">
                            Submitted {new Date(app.submittedAt).toLocaleDateString()}
                          </p>
                        ) : app.status === "pending" ? (
                          <Link
                            href={`${PMR_PATHS.apply}?pet=${encodeURIComponent(app.petId)}`}
                            className="mt-2 inline-flex text-sm font-semibold text-[var(--pmr-terracotta)]"
                          >
                            Finish application →
                          </Link>
                        ) : null}
                        {app.status === "under_review" ? (
                          <div className="mt-4">
                            {confirmWithdrawId === app.id ? (
                              <div className="rounded-xl border border-[var(--pmr-line)] bg-[var(--pmr-bg-warm)] p-4">
                                <p className="text-sm font-semibold text-[var(--pmr-brown)]">
                                  No longer interested in {pet?.name ?? "this pet"}?
                                </p>
                                <p className="mt-1 text-sm text-[var(--pmr-brown-muted)]">
                                  That&apos;s okay — life changes. We&apos;ll close this application
                                  and you can apply for other pets anytime.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button
                                    type="button"
                                    disabled={withdrawingId === app.id}
                                    onClick={() => void handleWithdraw(app.id)}
                                    className="pmr-focus-ring rounded-full bg-[var(--pmr-brown)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                  >
                                    {withdrawingId === app.id ? "Withdrawing…" : "Yes, withdraw"}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={withdrawingId === app.id}
                                    onClick={() => setConfirmWithdrawId(null)}
                                    className="pmr-focus-ring rounded-full border border-[var(--pmr-line)] px-4 py-2 text-sm font-semibold text-[var(--pmr-brown-muted)]"
                                  >
                                    Keep application
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmWithdrawId(app.id)}
                                className="pmr-focus-ring rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                              >
                                No longer interested
                              </button>
                            )}
                          </div>
                        ) : null}
                        {app.status === "pet_unavailable" || app.status === "withdrawn" ? (
                          <PmrButton href={PMR_PATHS.pets} variant="outline" className="mt-4">
                            Browse other pets
                          </PmrButton>
                        ) : null}
                        {app.status === "withdrawn" ? (
                          <Link
                            href={`${PMR_PATHS.apply}?pet=${encodeURIComponent(app.petId)}`}
                            className="mt-3 inline-flex text-sm font-semibold text-[var(--pmr-terracotta)]"
                          >
                            Apply again for {pet?.name ?? "this pet"} →
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </PmrContainer>
    </main>
  );
}
