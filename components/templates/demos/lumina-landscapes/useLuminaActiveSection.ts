"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LUMINA_SECTIONS, type LuminaSectionId } from "./luminaConfig";

export const LUMINA_SECTION_ORDER: LuminaSectionId[] = [
  LUMINA_SECTIONS.hero,
  LUMINA_SECTIONS.studio,
  LUMINA_SECTIONS.process,
  LUMINA_SECTIONS.materials,
  LUMINA_SECTIONS.experiences,
  LUMINA_SECTIONS.transformations,
  LUMINA_SECTIONS.consultation,
];

/** Offset for fixed nav + breathing room when picking the active section. */
const SCROLL_OFFSET = 160;

function resolveActiveSection(pathname: string | null): LuminaSectionId | null {
  const marker = window.scrollY + SCROLL_OFFSET;
  let current: LuminaSectionId | null = null;

  for (const id of LUMINA_SECTION_ORDER) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top + window.scrollY;
    if (top <= marker) current = id;
  }

  if (pathname?.endsWith("/experiences")) {
    return LUMINA_SECTIONS.experiences;
  }

  if (current === LUMINA_SECTIONS.hero) {
    return null;
  }

  return current;
}

export function useLuminaActiveSection(): LuminaSectionId | null {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<LuminaSectionId | null>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setActiveSection(resolveActiveSection(pathname));
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
      const hash = window.location.hash.slice(1) as LuminaSectionId;
      if (LUMINA_SECTION_ORDER.includes(hash)) {
        setActiveSection(hash === LUMINA_SECTIONS.hero ? null : hash);
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
  }, [pathname]);

  return activeSection;
}
