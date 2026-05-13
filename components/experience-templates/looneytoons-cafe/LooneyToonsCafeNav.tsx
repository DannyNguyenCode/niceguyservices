"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOONEYTOONS_CAFE_BASE } from "./looneytoonsCafeConfig";

const BASE = LOONEYTOONS_CAFE_BASE;

const DESKTOP_NAV = [
  { href: BASE, label: "Home" },
  { href: `${BASE}/menu`, label: "Menu" },
  { href: `${BASE}/about`, label: "Story" },
  { href: `${BASE}/menu#order`, label: "Order" },
  { href: `${BASE}/rewards`, label: "Rewards" },
  { href: `${BASE}/blog`, label: "Blog" },
] as const;

const MOBILE_NAV = [
  { href: BASE, label: "Home", icon: "home" },
  { href: `${BASE}/menu`, label: "Menu", icon: "coffee" },
  { href: `${BASE}/rewards`, label: "Rewards", icon: "stars" },
  { href: `${BASE}/blog`, label: "Blog", icon: "article" },
  { href: `${BASE}/about`, label: "Story", icon: "groups" },
] as const;

function isHome(pathname: string) {
  return pathname === BASE || pathname === `${BASE}/`;
}

export function LooneyToonsCafeNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-[#151c28] bg-[#f9f9ff] text-[#151c28] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <nav className="flex h-20 w-full items-center justify-between px-4 md:px-16">
          <div className="flex items-center gap-2">
            <Link
              href={BASE}
              className="font-black uppercase tracking-tighter text-[#151c28] [font-family:var(--font-lt-bricolage),system-ui,sans-serif] text-2xl leading-10 md:text-4xl md:leading-[52px]"
            >
              Comet Cup Co.
            </Link>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {DESKTOP_NAV.map((item) => {
              const onMenu = pathname === `${BASE}/menu` || pathname.startsWith(`${BASE}/menu/`);
              const active =
                item.label === "Home"
                  ? isHome(pathname)
                  : item.label === "Menu"
                    ? onMenu
                    : item.label === "Story"
                      ? pathname.startsWith(`${BASE}/about`)
                      : item.label === "Order"
                        ? false
                        : item.label === "Rewards"
                          ? pathname.startsWith(`${BASE}/rewards`)
                          : pathname.startsWith(`${BASE}/blog`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "text-sm font-bold text-[#5d5f5f] transition-transform duration-200 [font-family:var(--font-lt-space),system-ui,sans-serif] hover:scale-95"
                      : "text-sm font-medium text-[#444748] transition-transform duration-200 [font-family:var(--font-lt-space),system-ui,sans-serif] hover:scale-95"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative transition-transform hover:scale-95"
              aria-label="Cart (demo)"
            >
              <span className="material-symbols-outlined text-[#151c28]" aria-hidden>
                shopping_cart
              </span>
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-[#495E84] text-[10px] font-bold text-white">
                3
              </span>
            </button>
          </div>
        </nav>
      </header>

      <nav
        className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around border-t-4 border-[#151c28] bg-[#f9f9ff] px-4 md:hidden"
        aria-label="Comet Cup mobile"
      >
          {MOBILE_NAV.map((item) => {
            const active =
              item.href === BASE
                ? isHome(pathname)
                : pathname.startsWith(item.href.split("#")[0]);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex translate-y-1 flex-col items-center justify-center rounded-full border-2 border-[#151c28] bg-[#495E84] px-3 py-1 text-white transition-all [font-family:var(--font-lt-space),system-ui,sans-serif]"
                  : "flex flex-col items-center justify-center text-[#444748] transition-colors [font-family:var(--font-lt-space),system-ui,sans-serif] hover:bg-[#dde2f4]"
              }
            >
              <span className="material-symbols-outlined" aria-hidden>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
