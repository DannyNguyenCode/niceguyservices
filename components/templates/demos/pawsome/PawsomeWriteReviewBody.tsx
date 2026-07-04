"use client";

import { useState } from "react";
import Link from "next/link";
import { PS_PATHS } from "./pawsomeConfig";
import { PsIcon, PsPageWrap } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

export function PawsomeWriteReviewBody() {
  const [text, setText] = useState("");

  return (
    <main className="pb-32 pt-20 md:pb-12 md:pt-24">
      <PsPageWrap className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ps-secondary)]">
          Step 2 of 2
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
          Share your experience
        </h1>
        <p className="mt-1 text-sm text-[var(--ps-on-surface-variant)]">
          Help other pet parents discover Luna&apos;s favorites — placeholder copy only.
        </p>

        <div className="mt-8">
          <label htmlFor="review-text" className="text-sm font-semibold text-[var(--ps-primary)]">
            Your review
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Tell us what Luna thought of the Artisan Salmon..."
            className="mt-2 w-full resize-none rounded-xl border border-[var(--ps-outline-variant)] bg-[var(--ps-surface-container-lowest)] px-4 py-3 text-sm"
          />
          <p className="mt-1 text-right text-xs text-[var(--ps-on-surface-variant)]">
            {text.length}/500
          </p>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-[var(--ps-primary)]">Add photos (optional)</p>
          <button
            type="button"
            className="mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--ps-outline-variant)] py-10 text-[var(--ps-on-surface-variant)]"
          >
            <PsIcon name="add_a_photo" className="text-3xl" />
            <span className="text-xs font-semibold">Upload a pawsome moment</span>
          </button>
        </div>

        <label className="mt-6 flex items-start gap-3">
          <input type="checkbox" defaultChecked className="mt-1 accent-[var(--ps-secondary)]" />
          <span className="text-xs text-[var(--ps-on-surface-variant)]">
            Post anonymously to the community gallery (fictional demo).
          </span>
        </label>
      </PsPageWrap>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--ps-outline-variant)] bg-[var(--ps-surface)] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <PsPageWrap className="max-w-xl">
          <Link
            href={PS_PATHS.reviewSuccess}
            className="block w-full rounded-xl bg-[var(--ps-secondary)] py-4 text-center text-sm font-semibold text-[var(--ps-on-secondary)]"
          >
            Submit review · +50 pts
          </Link>
        </PsPageWrap>
      </div>
    </main>
  );
}
