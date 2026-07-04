"use client";

import { useEffect, useState } from "react";
import {
  EVERGREEN_SCROLL_SECTION_ORDER,
  evergreenSectionToNavKey,
  type EvergreenNavKey,
  type EvergreenScrollSectionId,
} from "./evergreenConfig";
import { useEvergreenEstimateModalOpen } from "./EvergreenEstimate";

const SCROLL_OFFSET = 120;

function resolveScrollSection(
  skipSectionIds: readonly string[] = [],
): EvergreenScrollSectionId | "hero" {
  const marker = window.scrollY + SCROLL_OFFSET;
  let current: EvergreenScrollSectionId | "hero" = "hero";

  for (const id of EVERGREEN_SCROLL_SECTION_ORDER) {
    if (skipSectionIds.includes(id)) continue;
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (top <= marker) current = id;
  }

  return current;
}

export function useEvergreenActiveNavKey(): EvergreenNavKey {
  const estimateModalOpen = useEvergreenEstimateModalOpen();
  const [navKey, setNavKey] = useState<EvergreenNavKey>("home");

  useEffect(() => {
    let ticking = false;
    const skipSectionIds = estimateModalOpen ? (["contact"] as const) : [];

    const update = () => {
      setNavKey(evergreenSectionToNavKey(resolveScrollSection(skipSectionIds)));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    const onHashChange = () => {
      if (estimateModalOpen) {
        update();
        return;
      }
      const hash = window.location.hash.slice(1) as EvergreenScrollSectionId;
      if ((EVERGREEN_SCROLL_SECTION_ORDER as readonly string[]).includes(hash)) {
        setNavKey(evergreenSectionToNavKey(hash));
      } else {
        update();
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("resize", onScroll);
    };
  }, [estimateModalOpen]);

  return navKey;
}

export function useEvergreenActiveScrollSection(): EvergreenScrollSectionId | "hero" {
  const estimateModalOpen = useEvergreenEstimateModalOpen();
  const [scrollSection, setScrollSection] = useState<EvergreenScrollSectionId | "hero">("hero");

  useEffect(() => {
    let ticking = false;
    const skipSectionIds = estimateModalOpen ? (["contact"] as const) : [];

    const update = () => {
      setScrollSection(resolveScrollSection(skipSectionIds));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    const onHashChange = () => {
      if (estimateModalOpen) {
        update();
        return;
      }
      const hash = window.location.hash.slice(1) as EvergreenScrollSectionId;
      if ((EVERGREEN_SCROLL_SECTION_ORDER as readonly string[]).includes(hash)) {
        setScrollSection(hash);
      } else {
        update();
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("resize", onScroll);
    };
  }, [estimateModalOpen]);

  return scrollSection;
}
