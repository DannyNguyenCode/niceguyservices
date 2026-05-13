"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  isNeopetsNavActive,
  NEOPETS_NAV_ROW_PRIMARY,
  NEOPETS_NAV_ROW_SECONDARY,
  NEOPETS_PATHS,
  NEOPETS_SITE,
  type NeopetsNavItem,
} from "./neopetsConfig";

const MOBILE_NAV_PANEL_ID = "neopets-mobile-nav-panel";

function navLinkClass(active: boolean) {
  return active
    ? "shrink-0 snap-start rounded-full bg-[#0d658c] px-3 py-1.5 text-xs font-bold text-white shadow-sm sm:px-4 sm:text-sm"
    : "shrink-0 snap-start rounded-full border border-transparent px-3 py-1.5 text-xs font-semibold text-[#40484e] hover:border-[#c0c7cf] hover:bg-white/80 sm:px-4 sm:text-sm";
}

function mobileNavLinkClass(active: boolean) {
  return active
    ? "flex items-center gap-3 rounded-xl bg-[#0d658c] px-4 py-3.5 text-base font-bold text-white shadow-sm"
    : "flex items-center gap-3 rounded-xl border-2 border-[#ebe1d5] bg-[#fff8f2] px-4 py-3.5 text-base font-semibold text-[#1f1b14] hover:border-[#0d658c]/40";
}

const rowBaseClass =
  "flex snap-x snap-mandatory gap-2 overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch] md:snap-none md:flex-wrap md:justify-center md:overflow-x-visible md:overflow-y-visible";

function NeopetsNavRow({
  pathname,
  items,
  rowClassName,
}: {
  pathname: string;
  items: readonly NeopetsNavItem[];
  rowClassName?: string;
}) {
  return (
    <div className={rowClassName ? `${rowBaseClass} ${rowClassName}` : rowBaseClass}>
      {items.map((item) => {
        const active = isNeopetsNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 ${navLinkClass(active)}`}
            style={{ fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" }}
          >
            <span className="material-symbols-outlined text-lg leading-none sm:text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

function NeopetsMobileNavPanel({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="max-h-[min(70dvh,calc(100dvh-5.5rem))] overflow-y-auto overscroll-contain border-t border-[#ebe1d5] bg-[#fcf2e6] px-4 py-4 shadow-[0_12px_24px_rgba(31,27,20,0.12)]">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#745b00]">Find &amp; help</p>
      <ul className="flex flex-col gap-2">
        {NEOPETS_NAV_ROW_PRIMARY.map((item) => {
          const active = isNeopetsNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={mobileNavLinkClass(active)}
                style={{ fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" }}
                onClick={onNavigate}
              >
                <span className="material-symbols-outlined text-2xl leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider text-[#745b00]">More</p>
      <ul className="flex flex-col gap-2">
        {NEOPETS_NAV_ROW_SECONDARY.map((item) => {
          const active = isNeopetsNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={mobileNavLinkClass(active)}
                style={{ fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" }}
                onClick={onNavigate}
              >
                <span className="material-symbols-outlined text-2xl leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function NeopetsHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-[#ebe1d5] bg-[#fcf2e6] shadow-[0_4px_0_0_rgba(13,101,140,0.1)]">
      {menuOpen ? (
        <div
          className="fixed inset-0 z-45 bg-[#1f1b14]/40 md:hidden"
          aria-hidden
          onClick={closeMenu}
        />
      ) : null}

      <div className="relative z-50 mx-auto max-w-[1200px] px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="flex min-h-14 items-center justify-between gap-2 py-2">
          <Link href={NEOPETS_PATHS.home} className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined shrink-0 text-2xl text-[#0d658c] sm:text-3xl">pets</span>
            <span
              className="truncate text-lg font-bold leading-tight text-[#0d658c] drop-shadow-sm sm:text-xl md:text-[28px] md:leading-9 lg:text-[32px] lg:leading-10"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              {NEOPETS_SITE}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#0d658c] text-[#0d658c] transition-colors hover:bg-[#8fd3ff]/30 md:hidden"
              aria-expanded={menuOpen}
              aria-controls={MOBILE_NAV_PANEL_ID}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="material-symbols-outlined text-2xl leading-none" aria-hidden>
                {menuOpen ? "close" : "menu"}
              </span>
            </button>

            <Link
              href={NEOPETS_PATHS.profile}
              className="hidden rounded-full p-1 text-[#0d658c] transition-transform hover:scale-95 md:inline-flex md:items-center md:justify-center"
              aria-label="Profile (demo)"
            >
              <span className="material-symbols-outlined text-2xl sm:text-3xl">account_circle</span>
            </Link>
          </div>
        </div>

        {menuOpen ? (
          <nav
            id={MOBILE_NAV_PANEL_ID}
            className="absolute left-0 right-0 top-full z-55 md:hidden"
            aria-label="Demo pages"
          >
            <NeopetsMobileNavPanel pathname={pathname} onNavigate={closeMenu} />
          </nav>
        ) : null}

        <nav
          className="hidden border-t border-[#ebe1d5] pb-3 pt-2 md:block"
          aria-label="Demo pages"
        >
          <div className="flex flex-col gap-2 px-1 sm:px-0 md:px-0">
            <NeopetsNavRow pathname={pathname} items={NEOPETS_NAV_ROW_PRIMARY} rowClassName="pb-0.5" />
            <NeopetsNavRow
              pathname={pathname}
              items={NEOPETS_NAV_ROW_SECONDARY}
              rowClassName="border-t border-dashed border-[#ebe1d5] pt-2"
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
