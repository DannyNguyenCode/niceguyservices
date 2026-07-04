"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { AdoptablePet } from "./pawsMatchRescueData";
import { PMR_SECTIONS, pmrSectionHref } from "./pawsMatchRescueConfig";
import { PmrButton, PmrIcon, PmrTag, pmrDisplay } from "./PawsMatchShared";

type PawsMatchPetModalProps = {
  pet: AdoptablePet | null;
  onClose: () => void;
};

export function PawsMatchPetModal({ pet, onClose }: PawsMatchPetModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!pet) return;
    previousFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [pet, onClose]);

  if (!pet) return null;

  const goodWithItems = [
    { label: "Kids", ok: pet.goodWith.kids },
    { label: "Dogs", ok: pet.goodWith.dogs },
    { label: "Cats", ok: pet.goodWith.cats },
  ];

  return (
    <div
      className="pmr-modal-backdrop fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pmr-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close profile dialog"
        onClick={onClose}
        tabIndex={-1}
      />

      <div className="pmr-story-card relative z-10 max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-[var(--pmr-card)] sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex justify-end bg-[var(--pmr-card)]/95 p-3 backdrop-blur-sm">
          <button
            ref={closeRef}
            type="button"
            className="pmr-focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pmr-line)] bg-[var(--pmr-bg)] text-[var(--pmr-brown)]"
            aria-label="Close profile"
            onClick={onClose}
          >
            <PmrIcon name="close" className="text-xl" />
          </button>
        </div>

        <div className="px-5 pb-8 sm:px-8">
          <div className="mb-6 flex justify-center">
            <div
              className="pmr-scrapbook-photo relative aspect-square w-full max-w-sm overflow-hidden rounded-lg"
              style={{ transform: "rotate(-1.5deg)" }}
            >
              <Image
                src={pet.image}
                alt={pet.imageAlt}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <p className="pmr-label mb-2 text-center text-[var(--pmr-terracotta)]">Their Profile</p>
          <h2
            id="pmr-modal-title"
            className="pmr-display mb-1 text-center text-3xl text-[var(--pmr-brown)]"
            style={pmrDisplay}
          >
            {pet.name}
          </h2>
          <p className="mb-5 text-center text-[var(--pmr-brown-muted)]">
            {pet.age} · {pet.breed}
          </p>

          <div className="mb-6 flex flex-wrap justify-center gap-2">
            {pet.personalityTags.map((tag) => (
              <PmrTag key={tag}>{tag}</PmrTag>
            ))}
          </div>

          <div className="mb-6 rounded-xl bg-[var(--pmr-bg)] p-5">
            <h3 className="pmr-display mb-3 text-lg text-[var(--pmr-brown)]" style={pmrDisplay}>
              Their Journey
            </h3>
            <p className="text-sm leading-relaxed text-[var(--pmr-brown-muted)]">{pet.story}</p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--pmr-line)] p-4">
              <h4 className="pmr-label mb-3 text-[var(--pmr-brown)]">Good With</h4>
              <ul className="space-y-2">
                {goodWithItems.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2 text-sm text-[var(--pmr-brown-muted)]"
                  >
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
              <h4 className="pmr-label mb-3 text-[var(--pmr-brown)]">Needs</h4>
              <ul className="space-y-2">
                {pet.needs.map((need) => (
                  <li
                    key={need}
                    className="flex items-start gap-2 text-sm text-[var(--pmr-brown-muted)]"
                  >
                    <PmrIcon name="arrow_forward" className="pmr-check-icon mt-0.5 text-base" />
                    {need}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between rounded-xl bg-[var(--pmr-sage-light)] px-5 py-4">
            <span className="text-sm font-medium text-[var(--pmr-brown-muted)]">Adoption Fee</span>
            <span className="text-xl font-bold text-[var(--pmr-brown)]">${pet.adoptionFee}</span>
          </div>

          <PmrButton href={pmrSectionHref(PMR_SECTIONS.contact)} className="w-full">
            Apply to Adopt {pet.name}
          </PmrButton>
        </div>
      </div>
    </div>
  );
}
