"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { NeopetsPet } from "../neopetsPets";
import { NEOPETS_PATHS } from "../neopetsConfig";
import { AdoptionChecklist } from "./AdoptionChecklist";
import { AdoptionQuest } from "./AdoptionQuest";
import { PetGallery } from "./PetGallery";
import { PetInfoGrid } from "./PetInfoGrid";
import { PersonalityTags } from "./PersonalityTags";
import { RelatedPets } from "./RelatedPets";
import { ShelterContactCard } from "./ShelterContactCard";
import { isPetFavorite, togglePetFavorite } from "./neopetsFavorites";

const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;
const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;
const handFont = { fontFamily: "var(--font-np-handwritten), cursive" } as const;

type NeopetsPetDetailBodyProps = {
  pet: NeopetsPet;
};

export function NeopetsPetDetailBody({ pet }: NeopetsPetDetailBodyProps) {
  const [favorited, setFavorited] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    setFavorited(isPetFavorite(pet.id));
  }, [pet.id]);

  const handleFavorite = useCallback(() => {
    const next = togglePetFavorite(pet.id);
    setFavorited(next);
  }, [pet.id]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const shareData = {
      title: `Adopt ${pet.name} — Toronto Adopt-A-Pet`,
      text: `Meet ${pet.name}, a ${pet.breed} looking for a forever home!`,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareMessage("Link copied!");
      window.setTimeout(() => setShareMessage(null), 2500);
    } catch {
      /* user cancelled share */
    }
  }, [pet.breed, pet.name]);

  return (
    <main className="np-paper-texture-fine relative mx-auto max-w-[1200px] overflow-hidden px-4 py-10 pb-24 md:px-16 md:py-12">
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-[#40484e]" style={bodyFont}>
          <li>
            <Link href={NEOPETS_PATHS.explorer} className="np-focus-ring font-semibold text-[#0d658c] hover:underline">
              Explorer
            </Link>
          </li>
          <li aria-hidden className="text-[#c0c7cf]">
            /
          </li>
          <li className="font-semibold text-[#1f1b14]">{pet.name}</li>
        </ol>
      </nav>

      {/* Hero / profile */}
      <section className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <PetGallery pet={pet} />

        <div>
          <p className="mb-2 text-lg text-[#0d658c]" style={handFont}>
            looking for my forever family…
          </p>
          <h1 className="text-4xl font-bold leading-tight text-[#1f1b14] md:text-5xl" style={headlineFont}>
            Oh hi, I&apos;m {pet.name}
          </h1>
          <p className="mt-3 text-lg text-[#40484e]" style={bodyFont}>
            {pet.breed} · {pet.age} · {pet.location}
          </p>

          <div className="mt-8">
            <PetInfoGrid pet={pet} />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={NEOPETS_PATHS.profile}
              className={`np-focus-ring np-chunky-button inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] ${pet.btnClass}`}
            >
              <span className="material-symbols-outlined">volunteer_activism</span>
              Apply to Adopt
            </Link>
            <button
              type="button"
              onClick={handleFavorite}
              className={`np-focus-ring np-chunky-button inline-flex items-center justify-center gap-2 rounded-xl border-2 px-6 py-4 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                favorited
                  ? "border-[#ba1a1a] bg-[#ba1a1a]/10 text-[#ba1a1a]"
                  : "border-[#ebe1d5] bg-white text-[#40484e] hover:border-[#8fd3ff]"
              }`}
              aria-pressed={favorited}
            >
              <span className={`material-symbols-outlined ${favorited ? "np-icon-filled" : ""}`}>
                favorite
              </span>
              {favorited ? "Saved" : "Save to Favorites"}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="np-focus-ring np-chunky-button inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#0d658c] bg-white px-6 py-4 text-base font-bold text-[#0d658c] transition-all hover:bg-[#8fd3ff]/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">share</span>
              Share Profile
            </button>
          </div>
          {shareMessage ? (
            <p className="mt-3 text-sm font-semibold text-[#2e6b29]" role="status">
              {shareMessage}
            </p>
          ) : null}
        </div>
      </section>

      {/* Personality */}
      <section className="mt-16 space-y-10">
        <div className="rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6 shadow-[6px_6px_0px_0px_#ebe1d5] md:p-8">
          <h2 className="text-2xl font-bold text-[#0d658c] md:text-3xl" style={headlineFont}>
            About Me
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#40484e] md:text-lg" style={bodyFont}>
            {pet.about}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[24px] border-2 border-[#8fd3ff] bg-[#8fd3ff]/10 p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#005c80] md:text-2xl" style={headlineFont}>
              My Personality
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#40484e] md:text-base" style={bodyFont}>
              {pet.personality}
            </p>
            <div className="mt-6">
              <PersonalityTags tags={pet.personalityTags} />
            </div>
          </div>

          <div className="rounded-[24px] border-2 border-[#adf19e] bg-[#adf19e]/15 p-6 md:p-8">
            <h2 className="text-xl font-bold text-[#2e6b29] md:text-2xl" style={headlineFont}>
              My Perfect Home
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#40484e] md:text-base" style={bodyFont}>
              {pet.perfectHome}
            </p>
            <div className="mt-6 flex items-center gap-2 text-[#135212]">
              <span className="material-symbols-outlined text-[#2e6b29]">{pet.perk.icon}</span>
              <span className="text-sm font-semibold" style={bodyFont}>
                {pet.perk.text}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Adoption readiness */}
      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold text-[#1f1b14] md:text-3xl" style={headlineFont}>
          Ready to adopt {pet.name}?
        </h2>
        <AdoptionChecklist pet={pet} />
      </section>

      {/* Adoption quest */}
      <section className="mt-16">
        <AdoptionQuest />
      </section>

      {/* Contact */}
      <section className="mt-16">
        <ShelterContactCard pet={pet} />
      </section>

      {/* Related pets */}
      <RelatedPets pet={pet} />
    </main>
  );
}
