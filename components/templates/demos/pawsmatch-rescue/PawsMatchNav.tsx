"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePawsMatchAuth } from "./PawsMatchAuthContext";
import { PMR_NAV_ITEMS, PMR_PATHS, PMR_SITE, isPmrAdminUser } from "./pawsMatchRescueConfig";
import { PmrButton, PmrIcon, pmrDisplay } from "./PawsMatchShared";

function PmrLogoLink() {
  return (
    <Link
      href={PMR_PATHS.home}
      className="pmr-focus-ring flex shrink-0 items-center gap-2 rounded-lg"
      aria-label={`${PMR_SITE} — Home`}
    >
      <PmrIcon name="pets" className="text-xl text-[var(--pmr-terracotta)]" />
      <span
        className="text-base font-bold tracking-tight text-[var(--pmr-brown)] md:text-lg"
        style={pmrDisplay}
      >
        {PMR_SITE}
      </span>
    </Link>
  );
}

export function PawsMatchNav() {
  const pathname = usePathname();
  const { isLoggedIn, hydrated, logout, user } = usePawsMatchAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const headerClass = `fixed inset-x-0 template-demo-fixed-nav z-50 transition-all duration-300 ${
    scrolled ? "pmr-nav-scrolled" : "bg-[var(--pmr-bg)]/80 backdrop-blur-sm"
  }`;

  const applyHref = hydrated && isLoggedIn ? PMR_PATHS.pets : PMR_PATHS.login;

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-[4.5rem] max-w-[var(--pmr-container)] items-center gap-4 px-5 lg:px-10">
        <PmrLogoLink />

        <nav className="hidden flex-1 items-center justify-center gap-6 lg:flex" aria-label="Primary">
          {PMR_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="pmr-focus-ring rounded-md text-sm font-medium text-[var(--pmr-brown-muted)] transition-colors hover:text-[var(--pmr-terracotta)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {hydrated && isLoggedIn ? (
            <>
              {isPmrAdminUser(user) ? (
                <Link
                  href={PMR_PATHS.admin}
                  className="pmr-focus-ring hidden text-sm font-semibold text-[var(--pmr-terracotta)] sm:inline"
                >
                  Admin
                </Link>
              ) : (
                <Link
                  href={PMR_PATHS.account}
                  className="pmr-focus-ring hidden text-sm font-semibold text-[var(--pmr-brown-muted)] sm:inline"
                >
                  My profile
                </Link>
              )}
            </>
          ) : hydrated ? (
            <Link
              href={PMR_PATHS.login}
              className="pmr-focus-ring hidden text-sm font-semibold text-[var(--pmr-brown-muted)] sm:inline"
            >
              Sign in
            </Link>
          ) : null}
          <PmrButton href={applyHref} className="hidden px-5 py-2.5 text-xs sm:inline-flex">
            Apply to adopt
          </PmrButton>
          <button
            type="button"
            className="pmr-focus-ring flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pmr-line)] bg-[var(--pmr-card)] text-[var(--pmr-brown)] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="pmr-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <PmrIcon name={menuOpen ? "close" : "menu"} className="text-xl" />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="pmr-mobile-menu"
          className="border-t border-[var(--pmr-line)] bg-[var(--pmr-bg)] px-5 py-6 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {PMR_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="pmr-focus-ring block rounded-lg px-3 py-3 text-base font-medium text-[var(--pmr-brown)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-[var(--pmr-line)] pt-2">
              {hydrated && isLoggedIn ? (
                <>
                  {isPmrAdminUser(user) ? (
                    <Link href={PMR_PATHS.admin} className="block px-3 py-3 text-base font-medium">
                      Admin dashboard
                    </Link>
                  ) : (
                    <Link href={PMR_PATHS.account} className="block px-3 py-3 text-base font-medium">
                      My profile
                    </Link>
                  )}
                  <button
                    type="button"
                    className="w-full px-3 py-3 text-left text-base font-medium text-[var(--pmr-brown-muted)]"
                    onClick={() => void logout()}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href={PMR_PATHS.login} className="block px-3 py-3 text-base font-medium">
                  Sign in
                </Link>
              )}
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
