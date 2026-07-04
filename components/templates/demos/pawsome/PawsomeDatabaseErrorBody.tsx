"use client";

import { useRouter } from "next/navigation";
import { PS_PATHS } from "./pawsomeConfig";
import { PsIcon } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

export function PawsomeDatabaseErrorBody() {
  const router = useRouter();

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-[var(--ps-margin-mobile)] py-20 text-center md:px-[var(--ps-margin-desktop)]">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ps-surface-container-high)]">
        <PsIcon name="cloud_off" className="text-4xl text-[var(--ps-on-surface-variant)]" />
      </div>
      <p className="rounded-full bg-[var(--ps-error-container)] px-4 py-1 text-xs font-semibold text-[var(--ps-on-error-container)]">
        Database unavailable
      </p>
      <h1 className="mt-4 text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
        Our catalog is taking a short break
      </h1>
      <p className="mt-3 max-w-md text-sm text-[var(--ps-on-surface-variant)]">
        We couldn&apos;t connect to the product database right now. Please try again in a moment.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => router.refresh()}
          className="rounded-xl bg-[var(--ps-primary)] px-8 py-3 text-sm font-semibold text-[var(--ps-on-primary)]"
        >
          Try again
        </button>
        <a
          href={PS_PATHS.home}
          className="rounded-xl border border-[var(--ps-outline-variant)] px-8 py-3 text-sm font-semibold text-[var(--ps-primary)]"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
