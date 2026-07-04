"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, Star, X } from "lucide-react";
import {
  isPsdNavActive,
  PSD_NAV_ITEMS,
  PSD_PATHS,
  PSD_SITE,
} from "./partySmileDentalConfig";

const MOBILE_NAV_ID = "psd-mobile-nav";

export function PartySmileDentalHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const handleNavClick = () => {
    close();
  };

  return (
    <header className="border-b-4 border-[#1a1a1a] bg-[#fffef8]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link href={PSD_PATHS.home} className="flex min-w-0 items-center gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eab308] text-[#1a1a1a] psd-tile-shadow">
            <Star className="h-5 w-5 fill-current" aria-hidden />
          </span>
          <span className="truncate font-black leading-tight text-[#1a1a1a]">{PSD_SITE}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {PSD_NAV_ITEMS.map((item) => {
            const active = isPsdNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                  active
                    ? "bg-[#3b82f6] text-white"
                    : "text-[#1a1a1a] hover:bg-[#f0f0f0]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#1a1a1a] bg-white lg:hidden"
          aria-expanded={open}
          aria-controls={MOBILE_NAV_ID}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav
          id={MOBILE_NAV_ID}
          className="border-t-2 border-[#1a1a1a] bg-[#fffef8] px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-2">
            {PSD_NAV_ITEMS.map((item) => {
              const active = isPsdNavActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    scroll={item.href.includes("#") ? false : undefined}
                    className={`block rounded-xl px-4 py-3 font-bold ${
                      active ? "bg-[#3b82f6] text-white" : "border-2 border-[#1a1a1a] bg-white"
                    }`}
                    onClick={handleNavClick}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
