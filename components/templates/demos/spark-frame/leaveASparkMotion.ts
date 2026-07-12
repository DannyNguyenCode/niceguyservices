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

export function useIsTouchDevice(): boolean {
  const [touch, setTouch] = useState(true);

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
  }, []);

  return touch;
}

export function useCompactViewport(): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return compact;
}

/** Hero room lighting sequence — milliseconds from page load */
export const HERO_LIGHT_TIMELINE = {
  panelLed: 400,
  panelPulse: 800,
  kitchen: 1200,
  living: 1700,
  office: 2200,
  bedroom: 2700,
  garage: 3200,
  exterior: 3700,
  landscape: 4200,
  complete: 4700,
  sparkGlow: 4700,
} as const;

/** Compressed sequence for touch / narrow viewports */
export const HERO_MOBILE_LIGHT_TIMELINE = {
  panelLed: 200,
  panelPulse: 400,
  kitchen: 600,
  living: 900,
  office: 1100,
  bedroom: 1300,
  garage: 1500,
  exterior: 1700,
  landscape: 1900,
  complete: 2100,
  sparkGlow: 2100,
} as const;

export type HeroRoomId =
  | "panel"
  | "kitchen"
  | "living"
  | "office"
  | "bedroom"
  | "garage"
  | "exterior"
  | "landscape";

export const HERO_ROOM_ORDER: HeroRoomId[] = [
  "panel",
  "kitchen",
  "living",
  "office",
  "bedroom",
  "garage",
  "exterior",
  "landscape",
];

import type { Variants } from "framer-motion";

export const panelEntrance: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const electricalPulse: Variants = {
  idle: { scale: 1, opacity: 0.6 },
  pulse: {
    scale: [1, 1.4, 1],
    opacity: [0.6, 1, 0.6],
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

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

export const circuitNodeActivate: Variants = {
  inactive: { scale: 1, backgroundColor: "#242424" },
  active: {
    scale: [1, 1.15, 1],
    backgroundColor: "#D71920",
    transition: { duration: 0.3 },
  },
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
