"use client";

import { motion } from "framer-motion";
import type { Achievement } from "./companionPetData";

type AchievementBadgeProps = {
  achievement: Achievement;
  compact?: boolean;
};

export function AchievementBadge({ achievement, compact = false }: AchievementBadgeProps) {
  const pct =
    achievement.progress != null && achievement.max
      ? Math.min(100, (achievement.progress / achievement.max) * 100)
      : achievement.unlocked
        ? 100
        : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`cp-card flex gap-3 p-4 ${achievement.unlocked ? "bg-[var(--cp-green-muted)]/40" : "opacity-90"}`}
    >
      <motion.div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          achievement.unlocked ? "bg-[var(--cp-green)] text-white" : "bg-[var(--cp-warm-gray)] text-[var(--cp-slate)]"
        }`}
      >
        <span className="material-symbols-outlined text-xl" aria-hidden>
          {achievement.icon}
        </span>
      </motion.div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[var(--cp-charcoal)]">{achievement.title}</p>
        {!compact ? (
          <p className="mt-0.5 text-xs text-[var(--cp-slate)]">{achievement.description}</p>
        ) : null}
        {!achievement.unlocked && achievement.max ? (
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--cp-warm-gray)]">
            <motion.div
              className="h-full rounded-full bg-[var(--cp-orange)]"
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
