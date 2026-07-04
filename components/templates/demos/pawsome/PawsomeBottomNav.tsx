"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PS_NAV_ITEMS, isPsNavActive } from "./pawsomeConfig";
import { PsIcon } from "./PawsomeShared";

export function PawsomeBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-(--ps-surface) pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_rgba(0,0,0,0.04)] md:hidden"
      aria-label="Mobile bottom navigation"
    >
      <div className="mx-auto flex h-20 w-full max-w-(--ps-container-max) items-center justify-around px-4">
        {PS_NAV_ITEMS.map((item) => {
          const active = isPsNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all duration-150 active:scale-90 ${active
                  ? "text-(--ps-primary)"
                  : "text-(--ps-on-surface-variant) hover:bg-(--ps-surface-container-low)"
                }`}
            >
              <PsIcon name={item.icon} filled={active} className="text-2xl" />
              <span className="text-xs font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
