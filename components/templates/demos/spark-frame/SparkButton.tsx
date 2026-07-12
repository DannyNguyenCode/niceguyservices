"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { lasPath } from "./leaveASparkConfig";
import { buttonChargeVariants, energyPulseKeyframes, usePrefersReducedMotion } from "./leaveASparkMotion";

type SparkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  pulseOnClick?: boolean;
  fullWidth?: boolean;
};

export function SparkButton({
  href,
  children,
  variant = "primary",
  className = "",
  pulseOnClick = false,
  fullWidth = false,
}: SparkButtonProps) {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const [pulsing, setPulsing] = useState(false);

  const baseClass =
    variant === "primary"
      ? "las-btn-primary las-energy-trace las-focus-ring"
      : "las-btn-secondary las-focus-ring";

  const widthClass = fullWidth ? "w-full" : "w-full sm:w-auto";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!pulseOnClick || reduced) return;
    e.preventDefault();
    setPulsing(true);
    window.setTimeout(() => {
      router.push(lasPath(href));
    }, 320);
  };

  return (
    <motion.div
      className={`relative flex ${widthClass} ${className}`}
      variants={buttonChargeVariants}
      initial="idle"
      whileHover={reduced ? undefined : "hover"}
      whileTap={reduced ? undefined : "tap"}
    >
      <Link
        href={lasPath(href)}
        onClick={pulseOnClick ? handleClick : undefined}
        className={`${baseClass} ${widthClass} ${className}`}
      >
        {children}
        <ChevronRightIcon className="h-4 w-4 shrink-0" aria-hidden />
      </Link>
      {pulsing && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-sm bg-[var(--las-red-bright)]"
          initial={energyPulseKeyframes.initial}
          animate={energyPulseKeyframes.animate}
          transition={energyPulseKeyframes.transition}
          aria-hidden
        />
      )}
    </motion.div>
  );
}
