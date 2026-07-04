"use client";

import { useState } from "react";
import Link from "next/link";
import { PS_PATHS } from "./pawsomeConfig";
import { PsIcon, PsPageWrap, PsProgressBar } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const PET_TYPES = [
  { id: "dog", label: "Dog", icon: "pets" },
  { id: "cat", label: "Cat", icon: "pets" },
  { id: "other", label: "Other", icon: "cruelty_free" },
] as const;

export function PawsomeAddPetBody() {
  const [selected, setSelected] = useState<string | null>("dog");

  return (
    <main className="pb-32 pt-20 md:pb-12 md:pt-24">
      <PsPageWrap className="max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
          Step 1 of 3
        </p>
        <PsProgressBar value={33} className="mt-4" height="h-1.5" />
        <h1 className="mt-6 text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
          Who are we welcoming?
        </h1>
        <p className="mt-2 text-sm text-[var(--ps-on-surface-variant)]">
          Choose a pet type to personalize nutrition and rewards — fictional demo.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {PET_TYPES.map((type) => {
            const active = selected === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelected(type.id)}
                className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                  active
                    ? "border-[var(--ps-secondary)] bg-[color-mix(in_srgb,var(--ps-secondary-container)_15%,transparent)]"
                    : "border-[var(--ps-outline-variant)] bg-[var(--ps-surface-container-lowest)]"
                }`}
              >
                <PsIcon
                  name={type.icon}
                  filled={active}
                  className={`text-4xl ${active ? "text-[var(--ps-secondary)]" : "text-[var(--ps-on-surface-variant)]"}`}
                />
                <span className="text-sm font-semibold text-[var(--ps-primary)]">{type.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <label htmlFor="pet-name" className="text-sm font-semibold text-[var(--ps-primary)]">
            Pet name
          </label>
          <input
            id="pet-name"
            type="text"
            placeholder="e.g. Oliver"
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
          />
        </div>
      </PsPageWrap>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--ps-outline-variant)] bg-[var(--ps-surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <PsPageWrap className="max-w-lg">
          <Link
            href={PS_PATHS.accountAddPetHealth}
            className={`block w-full rounded-xl py-4 text-center text-sm font-semibold ${
              selected
                ? "bg-[var(--ps-primary)] text-[var(--ps-on-primary)]"
                : "pointer-events-none bg-[var(--ps-surface-container-high)] text-[var(--ps-on-surface-variant)]"
            }`}
          >
            Continue to health profile
          </Link>
        </PsPageWrap>
      </div>
    </main>
  );
}
