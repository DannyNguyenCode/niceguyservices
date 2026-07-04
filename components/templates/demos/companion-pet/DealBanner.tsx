"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CP_PATHS } from "./companionPetConfig";

type DealBannerProps = {
  title?: string;
  subtitle?: string;
  cta?: string;
  href?: string;
};

export function DealBanner({
  title = "Member exclusive · 15% off wellness",
  subtitle = "Gold Companion tier unlocks extra savings on supplements and grooming.",
  cta = "Shop deals",
  href = CP_PATHS.shop,
}: DealBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="cp-card cp-float-delay-1 overflow-hidden rounded-2xl border-[var(--cp-orange)]/20 bg-[var(--cp-orange-muted)] p-4"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--cp-orange)]">Featured deal</p>
      <p className="mt-1 text-sm font-semibold text-[var(--cp-charcoal)]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--cp-slate)]">{subtitle}</p>
      <Link
        href={href}
        className="mt-3 inline-flex rounded-lg bg-[var(--cp-orange)] px-3 py-1.5 text-xs font-semibold text-white"
      >
        {cta}
      </Link>
    </motion.div>
  );
}
