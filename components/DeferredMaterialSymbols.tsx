"use client";

import { useEffect } from "react";

const MATERIAL_SYMBOLS_HREF =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap";

/**
 * Loads Material Symbols after hydration so the icon font does not block
 * first paint on marketing pages that do not need it immediately.
 */
export default function DeferredMaterialSymbols() {
  useEffect(() => {
    const existing = document.querySelector<HTMLLinkElement>(
      `link[data-deferred-font="material-symbols"]`,
    );
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = MATERIAL_SYMBOLS_HREF;
    link.dataset.deferredFont = "material-symbols";
    document.head.appendChild(link);
  }, []);

  return null;
}
