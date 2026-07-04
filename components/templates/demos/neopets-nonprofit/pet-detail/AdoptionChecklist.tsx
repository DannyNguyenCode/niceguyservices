"use client";

import { useState } from "react";
import type { NeopetsPet } from "../neopetsPets";

const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;
const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;

const CHECKLIST_ITEMS = [
  "I can provide a safe home",
  "I understand the adoption fee",
  "I can schedule a meet and greet",
  "I have reviewed the pet's needs",
] as const;

type AdoptionChecklistProps = {
  pet: NeopetsPet;
};

export function AdoptionChecklist({ pet }: AdoptionChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6 shadow-[6px_6px_0px_0px_#ebe1d5]">
        <h3 className="mb-4 text-xl font-bold text-[#1f1b14]" style={headlineFont}>
          Adoption readiness
        </h3>
        <ul className="space-y-3">
          {CHECKLIST_ITEMS.map((item, i) => {
            const isChecked = checked.has(i);
            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`np-focus-ring flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                    isChecked
                      ? "border-[#2e6b29] bg-[#adf19e]/25"
                      : "border-[#ebe1d5] bg-[#fff8f2] hover:border-[#8fd3ff]"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                      isChecked
                        ? "border-[#2e6b29] bg-[#2e6b29] text-white"
                        : "border-[#c0c7cf] bg-white"
                    }`}
                  >
                    {isChecked ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : null}
                  </span>
                  <span className="text-sm font-semibold text-[#40484e]" style={bodyFont}>
                    {item}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-[24px] border-2 border-[#0d658c] bg-[#0d658c]/5 p-6 shadow-[6px_6px_0px_0px_#8fd3ff]">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#0d658c]" style={bodyFont}>
          Adoption fee
        </p>
        <p className="mt-2 text-4xl font-bold text-[#1f1b14]" style={headlineFont}>
          ${pet.adoptionFee}
        </p>
        <p className="mt-2 text-sm text-[#40484e]" style={bodyFont}>
          One-time fee helps cover care while {pet.name} waited for a forever home.
        </p>
        <div className="mt-6 rounded-2xl border-2 border-dashed border-[#0d658c]/30 bg-white p-4">
          <p className="mb-3 text-sm font-bold text-[#1f1b14]" style={bodyFont}>
            What&apos;s included
          </p>
          <ul className="space-y-2">
            {pet.includedCare.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#40484e]" style={bodyFont}>
                <span className="material-symbols-outlined mt-0.5 text-lg text-[#2e6b29]">check_circle</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
