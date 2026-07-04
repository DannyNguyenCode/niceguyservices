"use client";

import { useEffect, useState } from "react";
import { SpmIcon } from "./SaturdayPetMarketShared";

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type SaturdayPetMarketReservationTimerProps = {
  expiresAt: string;
  expired: boolean;
  onExpired?: () => void;
};

export function SaturdayPetMarketReservationTimer({
  expiresAt,
  expired,
  onExpired,
}: SaturdayPetMarketReservationTimerProps) {
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, new Date(expiresAt).getTime() - Date.now()),
  );

  useEffect(() => {
    if (expired) return;

    const tick = () => {
      const next = Math.max(0, new Date(expiresAt).getTime() - Date.now());
      setRemainingMs(next);
      if (next === 0) onExpired?.();
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, expired, onExpired]);

  const isExpired = expired || remainingMs <= 0;

  return (
    <div
      className={`rounded-xl border-2 px-4 py-3 ${
        isExpired
          ? "border-[var(--spm-error)] bg-[var(--spm-error-container)]"
          : "border-[var(--spm-primary)] bg-[var(--spm-primary-fixed)]/40"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SpmIcon
            name={isExpired ? "schedule" : "timer"}
            className={isExpired ? "text-[var(--spm-error)]" : "text-[var(--spm-primary)]"}
          />
          <div>
            <p className="spm-label-sm font-bold uppercase tracking-wide text-[var(--spm-secondary)]">
              {isExpired ? "Hold Expired" : "We’re holding these goodies for you"}
            </p>
            <p className="spm-body-md text-[var(--spm-on-surface-variant)]">
              {isExpired
                ? "Looks like your hold expired. Let’s check what’s still available."
                : "Your cart is reserved for 15 minutes."}
            </p>
          </div>
        </div>
        {!isExpired ? (
          <div className="text-right">
            <p className="spm-label-sm text-[var(--spm-on-surface-variant)]">Items reserved for</p>
            <p className="spm-headline-md tabular-nums text-[var(--spm-primary)]">
              {formatCountdown(remainingMs)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
