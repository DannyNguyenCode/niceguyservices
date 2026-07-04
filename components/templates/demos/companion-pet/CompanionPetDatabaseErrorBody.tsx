"use client";

import { useRouter } from "next/navigation";
import { CP_PATHS } from "./companionPetConfig";

export function CompanionPetDatabaseErrorBody() {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center md:px-8">
      <span className="material-symbols-outlined text-5xl text-[var(--cp-slate)]" aria-hidden>
        cloud_off
      </span>
      <p className="mt-4 rounded-full bg-[var(--cp-orange-muted)] px-4 py-1 text-xs font-semibold text-[var(--cp-orange)]">
        Database unavailable
      </p>
      <h1 className="mt-4 text-2xl font-semibold text-[var(--cp-charcoal)]">
        Our shop is taking a short break
      </h1>
      <p className="mt-3 text-sm text-[var(--cp-slate)]">
        We couldn&apos;t connect to the product catalog right now. Your browser is fine — the store
        database is temporarily unreachable.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => router.refresh()}
          className="rounded-2xl bg-[var(--cp-charcoal)] px-8 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
        <a
          href={CP_PATHS.home}
          className="rounded-2xl border border-[var(--cp-border)] px-8 py-3 text-sm font-semibold text-[var(--cp-charcoal)]"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
