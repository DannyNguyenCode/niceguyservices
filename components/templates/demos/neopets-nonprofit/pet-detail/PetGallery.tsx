"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { NeopetsPet } from "../neopetsPets";

const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;

type PetGalleryProps = {
  pet: NeopetsPet;
};

export function PetGallery({ pet }: PetGalleryProps) {
  const [index, setIndex] = useState(0);
  const total = pet.gallery.length;

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? total - 1 : i - 1));
  }, [total]);

  const goNext = useCallback(() => {
    setIndex((i) => (i === total - 1 ? 0 : i + 1));
  }, [total]);

  return (
    <div className="relative">
      <div className="relative mx-auto max-w-md lg:max-w-none">
        {/* Stacked photo-card effect */}
        <div
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border-2 border-[#ebe1d5] bg-[#fcf2e6]"
          aria-hidden
        />
        <div
          className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl border-2 border-[#ebe1d5] bg-white"
          aria-hidden
        />

        <div className="np-scrapbook-border relative overflow-hidden rounded-2xl border-2 border-[#ebe1d5] bg-white p-3">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl sm:aspect-square">
            <Image
              src={pet.gallery[index]}
              alt={`${pet.name} — photo ${index + 1} of ${total}`}
              fill
              priority
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span
              className="rounded-full border-2 border-[#695300] bg-[#eec750] px-3 py-1 text-xs font-bold text-[#695300]"
              style={bodyFont}
            >
              {pet.badge}
            </span>
            {pet.galleryBadges[index] ? (
              <span
                className="rounded-full border-2 border-[#005c80] bg-[#8fd3ff] px-3 py-1 text-xs font-bold text-[#005c80]"
                style={bodyFont}
              >
                {pet.galleryBadges[index]}
              </span>
            ) : null}
          </div>

          <div
            className="absolute bottom-4 right-4 rounded-full border-2 border-[#c0c7cf] bg-white/95 px-3 py-1 text-xs font-bold text-[#40484e] shadow-sm"
            style={bodyFont}
          >
            {index + 1} / {total}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          className="np-focus-ring np-chunky-button flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#ebe1d5] bg-white text-[#0d658c] transition-transform hover:scale-105 active:scale-95"
          aria-label="Previous photo"
        >
          <span className="material-symbols-outlined text-xl">chevron_left</span>
        </button>
        <div className="flex gap-2">
          {pet.gallery.map((_, i) => (
            <button
              key={pet.gallery[i]}
              type="button"
              onClick={() => setIndex(i)}
              className={`np-focus-ring h-2.5 rounded-full transition-all ${
                i === index ? "w-8 bg-[#0d658c]" : "w-2.5 bg-[#c0c7cf] hover:bg-[#8fd3ff]"
              }`}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={goNext}
          className="np-focus-ring np-chunky-button flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#ebe1d5] bg-white text-[#0d658c] transition-transform hover:scale-105 active:scale-95"
          aria-label="Next photo"
        >
          <span className="material-symbols-outlined text-xl">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
