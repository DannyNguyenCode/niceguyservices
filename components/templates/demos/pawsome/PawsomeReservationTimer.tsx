"use client";

import { useEffect, useState } from "react";
import { PsIcon } from "./PawsomeShared";

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type PawsomeReservationTimerProps = {
  expiresAt: string;
  expired: boolean;
  onExpired?: () => void;
};

export function PawsomeReservationTimer({
  expiresAt,
  expired,
  onExpired,
}: PawsomeReservationTimerProps) {
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
      className={`rounded-xl border px-4 py-3 ${
        isExpired
          ? "border-[var(--ps-error)] bg-[var(--ps-error-container)]"
          : "border-[var(--ps-secondary)] bg-[color-mix(in_srgb,var(--ps-secondary-container)_15%,transparent)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <PsIcon
            name={isExpired ? "schedule" : "timer"}
            className={isExpired ? "text-[var(--ps-error)]" : "text-[var(--ps-secondary)]"}
          />
          <div>
            <p className="text-sm font-semibold text-[var(--ps-primary)]">
              {isExpired ? "Hold expired" : "Items reserved for checkout"}
            </p>
            <p className="text-xs text-[var(--ps-on-surface-variant)]">
              {isExpired
                ? "Your reservation expired. Return to your cart to check availability."
                : "Your cart is held for 15 minutes while you complete checkout."}
            </p>
          </div>
        </div>
        {!isExpired ? (
          <div className="text-right">
            <p className="text-xs text-[var(--ps-on-surface-variant)]">Time remaining</p>
            <p className="text-lg font-bold tabular-nums text-[var(--ps-secondary)]">
              {formatCountdown(remainingMs)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
