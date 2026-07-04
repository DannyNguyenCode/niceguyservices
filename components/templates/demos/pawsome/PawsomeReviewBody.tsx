"use client";

import { useState } from "react";
import Link from "next/link";
import { PS_IMAGES } from "./pawsomeImages";
import { PS_PATHS } from "./pawsomeConfig";
import { PsIcon, PsPageWrap } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

const PAW_COUNT = 5;

export function PawsomeReviewBody() {
  const [rating, setRating] = useState(4);

  return (
    <>
      <main className="pb-28 pt-8 md:pb-12 md:pt-12">
        <PsPageWrap className="max-w-xl">
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PS_IMAGES.reviewHero}
              alt=""
              className="mx-auto mb-6 h-32 w-32 rounded-full object-cover shadow-[var(--ps-shadow)]"
            />
            <h1 className="text-2xl font-bold text-[var(--ps-primary)] md:text-3xl" style={headline}>
              How was Luna&apos;s delivery?
            </h1>
            <p className="mt-2 text-sm text-[var(--ps-on-surface-variant)]">
              Tap the paws to rate — earn up to +50 Pawsome Points (fictional demo).
            </p>
          </div>

          <div className="mt-10 flex justify-center gap-3">
            {Array.from({ length: PAW_COUNT }, (_, i) => {
              const filled = i < rating;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="rounded-full p-2 transition-transform active:scale-90"
                  aria-label={`Rate ${i + 1} of ${PAW_COUNT}`}
                >
                  <PsIcon
                    name="pets"
                    filled={filled}
                    className={`text-4xl ${filled ? "text-[var(--ps-on-tertiary-container)]" : "text-[var(--ps-outline-variant)]"}`}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-10 space-y-3 rounded-xl bg-[var(--ps-surface-container-lowest)] p-5 shadow-[var(--ps-shadow)]">
            {[
              { icon: "local_shipping", label: "Delivery speed" },
              { icon: "inventory_2", label: "Packaging quality" },
              { icon: "favorite", label: "Luna loved it" },
            ].map((item) => (
              <label
                key={item.label}
                className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-[var(--ps-surface-container-low)]"
              >
                <span className="flex items-center gap-3 text-sm font-medium text-[var(--ps-primary)]">
                  <PsIcon name={item.icon} className="text-[var(--ps-secondary)]" />
                  {item.label}
                </span>
                <input type="checkbox" defaultChecked className="accent-[var(--ps-secondary)]" />
              </label>
            ))}
          </div>
        </PsPageWrap>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--ps-outline-variant)] bg-[var(--ps-surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:p-0">
        <PsPageWrap className="max-w-xl">
          <Link
            href={PS_PATHS.reviewWrite}
            className="block w-full rounded-xl bg-[var(--ps-primary)] py-4 text-center text-sm font-semibold text-[var(--ps-on-primary)]"
          >
            Continue · {rating} paw{rating !== 1 ? "s" : ""}
          </Link>
        </PsPageWrap>
      </div>
    </>
  );
}
