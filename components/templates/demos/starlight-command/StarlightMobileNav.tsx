"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { STARLIGHT_NAV_PRIMARY, starlightNavKeyFromPathname } from "./starlightConfig";

export function StarlightMobileNav() {
  const pathname = usePathname();
  const activeKey = starlightNavKeyFromPathname(pathname);

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex min-h-20 w-full items-stretch justify-center border-t-4 border-[#594238] bg-[#20201f] pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_20px_rgba(0,0,0,0.5)] md:hidden"
      aria-label="Primary"
    >
      {STARLIGHT_NAV_PRIMARY.map((item) => {
        const active = activeKey === item.key;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 bg-[#ee671c] px-1 py-2 text-[#351000] shadow-[inset_0_0_10px_rgba(0,0,0,0.45)] brightness-110 sm:px-2"
                : "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[#e0c0b2] opacity-70 grayscale transition-all hover:bg-[#353535] hover:opacity-100 hover:grayscale-0 sm:px-2"
            }
          >
            <span className={active ? "material-symbols-outlined sc-material-fill" : "material-symbols-outlined"}>
              {item.icon}
            </span>
            <span className="mt-1 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-semibold uppercase tracking-widest">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
