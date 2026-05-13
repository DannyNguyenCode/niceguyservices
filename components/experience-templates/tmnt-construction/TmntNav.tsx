"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TMNT_BASE } from "./tmntConfig";

const NAV = [
  { href: TMNT_BASE, label: "Home", short: "HOME", icon: "home" },
  { href: `${TMNT_BASE}/services`, label: "Services", short: "SERVICES", icon: "construction" },
  { href: `${TMNT_BASE}/projects`, label: "Projects", short: "PROJECTS", icon: "photo_library" },
  { href: `${TMNT_BASE}/about`, label: "About", short: "ABOUT", icon: "groups" },
  { href: `${TMNT_BASE}/testimonials`, label: "Reviews", short: "REVIEWS", icon: "reviews" },
  { href: `${TMNT_BASE}/faq`, label: "FAQ", short: "FAQ", icon: "quiz" },
  { href: `${TMNT_BASE}/contact`, label: "Contact", short: "CONTACT", icon: "mail" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === TMNT_BASE) {
    return pathname === TMNT_BASE || pathname === `${TMNT_BASE}/`;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TmntNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-[#bfc9be] bg-[#f1f5ee]/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-full items-center justify-between px-5 py-4 md:px-20">
          <Link href={TMNT_BASE} className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-2xl text-[#216b41] md:text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden
            >
              shield
            </span>
            <span
              className="text-xl font-black tracking-tighter text-[#216b41] md:text-4xl"
              style={{ fontFamily: "var(--font-tmnt-headline), system-ui, sans-serif" }}
            >
              PATCHLINE CREW
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="TMNT trades demo">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "border-b-2 border-[#216b41] font-bold text-[#216b41] transition-colors"
                      : "px-2 py-1 font-medium text-[#404941] transition-colors hover:bg-[#ecefe9] hover:text-[#216b41]"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href={`${TMNT_BASE}/contact`}
            className="rounded-none border-2 border-[#216b41] bg-[#216b41] px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95 md:px-6"
            style={{ fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" }}
          >
            GET QUOTE
          </Link>
        </div>
      </header>

      <nav
        className="fixed bottom-0 left-0 z-50 grid w-full grid-cols-4 border-t border-[#bfc9be] bg-[#f1f5ee]/95 py-2 shadow-[0_-4px_12px_rgba(24,29,25,0.08)] backdrop-blur-md md:hidden"
        aria-label="Mobile"
      >
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex flex-col items-center gap-0.5 border-b-2 border-[#216b41] pb-1 font-bold text-[#216b41]"
                  : "flex flex-col items-center gap-0.5 text-[#404941] transition-colors hover:text-[#216b41]"
              }
            >
              <span className="material-symbols-outlined text-[22px]" aria-hidden>
                {item.icon}
              </span>
              <span
                className="text-[9px] font-bold uppercase tracking-wider"
                style={{ fontFamily: "var(--font-tmnt-label), system-ui, sans-serif" }}
              >
                {item.short}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
