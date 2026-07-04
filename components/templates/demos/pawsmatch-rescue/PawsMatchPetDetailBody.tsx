"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { usePawsMatchAuth } from "./PawsMatchAuthContext";
import { PMR_PATHS, pmrApplyHref } from "./pawsMatchRescueConfig";
import {
  getPmrPetById,
  isPmrPetOpenForApplication,
  type AdoptablePet,
} from "./pawsMatchRescueData";
import {
  PmrButton,
  PmrContainer,
  PmrIcon,
  PmrTag,
  pmrDisplay,
} from "./PawsMatchShared";

type PawsMatchPetDetailBodyProps = {
  petId: string;
};

export function PawsMatchPetDetailBody({ petId }: PawsMatchPetDetailBodyProps) {
  const pet = getPmrPetById(petId);
  const { isLoggedIn, hydrated } = usePawsMatchAuth();

  if (!pet) notFound();

  const applyHref = hydrated && isLoggedIn
    ? pmrApplyHref(pet.id)
    : `${PMR_PATHS.login}?returnTo=${encodeURIComponent(pmrApplyHref(pet.id))}`;

  const canApply = isPmrPetOpenForApplication(pet);

  return (
    <main className="py-10 md:py-14">
      <PmrContainer className="max-w-3xl">
        <Link
          href={PMR_PATHS.pets}
          className="pmr-focus-ring inline-flex items-center gap-2 text-sm font-semibold text-[var(--pmr-terracotta)]"
        >
          <PmrIcon name="arrow_back" className="text-lg" />
          Back to all pets
        </Link>

        <PetDetailContent pet={pet} />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {canApply ? (
            <PmrButton href={applyHref} className="flex-1">
              Apply to adopt {pet.name}
            </PmrButton>
          ) : (
            <p className="rounded-xl bg-[var(--pmr-bg-warm)] px-4 py-3 text-sm text-[var(--pmr-brown-muted)]">
              {pet.name} is currently {pet.status.toLowerCase()} and not accepting new applications.
            </p>
          )}
          <PmrButton href={PMR_PATHS.pets} variant="outline" className="flex-1">
            Browse other pets
          </PmrButton>
        </div>
      </PmrContainer>
    </main>
  );
}

function PetDetailContent({ pet }: { pet: AdoptablePet }) {
  const goodWithItems = [
    { label: "Kids", ok: pet.goodWith.kids },
    { label: "Dogs", ok: pet.goodWith.dogs },
    { label: "Cats", ok: pet.goodWith.cats },
  ];

  return (
    <article className="pmr-card mt-6 overflow-hidden">
      <div className="relative aspect-[4/3] w-full md:aspect-[16/10]">
        <Image
          src={pet.image}
          alt={pet.imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--pmr-brown)]">
            {pet.status}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <p className="pmr-label text-[var(--pmr-terracotta)]">Their profile</p>
        <h1 className="pmr-display mt-2 text-3xl text-[var(--pmr-brown)] md:text-4xl" style={pmrDisplay}>
          {pet.name}
        </h1>
        <p className="mt-1 text-[var(--pmr-brown-muted)]">
          {pet.age} · {pet.breed}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {pet.personalityTags.map((tag) => (
            <PmrTag key={tag}>{tag}</PmrTag>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-[var(--pmr-bg)] p-5">
          <h2 className="pmr-display mb-3 text-lg text-[var(--pmr-brown)]" style={pmrDisplay}>
            Their journey
          </h2>
          <p className="text-sm leading-relaxed text-[var(--pmr-brown-muted)]">{pet.story}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--pmr-line)] p-4">
            <h3 className="pmr-label mb-3 text-[var(--pmr-brown)]">Good with</h3>
            <ul className="space-y-2">
              {goodWithItems.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  <PmrIcon
                    name={item.ok ? "check_circle" : "cancel"}
                    className={`text-lg ${item.ok ? "pmr-check-icon" : "text-[var(--pmr-brown-light)]"}`}
                  />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--pmr-line)] p-4">
            <h3 className="pmr-label mb-3 text-[var(--pmr-brown)]">Needs</h3>
            <ul className="space-y-2">
              {pet.needs.map((need) => (
                <li key={need} className="flex items-start gap-2 text-sm text-[var(--pmr-brown-muted)]">
                  <PmrIcon name="arrow_forward" className="pmr-check-icon mt-0.5 text-base" />
                  {need}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-[var(--pmr-sage-light)] px-5 py-4">
          <span className="text-sm font-medium text-[var(--pmr-brown-muted)]">Adoption fee</span>
          <span className="text-xl font-bold text-[var(--pmr-brown)]">${pet.adoptionFee}</span>
        </div>
      </div>
    </article>
  );
}
