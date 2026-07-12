"use client";

import Image from "next/image";
import { LAS_IMG } from "./leaveASparkImages";

const FRAME_CLIP = "polygon(4% 0, 100% 2%, 98% 100%, 0 97%)";
const RED_BACKDROP_CLIP = "polygon(8% 0, 100% 3%, 96% 100%, 0 96%)";

function TopCallout() {
  return (
    <div className="absolute -right-2 top-6 z-20 border-2 border-[var(--las-red)] bg-[var(--las-bg-primary)]/90 p-3 backdrop-blur-sm sm:right-4 sm:top-10">
      <p className="las-display text-[0.8rem] leading-tight text-[var(--las-off-white)] sm:text-[1rem]">
        POWERING
        <br />
        WHAT MATTERS
        <br />
        <span className="text-[var(--las-red)]">MOST.</span>
      </p>
    </div>
  );
}

function BottomCallout() {
  return (
    <div className="absolute bottom-8 right-4 z-20 border-2 border-[var(--las-red)] bg-[var(--las-bg-primary)]/90 p-3 backdrop-blur-sm sm:bottom-14 sm:right-10">
      <p className="las-display text-[0.8rem] italic leading-tight text-[var(--las-off-white)] sm:text-[1rem]">
        QUIET WORK.
        <br />
        <span className="text-[var(--las-red)]">POWERFUL IMPACT.</span>
      </p>
    </div>
  );
}

type ComicHeroHouseProps = {
  className?: string;
};

/**
 * Right-side hero visual — comic-panel framing with callouts.
 */
export function ComicHeroHouse({ className = "" }: ComicHeroHouseProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Red offset backdrop */}
      <div
        className="absolute -right-4 -top-2 h-full w-full bg-[var(--las-red)]/90 sm:-right-6 sm:-top-3 lg:-right-8 lg:-top-4"
        style={{ clipPath: RED_BACKDROP_CLIP }}
        aria-hidden
      />

      {/* Framed cutaway illustration */}
      <div
        className="relative border-[3px] border-[var(--las-off-white)]/95 shadow-2xl"
        style={{ clipPath: FRAME_CLIP }}
      >
        <Image
          src={LAS_IMG.heroHouse}
          alt="Cutaway illustration of a home showing electrical wiring, panels, EV charger, generator, and solar."
          width={1400}
          height={1400}
          className="block h-auto w-full"
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
        />
      </div>

      <TopCallout />
      <BottomCallout />
    </div>
  );
}
