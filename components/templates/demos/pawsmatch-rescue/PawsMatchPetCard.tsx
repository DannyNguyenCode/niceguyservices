"use client";

import Image from "next/image";
import Link from "next/link";
import type { AdoptablePet } from "./pawsMatchRescueData";
import { PMR_PATHS } from "./pawsMatchRescueConfig";
import { PmrIcon, PmrTag } from "./PawsMatchShared";

type PawsMatchPetCardProps = {
  pet: AdoptablePet;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export function PawsMatchPetCard({
  pet,
  isFavorite,
  onToggleFavorite,
}: PawsMatchPetCardProps) {
  const statusColor =
    pet.status === "Available"
      ? "bg-[var(--pmr-sage-light)] text-[var(--pmr-sage-muted)]"
      : pet.status === "Pending"
        ? "bg-amber-100 text-amber-800"
        : "bg-[var(--pmr-sage-light)] text-[var(--pmr-sage-muted)]";

  return (
    <article className="pmr-card group overflow-hidden transition-shadow hover:shadow-[var(--pmr-card-shadow-hover)]">
      <Link href={PMR_PATHS.pet(pet.id)} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={pet.image}
            alt={pet.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute right-3 top-3">
            <PmrTag>{pet.matchScore}% Match</PmrTag>
          </div>
          <div className="absolute left-3 top-3">
            <span
              className={`rounded-full px-2.5 py-1 text-[0.625rem] font-bold uppercase tracking-wide ${statusColor}`}
            >
              {pet.status}
            </span>
          </div>
        </div>
      </Link>

      <div className="pmr-pet-card-footer p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <Link href={PMR_PATHS.pet(pet.id)} className="pmr-focus-ring rounded-sm">
              <h3 className="text-lg font-bold">{pet.name}</h3>
            </Link>
            <p className="text-sm text-white/75">
              {pet.age} · {pet.breed}
            </p>
          </div>
          <button
            type="button"
            className="pmr-focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            aria-label={isFavorite ? `Remove ${pet.name} from favorites` : `Save ${pet.name} to favorites`}
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(pet.id)}
          >
            <PmrIcon
              name="favorite"
              filled={isFavorite}
              className={`text-lg ${isFavorite ? "text-[var(--pmr-terracotta)]" : "text-white/80"}`}
            />
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {pet.personalityTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-white/90"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={PMR_PATHS.pet(pet.id)}
          className="pmr-focus-ring block w-full rounded-full bg-[var(--pmr-card)] py-2.5 text-center text-sm font-semibold text-[var(--pmr-brown)] transition-opacity hover:opacity-90"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
