"use client";

import Link from "next/link";
import type { PetMarketAuthUserDTO } from "@/lib/templates/db/pet-market";
import { CP_PATHS } from "./companionPetConfig";

type CompanionPetRegisterSuccessModalProps = {
  open: boolean;
  user: PetMarketAuthUserDTO;
  onClose: () => void;
};

export function CompanionPetRegisterSuccessModal({
  open,
  user,
  onClose,
}: CompanionPetRegisterSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <div
        className="cp-card relative w-full max-w-md rounded-2xl p-8 text-center"
        role="dialog"
        aria-modal="true"
      >
        <span className="material-symbols-outlined text-5xl text-[var(--cp-green)]" aria-hidden>
          celebration
        </span>
        <h2 className="mt-4 text-2xl font-semibold">Welcome, {user.name}!</h2>
        <p className="mt-2 text-sm text-[var(--cp-slate)]">
          {user.pet_name} is enrolled in Companion Rewards. We sent a welcome note to{" "}
          <strong className="text-[var(--cp-charcoal)]">{user.email}</strong>.
        </p>
        <p className="mt-3 text-sm text-[var(--cp-orange)]">+50 bonus points added to your balance</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href={CP_PATHS.rewards}
            onClick={onClose}
            className="flex-1 rounded-2xl bg-[var(--cp-charcoal)] py-3 text-sm font-semibold text-white"
          >
            View rewards
          </Link>
          <Link
            href={CP_PATHS.shop}
            onClick={onClose}
            className="flex-1 rounded-2xl border border-[var(--cp-border)] py-3 text-sm font-semibold"
          >
            Start shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
