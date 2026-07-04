"use client";

import Link from "next/link";
import type { LooneyTunesAuthUserDTO } from "@/lib/templates/db/looney-tunes";
import { LT_PATHS } from "./looneytoonsCafeConfig";

type LooneyToonsCafeRegisterSuccessModalProps = {
  open: boolean;
  user: LooneyTunesAuthUserDTO;
  onClose: () => void;
};

export function LooneyToonsCafeRegisterSuccessModal({
  open,
  user,
  onClose,
}: LooneyToonsCafeRegisterSuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md overflow-hidden border-4 border-[#151c28] bg-[#f9f9ff] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lt-register-success-title"
      >
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#151c28] bg-[#e9edff]">
            <span className="material-symbols-outlined text-4xl text-[#495E84]" aria-hidden>
              celebration
            </span>
          </div>
          <h2
            id="lt-register-success-title"
            className="mb-2 font-extrabold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl"
          >
            Welcome, {user.name}!
          </h2>
          <p className="mb-2 text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
            You&apos;re in the Comet Streak club. Your go-to: <strong>{user.favorite_drink}</strong>.
          </p>
          <p className="mb-8 text-sm text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
            Guest checkout still works anytime — sign in to track stars and rewards.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={LT_PATHS.menu}
              onClick={onClose}
              className="flex-1 rounded-full border-2 border-[#151c28] bg-[#495E84] py-4 text-sm font-bold text-white [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              Order now
            </Link>
            <Link
              href={LT_PATHS.account}
              onClick={onClose}
              className="flex-1 rounded-full border-2 border-[#151c28] py-4 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]"
            >
              My account
            </Link>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 text-xs text-[#444748] underline [font-family:var(--font-lt-space),system-ui,sans-serif]"
          >
            Stay on this page
          </button>
        </div>
      </div>
    </div>
  );
}
