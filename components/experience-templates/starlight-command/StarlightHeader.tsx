"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  STARLIGHT_NAV_DESKTOP_EXTRA,
  STARLIGHT_NAV_PRIMARY,
  STARLIGHT_PATHS,
  STARLIGHT_SITE,
  isStarlightExtraNavActive,
  starlightNavKeyFromPathname,
} from "./starlightConfig";

function desktopPrimaryClass(active: boolean) {
  return active
    ? "font-['var(--font-sc-display),ui-sans-serif'] text-sm font-bold uppercase tracking-widest text-[#ee671c] underline decoration-4 underline-offset-8"
    : "font-['var(--font-sc-display),ui-sans-serif'] text-sm font-semibold uppercase tracking-widest text-[#e0c0b2] transition-colors duration-300 hover:text-[#ee671c]";
}

function desktopExtraClass(active: boolean) {
  return active
    ? "font-['var(--font-sc-display),ui-sans-serif'] text-xs font-bold uppercase tracking-widest text-[#ffb595] underline decoration-2 underline-offset-4"
    : "font-['var(--font-sc-display),ui-sans-serif'] text-xs font-semibold uppercase tracking-widest text-[#e0c0b2] transition-colors hover:text-[#ee671c]";
}

export function StarlightHeader() {
  const pathname = usePathname();
  const activeKey = starlightNavKeyFromPathname(pathname);

  return (
    <header className="sticky top-0 z-60 w-full max-w-[100vw] border-b-4 border-[#594238] bg-[#131313] shadow-[0_0_15px_rgba(238,103,28,0.3)]">
      <div className="mx-auto flex w-full max-w-full flex-wrap items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 md:px-8 lg:px-16">
        <Link href={STARLIGHT_PATHS.home} className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="material-symbols-outlined sc-material-fill shrink-0 text-xl text-[#ffb595] sm:text-2xl md:text-3xl">
            electric_bolt
          </span>
          <span className="truncate font-['var(--font-sc-display),ui-sans-serif] text-base font-bold tracking-tighter text-[#ffb595] sm:text-lg md:text-2xl">
            {STARLIGHT_SITE}
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex md:gap-6 lg:gap-8" aria-label="Main">
          {STARLIGHT_NAV_PRIMARY.map((item) => (
            <Link key={item.href} href={item.href} className={desktopPrimaryClass(activeKey === item.key)}>
              {item.label}
            </Link>
          ))}
          <span className="h-6 w-px bg-[#594238]" aria-hidden />
          {STARLIGHT_NAV_DESKTOP_EXTRA.map((item) => (
            <Link key={item.href} href={item.href} className={desktopExtraClass(isStarlightExtraNavActive(pathname, item.href))}>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="shrink-0 bg-[#ee671c] px-2.5 py-2.5 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-bold uppercase leading-tight tracking-wider text-[#351000] shadow-[inset_0_0_10px_rgba(0,0,0,0.35)] transition-all hover:brightness-110 sm:px-4 sm:text-xs sm:tracking-widest md:px-6"
        >
          EMERGENCY
        </button>
      </div>
    </header>
  );
}
