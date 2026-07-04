"use client";

import { useEffect, useState } from "react";
import {
  LUMINA_NAV_ITEMS,
  LUMINA_SECTIONS,
  luminaSectionHref,
  type LuminaSectionId,
} from "./luminaConfig";
import { LuminaButton, luminaDisplay, luminaLabel } from "./LuminaShared";
import { useLuminaActiveSection } from "./useLuminaActiveSection";

const MOBILE_NAV_ITEMS = LUMINA_NAV_ITEMS.filter(
  (item) => item.id !== LUMINA_SECTIONS.consultation,
);

function navLinkClass(isActive: boolean) {
  return [
    "lumina-label lumina-nav-link",
    isActive
      ? "lumina-nav-link--active"
      : "text-[var(--lumina-cream-muted)] hover:text-[var(--lumina-cream)]",
  ].join(" ");
}

function mobileNavLinkClass(isActive: boolean) {
  return [
    "lumina-label block w-full px-5 py-4 text-left text-sm transition-colors",
    isActive
      ? "lumina-nav-link--active-mobile"
      : "text-[var(--lumina-cream-muted)] hover:bg-[var(--lumina-bg-elevated)] hover:text-[var(--lumina-cream)]",
  ].join(" ");
}

export function LuminaNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useLuminaActiveSection();

  const isActive = (id: LuminaSectionId) => activeSection === id;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const close = () => setMenuOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("hashchange", close);
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("hashchange", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const headerClass = `fixed inset-x-0 template-demo-fixed-nav z-50 transition-all duration-300 ${
    scrolled || menuOpen
      ? "border-b border-[var(--lumina-line)] bg-[var(--lumina-bg)]/92 backdrop-blur-md"
      : "bg-transparent"
  }`;

  const consultActive = isActive(LUMINA_SECTIONS.consultation);

  return (
    <header className={headerClass}>
      {/* Mobile — row 1: logo + consult; row 2: hamburger */}
      <div className="md:hidden">
        <div className="mx-auto flex h-14 max-w-[var(--lumina-container)] items-center justify-between px-5">
          <a
            href={luminaSectionHref(LUMINA_SECTIONS.hero)}
            className="lumina-display text-xs tracking-[0.1em] text-[var(--lumina-cream)]"
            style={luminaDisplay}
          >
            LUMINA LANDSCAPES
          </a>
          <LuminaButton
            href={luminaSectionHref(LUMINA_SECTIONS.consultation)}
            className={`px-4 py-2 text-[10px] ${consultActive ? "lumina-nav-consult--active" : ""}`}
            aria-current={consultActive ? "page" : undefined}
          >
            Consult
          </LuminaButton>
        </div>

        <div className="border-t border-[var(--lumina-line)]">
          <button
            type="button"
            className="flex w-full items-center justify-start px-5 py-3 text-[var(--lumina-cream)] transition-colors hover:text-[var(--lumina-bronze)]"
            aria-expanded={menuOpen}
            aria-controls="lumina-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="material-symbols-outlined text-2xl" aria-hidden>
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {menuOpen ? (
          <nav
            id="lumina-mobile-menu"
            className="w-full border-t border-[var(--lumina-line)] bg-[var(--lumina-bg)]/98 backdrop-blur-md"
            aria-label="Mobile"
          >
            <ul className="flex w-full flex-col">
              {MOBILE_NAV_ITEMS.map((item) => {
                const active = isActive(item.id);
                return (
                  <li key={item.id} className="w-full border-b border-[var(--lumina-line)] last:border-b-0">
                    <a
                      href={luminaSectionHref(item.id)}
                      className={mobileNavLinkClass(active)}
                      style={luminaLabel}
                      aria-current={active ? "true" : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </div>

      {/* Desktop — single row */}
      <div className="mx-auto hidden h-[4.5rem] max-w-[var(--lumina-container)] items-center justify-between px-8 md:flex lg:px-12">
        <a
          href={luminaSectionHref(LUMINA_SECTIONS.hero)}
          className="lumina-display text-base tracking-[0.12em] text-[var(--lumina-cream)]"
          style={luminaDisplay}
        >
          LUMINA LANDSCAPES
        </a>

        <nav className="flex items-center gap-8" aria-label="Primary">
          {LUMINA_NAV_ITEMS.map((item) => {
            const active = isActive(item.id);
            return (
              <a
                key={item.id}
                href={luminaSectionHref(item.id)}
                className={navLinkClass(active)}
                style={luminaLabel}
                aria-current={active ? "true" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <LuminaButton
          href={luminaSectionHref(LUMINA_SECTIONS.consultation)}
          className={`px-5 py-2.5 ${consultActive ? "lumina-nav-consult--active" : ""}`}
          aria-current={consultActive ? "page" : undefined}
        >
          Consult
        </LuminaButton>
      </div>
    </header>
  );
}
