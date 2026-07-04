"use client";

import { useEffect } from "react";
import { EVERGREEN_SCROLL_SECTION_ORDER } from "./evergreenConfig";
import { useEvergreenEstimateModalOpen } from "./EvergreenEstimate";
import { scrollToEvergreenSection } from "./evergreenScroll";

/** Scroll to hash target on load / when hash changes (accounts for sticky header). */
export function EvergreenHashScroll() {
  const estimateModalOpen = useEvergreenEstimateModalOpen();

  useEffect(() => {
    const scrollFromHash = () => {
      if (estimateModalOpen) return;
      const hash = window.location.hash.slice(1);
      if (!(EVERGREEN_SCROLL_SECTION_ORDER as readonly string[]).includes(hash)) return;
      requestAnimationFrame(() => scrollToEvergreenSection(hash));
    };

    scrollFromHash();
    window.addEventListener("hashchange", scrollFromHash);
    return () => window.removeEventListener("hashchange", scrollFromHash);
  }, [estimateModalOpen]);

  return null;
}
