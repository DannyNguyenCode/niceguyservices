"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { CP_LOYALTY } from "./companionPetData";

type LoyaltyProgressProps = {
  compact?: boolean;
  showLabels?: boolean;
};

export function LoyaltyProgress({ compact = false, showLabels = true }: LoyaltyProgressProps) {
  const pct = Math.min(100, (CP_LOYALTY.xp / CP_LOYALTY.xpToNext) * 100);
  const monthlyPct = Math.min(100, (CP_LOYALTY.monthlyProgress / CP_LOYALTY.monthlyGoal) * 100);

  return (
    <div className={`cp-card p-5 ${compact ? "" : "md:p-6"}`}>
      {showLabels ? (
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--cp-slate)]">Loyalty tier</p>
            <p className="text-lg font-semibold text-[var(--cp-charcoal)]">{CP_LOYALTY.level}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--cp-slate)]">Points balance</p>
            <p className="text-xl font-semibold text-[var(--cp-orange)]">
              <AnimatedCounter value={CP_LOYALTY.points} />
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <div className="flex justify-between text-xs text-[var(--cp-slate)]">
          <span>Level {CP_LOYALTY.levelNumber} progress</span>
          <span>
            <AnimatedCounter value={CP_LOYALTY.xp} /> / {CP_LOYALTY.xpToNext} XP
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--cp-warm-gray)]">
          <motion.div
            className="h-full rounded-full bg-[var(--cp-blue)]"
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {!compact ? (
        <div className="mt-4 flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0">
            <svg className="cp-progress-ring h-14 w-14" viewBox="0 0 36 36" aria-hidden>
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--cp-warm-gray)" strokeWidth="3" />
              <motion.circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                stroke="var(--cp-green)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${monthlyPct} 100`}
                initial={{ strokeDasharray: "0 100" }}
                whileInView={{ strokeDasharray: `${monthlyPct} 100` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2 }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-[var(--cp-charcoal)]">
              {Math.round(monthlyPct)}%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--cp-charcoal)]">Monthly goal</p>
            <p className="text-xs text-[var(--cp-slate)]">
              {CP_LOYALTY.monthlyProgress} / {CP_LOYALTY.monthlyGoal} pts · {CP_LOYALTY.streak}-week streak
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
