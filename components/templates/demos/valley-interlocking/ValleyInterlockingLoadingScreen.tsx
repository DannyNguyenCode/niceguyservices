"use client";

import { useEffect, useRef, useState } from "react";
import { VI_SITE, VI_SITE_LINE1, VI_SITE_LINE2 } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

const LOADER_PHRASES = [
  "Measuring stone grade...",
  "Optimizing garden layouts...",
  "Finalizing interlocking patterns...",
  "Irrigation mapping complete.",
  "Cultivating your vision...",
] as const;

const PHRASE_INTERVAL_MS = 3000;

type ValleyInterlockingLoadingScreenProps = {
  visible: boolean;
};

export function ValleyInterlockingLoadingScreen({ visible }: ValleyInterlockingLoadingScreenProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseVisible, setPhraseVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bg = bgRef.current;
    if (prefersReduced || !bg) return;

    const onMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2;
      const y = (event.clientY / window.innerHeight) * 2;
      bg.style.transform = `scale(1.05) translate(${-x}%, ${-y}%)`;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const interval = window.setInterval(() => {
      setPhraseVisible(false);
      window.setTimeout(() => {
        setPhraseIndex((current) => (current + 1) % LOADER_PHRASES.length);
        setPhraseVisible(true);
      }, 500);
    }, PHRASE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="vi-loading-screen fixed inset-0 z-[200] select-none overflow-hidden bg-[var(--vi-on-background)]"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="absolute inset-0 z-0 h-screen w-screen overflow-hidden">
        <div
          ref={bgRef}
          className="vi-loading-bg absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url('${VI_IMG.loader.background}')` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" aria-hidden />
      </div>

      <main className="relative z-10 flex h-screen w-full flex-col items-center justify-center px-[var(--vi-gutter)] text-center">
        <div className="vi-loading-fade-in flex max-w-2xl flex-col items-center gap-[var(--vi-stack-lg)]">
          <div className="mb-[var(--vi-stack-md)] vi-loading-logo-glow" aria-label={VI_SITE}>
            <div className="vi-site-brand vi-loading-brand vi-headline-md font-bold">
              <span className="block leading-tight">{VI_SITE_LINE1}</span>
              <span className="block leading-tight">{VI_SITE_LINE2}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-[var(--vi-stack-md)]">
            <div className="vi-loading-spinner mb-4" aria-hidden />

            <div className="space-y-2">
              <p className="vi-headline-lg text-[var(--vi-on-tertiary)] tracking-wide">
                Cultivating your vision...
              </p>
              <p
                className="vi-body-md mx-auto max-w-xs italic text-[var(--vi-on-tertiary)]/60 transition-opacity duration-500"
                style={{ opacity: phraseVisible ? 0.6 : 0 }}
              >
                {phraseIndex === 0
                  ? "Preparing your bespoke landscape transformation profile."
                  : LOADER_PHRASES[phraseIndex]}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-0 flex w-full flex-col items-center gap-2 opacity-40">
          <span className="vi-label-md text-xs uppercase tracking-[0.2em] text-[var(--vi-on-tertiary)]">
            Precision in every blade
          </span>
          <div className="h-px w-12 bg-[var(--vi-primary-container)]" aria-hidden />
        </div>
      </main>
    </div>
  );
}
