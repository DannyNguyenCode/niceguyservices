"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SpmContainer, SpmIcon } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketDatabaseErrorBody() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-[70vh] flex-col items-center overflow-hidden px-[var(--spm-margin)] pb-[var(--spm-xl)] pt-[2em]">
      <div className="spm-candy-stripes absolute left-0 top-0 -z-10 h-32 w-full" aria-hidden />
      <div className="spm-candy-stripes absolute bottom-0 left-0 -z-10 h-32 w-full rotate-180" aria-hidden />

      <SpmContainer className="flex w-full max-w-2xl flex-col items-center text-center">
        <div className="spm-label-sm mb-[var(--spm-base)] inline-block rounded-full bg-[var(--spm-error-container)] px-[var(--spm-md)] py-1 text-[var(--spm-on-error-container)]">
          DATABASE UNAVAILABLE
        </div>
        <div className="mb-[var(--spm-md)] flex h-24 w-24 items-center justify-center rounded-full border-4 border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-lowest)] shadow-md">
          <SpmIcon name="cloud_off" className="text-5xl text-[var(--spm-primary)]" />
        </div>
        <h1 className="spm-headline-xl mb-[var(--spm-md)] leading-tight text-[var(--spm-primary)]">
          Our shelves are taking a short nap.
        </h1>
        <p className="spm-body-lg mb-[var(--spm-lg)] max-w-md text-[var(--spm-on-surface-variant)]">
          We couldn&apos;t connect to the Pet Market database just now. Your browser is fine — the store ledger
          is temporarily unreachable. Please try again in a moment.
        </p>
        <div className="flex w-full max-w-lg flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6">
          <button
            type="button"
            onClick={() => router.refresh()}
            className="spm-coupon-button spm-headline-md rounded-lg bg-[var(--spm-primary)] px-[var(--spm-lg)] py-4 text-center text-[var(--spm-on-primary)] shadow-[4px_4px_0px_#003636] transition-all hover:bg-[var(--spm-primary-container)] sm:min-w-[12rem]"
          >
            Try Again
          </button>
          <Link
            href={SPM_PATHS.contact}
            className="spm-coupon-button spm-headline-md rounded-lg bg-[var(--spm-tertiary)] px-[var(--spm-lg)] py-4 text-center text-[var(--spm-on-tertiary)] shadow-[4px_4px_0px_#5e0b34] transition-all hover:bg-[var(--spm-tertiary-container)] sm:min-w-[12rem]"
          >
            Contact Support
          </Link>
        </div>
        <p className="spm-body-md mt-8 text-[var(--spm-on-surface-variant)] opacity-80">
          Empty search results still mean the connection worked — this page only appears when the database itself
          cannot be reached.
        </p>
      </SpmContainer>
    </main>
  );
}
