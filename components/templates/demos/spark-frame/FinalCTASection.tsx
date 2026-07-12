"use client";

import { SparkButton } from "./SparkButton";
import { TextureOverlay } from "./TextureOverlays";
import { LAS_HOME } from "./leaveASparkSiteContent";

export function FinalCTASection() {
  const { finalCta } = LAS_HOME;

  return (
    <section className="relative overflow-hidden bg-[var(--las-bg-primary)]">
      <TextureOverlay className="py-16 sm:py-20 lg:py-28" grain ink halftone>
        <svg className="pointer-events-none absolute left-0 top-0 h-24 w-full opacity-20" aria-hidden>
          <path d="M0 40 Q200 20 400 40 T800 35" stroke="#D71920" strokeWidth="1" fill="none" />
        </svg>
        <div className="las-container relative z-[2] text-center">
          <h2 className="las-display text-[clamp(2rem,6vw,4rem)] text-[var(--las-off-white)]">
            {finalCta.headline}
          </h2>
          <p className="las-body mx-auto mt-4 max-w-lg text-[clamp(0.95rem,1.5vw,1.125rem)] text-[var(--las-muted)]">
            {finalCta.body}
          </p>
        <div className="mt-8 flex justify-center px-4 sm:px-0">
          <SparkButton href={finalCta.cta.href} pulseOnClick className="w-full max-w-md sm:w-auto sm:max-w-none">
              {finalCta.cta.label}
            </SparkButton>
          </div>
        </div>
      </TextureOverlay>
    </section>
  );
}
