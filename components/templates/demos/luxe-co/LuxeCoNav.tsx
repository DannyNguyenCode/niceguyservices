"use client";

import { useEffect, useState } from "react";
import { LC_NAV_ITEMS, LC_SECTIONS, lcSectionHref } from "./luxeCoConfig";
import { useLuxeCoConsultation } from "./LuxeCoConsultation";
import { LcButton, lcDisplay } from "./LuxeCoShared";

export function LuxeCoNav() {
  const openConsultation = useLuxeCoConsultation();
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
        scrolled ? "lc-nav-scrolled" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[var(--lc-container)] items-center justify-between gap-4 px-5 md:h-[4.5rem] md:px-8 lg:px-12">
        <a
          href={lcSectionHref(LC_SECTIONS.hero)}
          className={`lc-focus-ring lc-display text-sm tracking-[0.14em] transition-colors md:text-base ${
            scrolled ? "text-[var(--lc-charcoal)]" : "text-white hover:text-[var(--lc-beige)]"
          }`}
          style={lcDisplay}
          aria-label="LUXE & CO. — Home"
        >
          LUXE &amp; CO.
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {LC_NAV_ITEMS.map((item) => (
            <a
              key={`${item.id}-${item.label}`}
              href={lcSectionHref(item.id)}
              className={`lc-focus-ring lc-label rounded-sm transition-colors ${
                scrolled
                  ? "text-[var(--lc-charcoal-muted)] hover:text-[var(--lc-charcoal)]"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LcButton
            onClick={() => openConsultation()}
            className="hidden px-5 py-2.5 lg:inline-flex"
          >
            Book Consultation
          </LcButton>
          <button
            type="button"
            className={`lc-focus-ring flex h-10 w-10 items-center justify-center border transition-colors lg:hidden ${
              scrolled
                ? "border-[var(--lc-line)] bg-[var(--lc-bg-elevated)] text-[var(--lc-charcoal)]"
                : "border-white/35 bg-white/10 text-white hover:bg-white/15"
            }`}
            aria-expanded={menuOpen}
            aria-controls="lc-mobile-menu"
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
          id="lc-mobile-menu"
          className="border-t border-[var(--lc-line)] bg-[var(--lc-bg)] px-5 py-6 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {LC_NAV_ITEMS.map((item) => (
              <li key={`mobile-${item.id}-${item.label}`}>
                <a
                  href={lcSectionHref(item.id)}
                  className="lc-focus-ring block px-3 py-3 text-base font-medium text-[var(--lc-charcoal)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <LcButton
                onClick={() => {
                  setMenuOpen(false);
                  openConsultation();
                }}
                className="w-full"
              >
                Book Consultation
              </LcButton>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
