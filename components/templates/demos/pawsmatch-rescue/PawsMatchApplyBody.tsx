"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PmrAdoptionApplicationDTO, PmrAdoptionApplicationForm } from "@/lib/templates/db/pawsmatch-rescue/types";
import {
  consumePetMarketApiError,
  fetchPmrApplicationForPet,
  startPmrPendingApplication,
  submitPmrAdoptionApplication,
} from "@/lib/templates/api/pawsmatch-rescue";
import { pmrPetMarketAuth } from "@/lib/templates/api/pet-market-auth-client";
import { usePawsMatchAuth, usePawsMatchRequireAuth } from "./PawsMatchAuthContext";
import { PMR_APPLICATION_STATUS } from "./pmrApplicationStatus";
import { PMR_PATHS, pmrApplyHref } from "./pawsMatchRescueConfig";
import {
  getPmrPetById,
  isPmrPetOpenForApplication,
  type AdoptablePet,
} from "./pawsMatchRescueData";
import { PmrButton, PmrContainer, PmrSectionHeading, PmrSectionLabel } from "./PawsMatchShared";

const EMPTY_FORM: PmrAdoptionApplicationForm = {
  phone: "",
  address: "",
  housingType: "",
  hasYard: false,
  otherPets: "",
  experience: "",
  whyAdopt: "",
  householdNotes: "",
};

export function PawsMatchApplyBody() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const petId = searchParams.get("pet") ?? "";
  const pet = getPmrPetById(petId);
  const loginRedirect = `${PMR_PATHS.login}?returnTo=${encodeURIComponent(pmrApplyHref(petId))}`;
  const { hydrated } = usePawsMatchRequireAuth(loginRedirect);
  const { user, isLoggedIn } = usePawsMatchAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PmrAdoptionApplicationForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingApp, setExistingApp] = useState<PmrAdoptionApplicationDTO | null>(null);
  const [checkingApp, setCheckingApp] = useState(true);

  useEffect(() => {
    if (!hydrated || !isLoggedIn || !petId) return;
    const token = pmrPetMarketAuth.getAuthToken();
    if (!token) return;

    void fetchPmrApplicationForPet(token, petId)
      .then((app) => {
        setExistingApp(app);
        if (
          !app ||
          app.status === "pending" ||
          app.status === "denied" ||
          app.status === "withdrawn"
        ) {
          return startPmrPendingApplication(token, petId).catch(() => {
            /* draft may already exist */
          });
        }
      })
      .finally(() => setCheckingApp(false));
  }, [hydrated, isLoggedIn, petId]);

  if (!petId || !pet) {
    return (
      <main className="py-16">
        <PmrContainer className="max-w-lg text-center">
          <PmrSectionHeading as="h1" className="text-2xl">
            Choose a pet first
          </PmrSectionHeading>
          <p className="mt-3 text-sm text-[var(--pmr-brown-muted)]">
            Browse adoptable pets and start an application from their profile.
          </p>
          <PmrButton href={PMR_PATHS.pets} className="mt-6">
            Discover pets
          </PmrButton>
        </PmrContainer>
      </main>
    );
  }

  if (!hydrated || !user) {
    return (
      <main className="py-24 text-center text-sm text-[var(--pmr-brown-muted)]">
        Loading your account…
      </main>
    );
  }

  if (checkingApp) {
    return (
      <main className="py-24 text-center text-sm text-[var(--pmr-brown-muted)]">
        Checking your application…
      </main>
    );
  }

  const blockedStatuses = ["under_review", "approved", "pet_unavailable"] as const;
  if (
    existingApp &&
    blockedStatuses.includes(existingApp.status as (typeof blockedStatuses)[number])
  ) {
    const meta = PMR_APPLICATION_STATUS[existingApp.status];
    return (
      <main className="py-16">
        <PmrContainer className="max-w-lg text-center">
          <PmrSectionHeading as="h1" className="text-2xl">
            {meta.headline}
          </PmrSectionHeading>
          <p className="mt-3 text-sm text-[var(--pmr-brown-muted)]">{meta.message}</p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <PmrButton href={PMR_PATHS.account}>View your applications</PmrButton>
            <PmrButton href={PMR_PATHS.pets} variant="outline">
              Browse other pets
            </PmrButton>
          </div>
        </PmrContainer>
      </main>
    );
  }

  if (!isPmrPetOpenForApplication(pet)) {
    return (
      <main className="py-16">
        <PmrContainer className="max-w-lg text-center">
          <PmrSectionHeading as="h1" className="text-2xl">
            {pet.name} isn&apos;t accepting applications
          </PmrSectionHeading>
          <p className="mt-3 text-sm">This pet&apos;s status is {pet.status}. Please choose another match.</p>
          <PmrButton href={PMR_PATHS.pets} className="mt-6">
            Browse other pets
          </PmrButton>
        </PmrContainer>
      </main>
    );
  }

  const inputClass = "pmr-input pmr-focus-ring w-full px-4 py-3 text-sm";

  function updateForm<K extends keyof PmrAdoptionApplicationForm>(key: K, value: PmrAdoptionApplicationForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    const token = pmrPetMarketAuth.getAuthToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      await submitPmrAdoptionApplication(token, petId, form);
      router.push(`${PMR_PATHS.applySuccess}?pet=${encodeURIComponent(petId)}`);
    } catch (err) {
      const message = consumePetMarketApiError(err, "Could not submit application");
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="py-10 md:py-14">
      <PmrContainer className="max-w-2xl">
        <ApplyProgress step={step} />

        {step === 1 ? (
          <section className="mt-8">
            <PmrSectionLabel>Step 1 of 3</PmrSectionLabel>
            <PmrSectionHeading as="h1" className="text-3xl">
              You&apos;re applying for {pet.name}
            </PmrSectionHeading>
            <p className="mt-2 text-sm leading-relaxed text-[var(--pmr-brown-muted)]">
              Take a breath — there&apos;s no rush. Confirm this is the pet you&apos;d like our team to
              review.
            </p>
            <PetSummary pet={pet} className="mt-6" />
            <div className="mt-8 flex flex-wrap gap-3">
              <PmrButton onClick={() => setStep(2)}>Continue to application</PmrButton>
              <Link
                href={PMR_PATHS.pet(petId)}
                className="pmr-focus-ring inline-flex items-center text-sm font-semibold text-[var(--pmr-terracotta)]"
              >
                Back to profile
              </Link>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="mt-8">
            <PmrSectionLabel>Step 2 of 3</PmrSectionLabel>
            <PmrSectionHeading as="h1" className="text-2xl md:text-3xl">
              Tell us about your home
            </PmrSectionHeading>
            <p className="mt-2 text-sm text-[var(--pmr-brown-muted)]">
              Honest answers help us place pets safely. You can save and come back — we&apos;ll keep your
              draft.
            </p>
            <form
              className="pmr-card mt-6 space-y-4 p-6"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(3);
              }}
            >
              <Field label="Phone" id="pmr-phone">
                <input
                  id="pmr-phone"
                  required
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                />
              </Field>
              <Field label="Home address" id="pmr-address">
                <input
                  id="pmr-address"
                  required
                  className={inputClass}
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                />
              </Field>
              <Field label="Housing type" id="pmr-housing">
                <select
                  id="pmr-housing"
                  required
                  className={inputClass}
                  value={form.housingType}
                  onChange={(e) => updateForm("housingType", e.target.value)}
                >
                  <option value="">Select…</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment / condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="other">Other</option>
                </select>
              </Field>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.hasYard}
                  onChange={(e) => updateForm("hasYard", e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--pmr-line)]"
                />
                I have a secure outdoor space or yard
              </label>
              <Field label="Other pets at home" id="pmr-other-pets">
                <textarea
                  id="pmr-other-pets"
                  rows={2}
                  className={inputClass}
                  placeholder="None, or describe species, ages, and temperament"
                  value={form.otherPets}
                  onChange={(e) => updateForm("otherPets", e.target.value)}
                />
              </Field>
              <Field label="Experience with pets" id="pmr-experience">
                <textarea
                  id="pmr-experience"
                  required
                  rows={3}
                  className={inputClass}
                  value={form.experience}
                  onChange={(e) => updateForm("experience", e.target.value)}
                />
              </Field>
              <Field label={`Why ${pet.name} feels like the right match`} id="pmr-why">
                <textarea
                  id="pmr-why"
                  required
                  rows={4}
                  className={inputClass}
                  value={form.whyAdopt}
                  onChange={(e) => updateForm("whyAdopt", e.target.value)}
                />
              </Field>
              <Field label="Anything else we should know? (optional)" id="pmr-notes">
                <textarea
                  id="pmr-notes"
                  rows={2}
                  className={inputClass}
                  value={form.householdNotes}
                  onChange={(e) => updateForm("householdNotes", e.target.value)}
                />
              </Field>
              <div className="flex flex-wrap gap-3 pt-2">
                <PmrButton type="submit">Review application</PmrButton>
                <button
                  type="button"
                  className="text-sm font-semibold text-[var(--pmr-terracotta)]"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="mt-8">
            <PmrSectionLabel>Step 3 of 3</PmrSectionLabel>
            <PmrSectionHeading as="h1" className="text-2xl md:text-3xl">
              Review &amp; submit
            </PmrSectionHeading>
            <PetSummary pet={pet} className="mt-6" />
            <dl className="pmr-card mt-4 divide-y divide-[var(--pmr-line)] p-6 text-sm">
              <ReviewRow label="Phone" value={form.phone} />
              <ReviewRow label="Address" value={form.address} />
              <ReviewRow label="Housing" value={form.housingType} />
              <ReviewRow label="Secure outdoor space" value={form.hasYard ? "Yes" : "No"} />
              <ReviewRow label="Other pets" value={form.otherPets || "None listed"} />
              <ReviewRow label="Experience" value={form.experience} />
              <ReviewRow label="Why this pet" value={form.whyAdopt} />
              {form.householdNotes ? (
                <ReviewRow label="Additional notes" value={form.householdNotes} />
              ) : null}
            </dl>
            {error ? (
              <p className="mt-4 text-sm text-rose-700" role="alert">
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <PmrButton onClick={() => void handleSubmit()} ariaLabel="Submit adoption application">
                {loading ? "Submitting…" : "Submit application"}
              </PmrButton>
              <button
                type="button"
                className="text-sm font-semibold text-[var(--pmr-terracotta)]"
                onClick={() => setStep(2)}
              >
                Edit answers
              </button>
            </div>
          </section>
        ) : null}
      </PmrContainer>
    </main>
  );
}

function ApplyProgress({ step }: { step: number }) {
  const labels = ["Choose pet", "Your home", "Submit"];
  return (
    <ol className="flex gap-2" aria-label="Application progress">
      {labels.map((label, index) => {
        const n = index + 1;
        const active = n === step;
        const done = n < step;
        return (
          <li
            key={label}
            className={`flex-1 rounded-full px-3 py-2 text-center text-xs font-semibold ${
              active
                ? "bg-[var(--pmr-terracotta)] text-white"
                : done
                  ? "bg-[var(--pmr-sage-light)] text-[var(--pmr-sage-muted)]"
                  : "bg-[var(--pmr-bg-warm)] text-[var(--pmr-brown-light)]"
            }`}
          >
            {label}
          </li>
        );
      })}
    </ol>
  );
}

function PetSummary({ pet, className = "" }: { pet: AdoptablePet; className?: string }) {
  return (
    <div className={`pmr-card flex gap-4 p-4 ${className}`}>
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <Image src={pet.image} alt={pet.imageAlt} fill className="object-cover" sizes="96px" />
      </div>
      <div>
        <p className="text-lg font-bold text-[var(--pmr-brown)]">{pet.name}</p>
        <p className="text-sm text-[var(--pmr-brown-muted)]">
          {pet.age} · {pet.breed}
        </p>
        <p className="mt-2 text-xs text-[var(--pmr-sage-muted)]">{pet.matchScore}% compatibility match</p>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-[var(--pmr-brown)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--pmr-brown-light)]">
        {label}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap text-[var(--pmr-brown)]">{value}</dd>
    </div>
  );
}
