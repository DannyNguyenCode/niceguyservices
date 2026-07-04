"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getNeopetsActiveSection,
  isNeopetsNavActive,
  NEOPETS_BOTTOM_NAV_ITEMS,
  NEOPETS_PATHS,
} from "./neopetsConfig";

function isBottomNavActive(pathname: string, href: string): boolean {
  const section = getNeopetsActiveSection(pathname);

  if (href === NEOPETS_PATHS.explorer) {
    return section === "explore" || (section === null && isNeopetsNavActive(pathname, NEOPETS_PATHS.home));
  }

  if (href === NEOPETS_PATHS.adoptionProcess) {
    return section === "journey";
  }

  if (href === NEOPETS_PATHS.volunteers) {
    return section === "community";
  }

  if (href === NEOPETS_PATHS.profile) {
    return isNeopetsNavActive(pathname, NEOPETS_PATHS.profile);
  }

  return isNeopetsNavActive(pathname, href);
}

export function NeopetsBottomNav() {
  const pathname = usePathname() ?? "";

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t-4 border-[#adf19e] bg-[#f6ece1] px-2 pb-4 pt-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden"
      aria-label="Quick demo navigation"
    >
      {NEOPETS_BOTTOM_NAV_ITEMS.map((item) => {
        const active = isBottomNavActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "flex scale-110 flex-col items-center justify-center rounded-full bg-[#adf19e] px-4 py-1 text-[#326f2d] transition-all"
                : "flex flex-col items-center justify-center px-4 py-2 text-[#40484e] transition-all hover:bg-[#95d787]/30 active:scale-90"
            }
            style={{ fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" }}
            aria-current={active ? "page" : undefined}
          >
            <span
              className="material-symbols-outlined text-sm leading-none"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-sm font-semibold tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
