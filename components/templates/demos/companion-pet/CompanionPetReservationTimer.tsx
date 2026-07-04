"use client";

import { useEffect, useState } from "react";

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type CompanionPetReservationTimerProps = {
  expiresAt: string;
  expired: boolean;
  onExpired?: () => void;
};

export function CompanionPetReservationTimer({
  expiresAt,
  expired,
  onExpired,
}: CompanionPetReservationTimerProps) {
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
      className={`rounded-2xl border px-4 py-3 ${
        isExpired
          ? "border-[var(--cp-orange)] bg-[var(--cp-orange-muted)]"
          : "border-[var(--cp-blue)] bg-[var(--cp-blue-muted)]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[var(--cp-charcoal)]" aria-hidden>
            {isExpired ? "schedule" : "timer"}
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--cp-charcoal)]">
              {isExpired ? "Hold expired" : "Items reserved for checkout"}
            </p>
            <p className="text-xs text-[var(--cp-slate)]">
              {isExpired
                ? "Your reservation expired. Return to your cart to check availability."
                : "Your cart is held for 15 minutes while you complete checkout."}
            </p>
          </div>
        </div>
        {!isExpired ? (
          <div className="text-right">
            <p className="text-xs text-[var(--cp-slate)]">Time remaining</p>
            <p className="text-lg font-semibold tabular-nums text-[var(--cp-blue)]">
              {formatCountdown(remainingMs)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
