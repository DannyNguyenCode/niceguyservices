"use client";

import { useLooneyToonsCart } from "./LooneyToonsCartContext";
import {
  STARS_PER_DOLLAR,
  calcStarProgressPercent,
} from "./looneytoonsCafeRewardsData";

export function LooneyToonsRewardsProgress() {
  const { starBalance } = useLooneyToonsCart();
  const progress = calcStarProgressPercent(starBalance);

  return (
    <div className="relative mb-12 w-full max-w-lg -rotate-1 rounded-xl border-4 border-[#151c28] bg-[#f9f9ff] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <p className="mb-4 text-sm font-bold uppercase tracking-widest [font-family:var(--font-lt-space),system-ui,sans-serif]">
        Your progress
      </p>
      <div className="mb-2 flex items-end justify-between">
        <span className="font-extrabold [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-5xl">
          {starBalance}
        </span>
        <span className="pb-2 text-sm font-bold [font-family:var(--font-lt-space),system-ui,sans-serif]">
          STARS EARNED
        </span>
      </div>
      <div className="relative h-8 w-full overflow-hidden rounded-full border-4 border-[#151c28] bg-[#dde2f4]">
        <div
          className="relative h-full border-r-4 border-[#151c28] bg-[#d4daec] transition-all duration-500"
          style={{ width: `${progress}%` }}
        >
          <div className="lt-halftone-light absolute inset-0 opacity-30" aria-hidden />
        </div>
      </div>
      <p className="mt-4 italic text-[#444748] [font-family:var(--font-lt-space),system-ui,sans-serif]">
        {STARS_PER_DOLLAR} star for every $1 spent
      </p>
    </div>
  );
}
