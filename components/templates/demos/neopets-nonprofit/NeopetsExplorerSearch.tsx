"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { NEOPETS_CAT_BREEDS, NEOPETS_DOG_BREEDS } from "./neopetsExplorerBreeds";

/** Person and dog together on a bright outdoor path — warm, hopeful “we found each other” energy for the adoption demo. */
const SEARCH_HERO_IMAGE =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1400&q=85";

type PetKind = "dog" | "cat";

export function NeopetsExplorerSearch() {
  const [petKind, setPetKind] = useState<PetKind>("dog");
  const [breed, setBreed] = useState("");
  const [postal, setPostal] = useState("");

  const breedOptions = useMemo(
    () => (petKind === "dog" ? NEOPETS_DOG_BREEDS : NEOPETS_CAT_BREEDS),
    [petKind],
  );

  const switchKind = useCallback((next: PetKind) => {
    setPetKind(next);
    setBreed("");
  }, []);

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    document.getElementById("featured-pets")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section className="mx-auto mb-12 max-w-5xl rounded-[32px] border border-[#ebe1d5] bg-[#fcf2e6] p-6 shadow-sm sm:p-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-[24px] border border-[#ebe1d5] shadow-md ring-1 ring-black/5 lg:aspect-auto lg:min-h-[380px]">
          <Image
            src={SEARCH_HERO_IMAGE}
            alt="A person walking with a happy dog on a sunlit path—capturing the moment someone and a pet find each other after a search"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 560px"
            priority
          />
        </div>

        <div className="space-y-8">
          <div>
            <h2
              className="text-balance text-4xl font-bold leading-tight tracking-tight text-[#1f1b14] sm:text-5xl sm:leading-[1.1]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              Find the Wag That Fits Your Walk
            </h2>
            <p className="mt-3 text-lg leading-7 text-[#40484e]">
              Search adoptable pets across the city—filters, fuzzy ears, zero side-eye.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-3">
              <span className="block text-sm font-semibold tracking-wide text-[#40484e]" id="explorer-pet-type-label">
                Pet type
              </span>
              <div className="flex flex-wrap gap-3" role="group" aria-labelledby="explorer-pet-type-label">
                <button
                  type="button"
                  onClick={() => switchKind("dog")}
                  className={
                    petKind === "dog"
                      ? "rounded-lg border-2 border-[#0d658c] bg-[#0d658c] px-6 py-2 text-sm font-semibold text-white"
                      : "rounded-lg border-2 border-[#c0c7cf] bg-[#fff8f2] px-6 py-2 text-sm font-semibold text-[#1f1b14] transition-colors hover:border-[#0d658c]"
                  }
                >
                  Dog
                </button>
                <button
                  type="button"
                  onClick={() => switchKind("cat")}
                  className={
                    petKind === "cat"
                      ? "rounded-lg border-2 border-[#0d658c] bg-[#0d658c] px-6 py-2 text-sm font-semibold text-white"
                      : "rounded-lg border-2 border-[#c0c7cf] bg-[#fff8f2] px-6 py-2 text-sm font-semibold text-[#1f1b14] transition-colors hover:border-[#0d658c]"
                  }
                >
                  Cat
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="explorer-breed" className="block text-sm font-semibold tracking-wide text-[#40484e]">
                Breed
              </label>
              <div className="relative">
                <select
                  id="explorer-breed"
                  value={breed}
                  onChange={(ev) => setBreed(ev.target.value)}
                  className="w-full appearance-none rounded-xl border-2 border-[#c0c7cf] bg-[#fff8f2] px-4 py-3 pr-11 text-base text-[#1f1b14] outline-none focus:border-[#0d658c] focus:ring-0"
                >
                  <option value="">Select from the list…</option>
                  {breedOptions.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#40484e]">
                  <span className="material-symbols-outlined">expand_more</span>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="explorer-postal" className="block text-sm font-semibold tracking-wide text-[#40484e]">
                Postal code
              </label>
              <input
                id="explorer-postal"
                type="text"
                autoComplete="postal-code"
                placeholder="e.g. M5V 2T6"
                value={postal}
                onChange={(ev) => setPostal(ev.target.value)}
                className="w-full rounded-xl border-2 border-[#c0c7cf] bg-[#fff8f2] px-4 py-3 text-base text-[#1f1b14] outline-none focus:border-[#0d658c] focus:ring-0"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-[#C34A2C] px-8 py-4 text-xl font-semibold text-white shadow-lg transition-transform hover:scale-105"
                style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
              >
                <span>Start your search</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
