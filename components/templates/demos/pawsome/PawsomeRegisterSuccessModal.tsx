"use client";

import Link from "next/link";
import type { PetMarketAuthUserDTO } from "@/lib/templates/db/pet-market";
import { PS_PATHS } from "./pawsomeConfig";
import { PsIcon } from "./PawsomeShared";

const headline = { fontFamily: "var(--font-ps-headline)" } as const;

type PawsomeRegisterSuccessModalProps = {
  open: boolean;
  user: PetMarketAuthUserDTO;
  onClose: () => void;
};

export function PawsomeRegisterSuccessModal({
  open,
  user,
  onClose,
}: PawsomeRegisterSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[var(--ps-primary)]/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="relative w-full max-w-md rounded-xl bg-[var(--ps-surface-container-lowest)] p-8 text-center shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        <PsIcon name="celebration" className="text-5xl text-[var(--ps-secondary)]" />
        <h2 className="mt-4 text-2xl font-bold text-[var(--ps-primary)]" style={headline}>
          Welcome, {user.name}!
        </h2>
        <p className="mt-2 text-sm text-[var(--ps-on-surface-variant)]">
          {user.pet_name} is now part of Pawsome Rewards. Confirmation sent to{" "}
          <strong className="text-[var(--ps-primary)]">{user.email}</strong>.
        </p>
        <p className="mt-3 text-sm font-semibold text-[var(--ps-secondary)]">
          +50 Pawsome Points added instantly
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={PS_PATHS.rewards}
            onClick={onClose}
            className="flex-1 rounded-xl bg-[var(--ps-primary)] py-4 text-sm font-semibold text-[var(--ps-on-primary)]"
          >
            View rewards
          </Link>
          <Link
            href={PS_PATHS.shop}
            onClick={onClose}
            className="flex-1 rounded-xl border border-[var(--ps-outline-variant)] py-4 text-sm font-semibold text-[var(--ps-primary)]"
          >
            Start shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
