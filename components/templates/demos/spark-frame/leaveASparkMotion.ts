"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

import type { Variants } from "framer-motion";

export const residualTrail = {
  duration: 0.15,
  ease: [0.4, 0, 0.2, 1] as const,
};

export const cardLift = {
  rest: { y: 0, boxShadow: "8px 8px 0 #050505" },
  hover: { y: -4, boxShadow: "12px 12px 0 #050505" },
  tap: { y: -1 },
};

export const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const mobileMenuItem: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 + i * 0.06, duration: 0.25 },
  }),
};

export const buttonChargeVariants: Variants = {
  idle: { y: 0 },
  hover: { y: -2, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
};

export const energyPulseKeyframes = {
  initial: { scale: 0, opacity: 0.8 },
  animate: { scale: 2.5, opacity: 0 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};
