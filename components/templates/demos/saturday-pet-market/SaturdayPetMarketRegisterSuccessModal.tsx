"use client";

import Link from "next/link";
import type { PetMarketAuthUserDTO } from "@/lib/templates/db/pet-market";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SpmIcon } from "./SaturdayPetMarketShared";

type SaturdayPetMarketRegisterSuccessModalProps = {
  open: boolean;
  user: PetMarketAuthUserDTO;
  onClose: () => void;
};

export function SaturdayPetMarketRegisterSuccessModal({
  open,
  user,
  onClose,
}: SaturdayPetMarketRegisterSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-xl border-4 border-[var(--spm-secondary)] bg-[var(--spm-surface-container-lowest)] p-8 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="spm-register-success-title"
      >
        <div className="spm-checkered-pattern pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--spm-tertiary-container)]">
            <SpmIcon name="celebration" className="text-4xl text-[var(--spm-tertiary)]" />
          </div>
          <h2 id="spm-register-success-title" className="spm-headline-lg mb-2 text-[var(--spm-on-surface)]">
            Welcome to the pack, {user.name}!
          </h2>
          <p className="spm-body-md mb-2 text-[var(--spm-on-surface-variant)]">
            {user.pet_name} is officially in the Saturday Morning Rewards Club.
          </p>
          <p className="spm-body-md mb-8 text-[var(--spm-on-surface-variant)]">
            We sent a welcome note to <strong>{user.email}</strong>. You&apos;re all set to shop neighborhood
            favorites.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={SPM_PATHS.shop}
              onClick={onClose}
              className="spm-coupon-border flex-1 rounded-lg bg-[var(--spm-primary)] py-4 font-headline-md text-white shadow-[3px_3px_0px_0px_#003636] transition-colors hover:bg-[var(--spm-primary-container)]"
            >
              Go to Shop
            </Link>
            <Link
              href={SPM_PATHS.account}
              onClick={onClose}
              className="spm-coupon-border flex-1 rounded-lg border-2 border-[var(--spm-outline)] bg-white py-4 font-headline-md text-[var(--spm-on-surface)] transition-colors hover:bg-[var(--spm-surface-container-low)]"
            >
              Go to Account
            </Link>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="spm-label-sm mt-6 text-[var(--spm-on-surface-variant)] underline decoration-dotted underline-offset-4"
          >
            Stay on this page
          </button>
        </div>
      </div>
    </div>
  );
}
