"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedCounter } from "./AnimatedCounter";
import { CP_LOYALTY, CP_PET_PROFILE } from "./companionPetData";
import { CP_PATHS } from "./companionPetConfig";

export function RewardsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="cp-card cp-glass cp-float overflow-hidden p-4"
    >
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 overflow-hidden rounded-xl ring-2 ring-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CP_PET_PROFILE.avatar} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--cp-charcoal)]">{CP_PET_PROFILE.name}</p>
          <p className="truncate text-xs text-[var(--cp-slate)]">{CP_PET_PROFILE.type}</p>
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--cp-slate)]">Your points</p>
          <p className="text-2xl font-semibold text-[var(--cp-orange)]">
            <AnimatedCounter value={CP_LOYALTY.points} />
          </p>
        </div>
        <span className="rounded-full bg-[var(--cp-orange-muted)] px-2.5 py-1 text-xs font-medium text-[var(--cp-orange)]">
          {CP_LOYALTY.level}
        </span>
      </div>
      <Link
        href={CP_PATHS.rewards}
        className="mt-3 block rounded-xl bg-[var(--cp-charcoal)] py-2.5 text-center text-xs font-semibold text-white transition-opacity hover:opacity-90"
      >
        View rewards dashboard
      </Link>
    </motion.div>
  );
}
