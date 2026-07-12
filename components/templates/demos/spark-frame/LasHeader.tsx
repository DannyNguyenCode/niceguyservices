"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SparkLogo } from "./SparkLogo";
import { SparkButton } from "./SparkButton";
import { LAS_NAV_ITEMS, LAS_PATHS, isLasNavActive, type LasNavKey } from "./leaveASparkConfig";
import { LAS_SITE } from "./leaveASparkSiteContent";
import { MobileNavigation } from "./MobileNavigation";

export function LasHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === LAS_PATHS.home || pathname === `${LAS_PATHS.home}/`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow] duration-300 ${
        scrolled || !isHome ? "las-nav-scrolled" : "bg-transparent"
      }`}
    >
      <div className="las-container flex min-h-[4.5rem] min-w-0 items-center justify-between gap-3 py-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <SparkLogo />
        </div>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {LAS_NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`las-body las-focus-ring text-[0.8125rem] font-semibold uppercase transition-colors hover:text-[var(--las-red-bright)] ${
                isLasNavActive(pathname, item.key as LasNavKey)
                  ? "las-nav-link-active text-[var(--las-off-white)]"
                  : "text-[var(--las-muted)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <SparkButton href={LAS_SITE.primaryCTA.href}>{LAS_SITE.primaryCTA.label}</SparkButton>
        </div>
        <MobileNavigation />
      </div>
    </header>
  );
}
