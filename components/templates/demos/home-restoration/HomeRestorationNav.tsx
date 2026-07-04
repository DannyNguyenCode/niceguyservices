"use client";

import { useEffect, useState } from "react";
import { HR_NAV_ITEMS, HR_SECTIONS, hrSectionHref } from "./homeRestorationConfig";
import { HrButton, hrDisplay } from "./HomeRestorationShared";

export function HomeRestorationNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 template-demo-fixed-nav z-50 transition-all duration-300 ${
        scrolled ? "hr-nav-scrolled" : "bg-transparent"
      } ${!scrolled ? "hr-nav-transparent" : ""}`}
    >
      <div className="mx-auto flex h-16 max-w-[var(--hr-container)] items-center justify-between gap-4 px-5 md:h-[4.5rem] md:px-8 lg:px-12">
        <a
          href={hrSectionHref(HR_SECTIONS.hero)}
          className="hr-focus-ring hr-nav-logo hr-display text-sm tracking-[0.12em] text-[var(--hr-charcoal)] md:text-base"
          style={hrDisplay}
          aria-label="Home Restoration — Home"
        >
          Home Restoration
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {HR_NAV_ITEMS.map((item) => (
            <a
              key={`${item.id}-${item.label}`}
              href={hrSectionHref(item.id)}
              className="hr-focus-ring hr-nav-link hr-label rounded-sm text-[var(--hr-charcoal-muted)] transition-colors hover:text-[var(--hr-charcoal)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <HrButton
            href={hrSectionHref(HR_SECTIONS.contact)}
            className="hidden px-5 py-2.5 lg:inline-flex"
          >
            Book Consultation
          </HrButton>
          <button
            type="button"
            className="hr-focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hr-line)] bg-[var(--hr-bg-elevated)]/80 text-[var(--hr-charcoal)] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="hr-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="material-symbols-outlined text-xl" aria-hidden>
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="hr-mobile-menu"
          className="border-t border-[var(--hr-line)] bg-[var(--hr-bg)] px-5 py-6 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {HR_NAV_ITEMS.map((item) => (
              <li key={`mobile-${item.id}-${item.label}`}>
                <a
                  href={hrSectionHref(item.id)}
                  className="hr-focus-ring block rounded-lg px-3 py-3 text-base font-medium text-[var(--hr-charcoal)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <HrButton href={hrSectionHref(HR_SECTIONS.contact)} className="w-full">
                Book Consultation
              </HrButton>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
