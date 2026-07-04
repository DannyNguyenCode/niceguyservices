"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/solid";

const SHOW_AFTER_PX = 480;

export function InspirationsBackToTopFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={scrollUp}
      className={`inspirations-back-to-top fixed right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 shadow-lg transition-all duration-300 md:right-8 ${
        visible
          ? "pointer-events-auto bottom-6 translate-y-0 opacity-100 md:bottom-8"
          : "pointer-events-none bottom-6 translate-y-4 opacity-0"
      }`}
    >
      <ArrowUpIcon className="h-5 w-5" aria-hidden />
    </button>
  );
}
