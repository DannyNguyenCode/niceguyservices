"use client";

import {
  EVERGREEN_BOTTOM_NAV_ITEMS,
  isEvergreenNavItemActive,
} from "./evergreenConfig";
import { EvergreenSectionLink } from "./EvergreenSectionLink";
import { useEvergreenActiveNavKey } from "./useEvergreenActiveSection";

export function EvergreenBottomNav() {
  const navKey = useEvergreenActiveNavKey();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#c1c8c2]/40 bg-[#fbf9f8]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-stretch justify-around px-1">
        {EVERGREEN_BOTTOM_NAV_ITEMS.map((item) => {
          const active = isEvergreenNavItemActive(navKey, item.href);
          return (
            <EvergreenSectionLink
              key={item.href}
              href={item.href}
              className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors ${
                active ? "text-[#012d1d]" : "text-[#414844] hover:text-[#012d1d]"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span
                className="material-symbols-outlined text-[22px] leading-none"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                aria-hidden
              >
                {item.icon}
              </span>
              <span className="truncate text-[10px] font-semibold tracking-wide">{item.label}</span>
              {active ? (
                <span
                  className="absolute bottom-[calc(env(safe-area-inset-bottom)+2px)] h-0.5 w-8 rounded-full bg-[#012d1d]"
                  aria-hidden
                />
              ) : null}
            </EvergreenSectionLink>
          );
        })}
      </div>
    </nav>
  );
}
