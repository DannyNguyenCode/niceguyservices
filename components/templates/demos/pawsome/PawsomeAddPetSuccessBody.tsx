"use client";

import Link from "next/link";
import { PS_IMAGES } from "./pawsomeImages";
import { PS_PATHS } from "./pawsomeConfig";
import { PsIcon, PsPageWrap, PsPrimaryButton } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

export function PawsomeAddPetSuccessBody() {
  return (
    <main className="relative min-h-[80vh] pb-12 pt-24">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[color-mix(in_srgb,var(--ps-primary)_40%,transparent)] backdrop-blur-sm" />
      <div className="relative z-10">
        <PsPageWrap className="max-w-md text-center">
          <div className="mx-auto -mt-4 mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--ps-surface)] shadow-[var(--ps-shadow-lg)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PS_IMAGES.maxDog} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="rounded-2xl bg-[var(--ps-surface-container-lowest)] p-8 shadow-[var(--ps-shadow-lg)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ps-secondary)] text-[var(--ps-on-secondary)]">
              <PsIcon name="celebration" filled className="text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
              Welcome, Oliver!
            </h1>
            <p className="mt-2 text-sm text-[var(--ps-on-surface-variant)]">
              Profile complete. +100 Pawsome Points added — fictional demo success.
            </p>
            <ul className="mt-6 space-y-2 text-left text-sm text-[var(--ps-on-surface-variant)]">
              <li className="flex items-center gap-2">
                <PsIcon name="check_circle" filled className="text-[var(--ps-secondary)]" />
                Personalized shop recommendations
              </li>
              <li className="flex items-center gap-2">
                <PsIcon name="check_circle" filled className="text-[var(--ps-secondary)]" />
                Wellness reminders enabled
              </li>
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <PsPrimaryButton href={PS_PATHS.shop}>Shop for Oliver</PsPrimaryButton>
              <Link
                href={PS_PATHS.account}
                className="text-sm font-semibold text-[var(--ps-secondary)] hover:underline"
              >
                Back to account
              </Link>
            </div>
          </div>
        </PsPageWrap>
      </div>
    </main>
  );
}
