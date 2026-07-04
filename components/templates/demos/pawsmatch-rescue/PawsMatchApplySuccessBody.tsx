"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getPmrPetById } from "./pawsMatchRescueData";
import { PMR_PATHS } from "./pawsMatchRescueConfig";
import { PmrButton, PmrContainer, PmrIcon, PmrSectionHeading } from "./PawsMatchShared";

export function PawsMatchApplySuccessBody() {
  const petId = useSearchParams().get("pet") ?? "";
  const pet = getPmrPetById(petId);

  return (
    <main className="py-16 md:py-24">
      <PmrContainer className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pmr-sage-light)] text-[var(--pmr-sage-muted)]">
          <PmrIcon name="check_circle" className="text-4xl" />
        </div>
        <PmrSectionHeading as="h1" className="text-3xl">
          Adoption application received
        </PmrSectionHeading>
        <p className="mt-4 text-sm leading-relaxed text-[var(--pmr-brown-muted)]">
          {pet
            ? `Thank you for applying to adopt ${pet.name}. Our team will review your application within 2–3 business days.`
            : "Thank you — our adoption team will review your application within 2–3 business days."}
        </p>
        <p className="mt-3 text-sm text-[var(--pmr-brown-muted)]">
          You can track status anytime from your profile. We&apos;ll email you when there&apos;s an update.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <PmrButton href={PMR_PATHS.account}>View my applications</PmrButton>
          <Link
            href={PMR_PATHS.pets}
            className="pmr-focus-ring inline-flex items-center justify-center rounded-full border border-[var(--pmr-line)] px-6 py-3 text-sm font-semibold text-[var(--pmr-brown)]"
          >
            Browse more pets
          </Link>
        </div>
      </PmrContainer>
    </main>
  );
}
