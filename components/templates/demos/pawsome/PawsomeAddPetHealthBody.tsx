"use client";

import { useState } from "react";
import Link from "next/link";
import { PS_PATHS } from "./pawsomeConfig";
import { PsIcon, PsPageWrap, PsProgressBar } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const ACTIVITY_LEVELS = ["Low", "Moderate", "High"] as const;
const DIET_OPTIONS = ["Dry kibble", "Wet food", "Raw / fresh", "Mixed"];

export function PawsomeAddPetHealthBody() {
  const [activity, setActivity] = useState<(typeof ACTIVITY_LEVELS)[number]>("Moderate");
  const [diet, setDiet] = useState(DIET_OPTIONS[0]);

  return (
    <main className="pb-32 pt-20 md:pb-12 md:pt-24">
      <PsPageWrap className="max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
          Step 2 of 3
        </p>
        <PsProgressBar value={66} className="mt-4" height="h-1.5" />
        <h1 className="mt-6 text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
          Health profile
        </h1>
        <p className="mt-2 text-sm text-[var(--ps-on-surface-variant)]">
          Complete Oliver&apos;s profile to earn +100 Pawsome Points (fictional demo).
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <p className="text-sm font-semibold text-[var(--ps-primary)]">Activity level</p>
            <div className="mt-3 flex gap-2">
              {ACTIVITY_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setActivity(level)}
                  className={`flex-1 rounded-xl py-3 text-xs font-semibold ${
                    activity === level
                      ? "bg-[var(--ps-secondary)] text-[var(--ps-on-secondary)]"
                      : "bg-[var(--ps-surface-container-high)] text-[var(--ps-on-surface-variant)]"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="weight" className="text-sm font-semibold text-[var(--ps-primary)]">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              placeholder="12"
              className="mt-2 w-full rounded-xl border border-[var(--ps-outline-variant)] px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label htmlFor="diet" className="text-sm font-semibold text-[var(--ps-primary)]">
              Current diet
            </label>
            <select
              id="diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[var(--ps-outline-variant)] bg-[var(--ps-surface-container-lowest)] px-4 py-3 text-sm"
            >
              {DIET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-start gap-3 rounded-xl bg-[color-mix(in_srgb,var(--ps-secondary-container)_12%,transparent)] p-4">
            <PsIcon name="verified" className="shrink-0 text-[var(--ps-secondary)]" />
            <span className="text-xs text-[var(--ps-on-secondary-container)]">
              Vet-approved recommendations unlock after profile completion — demo placeholder.
            </span>
          </label>
        </div>
      </PsPageWrap>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--ps-outline-variant)] bg-[var(--ps-surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <PsPageWrap className="max-w-lg flex gap-3">
          <Link
            href={PS_PATHS.accountAddPet}
            className="flex-1 rounded-xl border border-[var(--ps-outline-variant)] py-4 text-center text-sm font-semibold text-[var(--ps-primary)]"
          >
            Back
          </Link>
          <Link
            href={PS_PATHS.accountAddPetSuccess}
            className="flex-[2] rounded-xl bg-[var(--ps-primary)] py-4 text-center text-sm font-semibold text-[var(--ps-on-primary)]"
          >
            Finish profile
          </Link>
        </PsPageWrap>
      </div>
    </main>
  );
}
