"use client";

import Link from "next/link";
import { useState } from "react";
import { CHECKLIST_SECTIONS } from "./neopetsAdoptionData";
import { NEOPETS_PATHS } from "./neopetsConfig";

const headlineFont = { fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" } as const;
const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;
const handFont = { fontFamily: "var(--font-np-handwritten), cursive" } as const;

type ChecklistKey = keyof typeof CHECKLIST_SECTIONS;

const SECTION_KEYS = Object.keys(CHECKLIST_SECTIONS) as ChecklistKey[];

export function NeopetsChecklistHubBody() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = SECTION_KEYS.reduce(
    (sum, k) => sum + CHECKLIST_SECTIONS[k].items.length,
    0,
  );
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <main className="np-scrapbook-bg min-h-screen pb-24">
      <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-16">
        <div className="relative mb-12 text-center">
          <span className="mb-2 block -rotate-1 text-4xl text-[#745b00]" style={handFont}>
            Your Preparation Quest
          </span>
          <h1
            className="mb-4 text-4xl font-bold text-[#0d658c] md:text-5xl"
            style={headlineFont}
          >
            Adoption Checklist Hub
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#40484e]">
            Everything you need before, during, and after adoption — check items off as you prepare
            for your forever friend.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <div className="mb-2 flex justify-between text-sm font-semibold text-[#2e6b29]" style={bodyFont}>
              <span>Checklist progress</span>
              <span>
                {checkedCount} / {totalItems}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#ebe1d5]">
              <div
                className="h-full rounded-full bg-[#2e6b29] transition-all duration-300"
                style={{ width: `${totalItems ? (checkedCount / totalItems) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {SECTION_KEYS.map((key, sectionIndex) => {
            const section = CHECKLIST_SECTIONS[key];
            const rotations = ["-rotate-1", "rotate-1", "-rotate-0.5", "rotate-0.5", "rotate-0"];
            const rotation = rotations[sectionIndex % rotations.length];

            return (
              <section
                key={key}
                className={`np-mission-card rounded-[24px] border-2 border-[#ebe1d5] bg-white p-6 shadow-lg ${rotation}`}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d658c] text-white">
                    <span className="material-symbols-outlined text-2xl">{section.icon}</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#1f1b14]" style={headlineFont}>
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item) => {
                    const itemKey = `${key}-${item}`;
                    const isChecked = checked[itemKey];
                    return (
                      <li key={itemKey}>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#ebe1d5] bg-[#fcf2e6]/50 px-4 py-3 transition-colors hover:bg-[#adf19e]/20">
                          <input
                            type="checkbox"
                            checked={isChecked ?? false}
                            onChange={() => toggle(itemKey)}
                            className="h-5 w-5 rounded border-[#c0c7cf] accent-[#2e6b29]"
                          />
                          <span
                            className={`text-base ${isChecked ? "text-[#70787f] line-through" : "text-[#1f1b14]"}`}
                          >
                            {item}
                          </span>
                          {isChecked ? (
                            <span className="material-symbols-outlined ml-auto text-[#2e6b29]">check_circle</span>
                          ) : null}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-16 rounded-[28px] border-2 border-[#0d658c] bg-[#0d658c]/5 p-8 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#0d658c]" style={headlineFont}>
            Ready to start your adoption journey?
          </h2>
          <p className="mb-6 text-[#40484e]">
            Follow our guided adventure map from exploring pets to welcome-home support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={NEOPETS_PATHS.adoptionProcess}
              className="np-chunky-button inline-flex items-center gap-2 rounded-2xl bg-[#0d658c] px-8 py-4 font-bold text-white shadow-[0_4px_0_0_#004c6b] active:translate-y-1 active:shadow-none"
            >
              <span className="material-symbols-outlined">map</span>
              View Adoption Journey
            </Link>
            <Link
              href={NEOPETS_PATHS.explorer}
              className="np-chunky-button inline-flex items-center gap-2 rounded-2xl bg-[#2e6b29] px-8 py-4 font-bold text-white shadow-[0_4px_0_0_#135212] active:translate-y-1 active:shadow-none"
            >
              Meet Adoptable Pets
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
