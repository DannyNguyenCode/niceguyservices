"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LoIcon } from "./LiquidOccasionsShared";
import { LO_PATHS } from "./liquidOccasionsConfig";

type LiquidOccasionsThankYouModalProps = {
  open: boolean;
  onClose: () => void;
};

export function LiquidOccasionsThankYouModal({
  open,
  onClose,
}: LiquidOccasionsThankYouModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="lo-modal-backdrop fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lo-thank-you-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close thank you dialog"
        onClick={onClose}
        tabIndex={-1}
      />

      <div className="lo-modal-panel relative z-10 w-full max-w-lg overflow-hidden rounded-t-[2rem] sm:rounded-[2rem]">
        <div className="relative bg-[var(--lo-primary)] px-8 pb-16 pt-10 text-center text-[var(--lo-on-primary)]">
          <button
            ref={closeRef}
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Close"
            onClick={onClose}
          >
            <LoIcon name="close" className="text-xl" />
          </button>

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--lo-secondary-container)] shadow-lg">
            <LoIcon name="celebration" className="text-4xl text-[var(--lo-on-secondary-container)]" />
          </div>

          <span className="lo-label mb-3 block tracking-widest text-[var(--lo-secondary-fixed)]">
            Journey Received
          </span>
          <h2 id="lo-thank-you-title" className="lo-headline-lg mb-3">
            Your journey has begun
          </h2>
          <p className="lo-body-md mx-auto max-w-sm opacity-90">
            An artisan will contact you shortly to shape your vision into something extraordinary.
          </p>
        </div>

        <div className="space-y-4 bg-[var(--lo-secondary-container)] px-8 py-8 text-center">
          <p className="lo-body-md text-[var(--lo-on-secondary-container)]">
            We&apos;ve captured your celebration details. Expect a personal follow-up within one
            business day.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
            <Link
              href={LO_PATHS.home}
              onClick={onClose}
              className="lo-label rounded-full bg-[var(--lo-primary)] px-8 py-3.5 text-[var(--lo-on-primary)] transition-transform hover:scale-105 active:scale-95"
            >
              Return Home
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="lo-label rounded-full border border-[var(--lo-on-secondary-container)] bg-[var(--lo-surface-container-lowest)] px-8 py-3.5 text-[var(--lo-on-secondary-container)] transition-colors hover:bg-[var(--lo-surface)]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
