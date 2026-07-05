"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  CFH_NAV_ITEMS,
  CFH_PATHS,
  CFH_SERVICE_LINKS,
  CFH_SITE_NAME,
  cfhPath,
  isCfhNavActive,
  type CfhNavKey,
} from "../comfortflowHvacConfig";
import { CfhIcon } from "../ComfortflowHvacShared";
import { CFH_SITE } from "../comfortflowHvacSiteContent";
import { CFH_HOME_PALETTE } from "./cfhHomeData";

const MOBILE_NAV_ID = "cfh-home-mobile-nav";

function navLinkClass(active: boolean) {
  return active
    ? "border-b-2 border-[#38BDF8] pb-0.5 text-[#1F2937]"
    : "text-[#64748B] hover:text-[#1F2937]";
}

export function Header({ activeKey }: { activeKey?: CfhNavKey }) {
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

  return (
    <>
      <a href="#cfh-main-content" className="cfh-skip-link">
        Skip to main content
      </a>
      <header className="template-demo-sticky-nav sticky top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-4 md:px-6">
          <Link href={CFH_PATHS.home} className="cfh-interactive flex min-w-0 items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${CFH_HOME_PALETTE.cooling}22`, color: CFH_HOME_PALETTE.cooling }}
            >
              <CfhIcon name="home" className="text-[22px]" fill />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[17px] font-bold leading-tight text-[#1F2937]">
                {CFH_SITE_NAME}
              </span>
              <span className="hidden truncate text-[11px] font-medium text-[#64748B] sm:block">
                Your Home. Our Expertise. Total Comfort.
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
            {CFH_NAV_ITEMS.map((item) => {
              if (item.key === "services") {
                const active = activeKey ? item.key === activeKey : isCfhNavActive(pathname, "services");
                return (
                  <div key={item.key} className="group relative py-4">
                    <Link
                      href={item.href}
                      className={`cfh-interactive inline-flex items-center gap-0.5 text-[15px] font-medium transition-colors ${navLinkClass(active)}`}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <CfhIcon name="expand_more" className="text-[16px]" />
                    </Link>
                    <div className="invisible absolute left-1/2 top-full z-50 w-[min(560px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-[#E5E7EB] bg-white p-6 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                            Climate Control
                          </p>
                          <ul className="space-y-2.5">
                            {CFH_SERVICE_LINKS.slice(0, 3).map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  className="cfh-interactive flex items-center gap-2.5 text-[14px] text-[#64748B] transition-colors hover:text-[#38BDF8]"
                                >
                                  <span className={`h-2 w-2 shrink-0 rounded-full ${link.dot}`} />
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94A3B8]">
                            Infrastructure
                          </p>
                          <ul className="space-y-2.5">
                            {CFH_SERVICE_LINKS.slice(3).map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  className="cfh-interactive flex items-center gap-2.5 text-[14px] text-[#64748B] transition-colors hover:text-[#38BDF8]"
                                >
                                  <span className={`h-2 w-2 shrink-0 rounded-full ${link.dot}`} />
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              const active = activeKey ? item.key === activeKey : isCfhNavActive(pathname, item.key);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`cfh-interactive text-[15px] font-medium transition-colors ${navLinkClass(active)}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={cfhPath(CFH_SITE.primaryCTA.href)}
              className="cfh-interactive hidden items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 sm:inline-flex"
              style={{ backgroundColor: CFH_HOME_PALETTE.cooling }}
            >
              <CfhIcon name="event" className="text-[18px]" />
              {CFH_SITE.primaryCTA.label}
            </Link>
            <button
              type="button"
              className="cfh-interactive inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#1F2937] md:hidden"
              aria-expanded={open}
              aria-controls={MOBILE_NAV_ID}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav
            id={MOBILE_NAV_ID}
            className="border-t border-[#E5E7EB] bg-white px-4 py-4 md:hidden"
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-1">
              {CFH_NAV_ITEMS.map((item) => {
                const active = activeKey ? item.key === activeKey : isCfhNavActive(pathname, item.key);

                if (item.key === "services") {
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className={`cfh-interactive block rounded-lg px-4 py-3 text-[15px] ${
                          active ? "bg-[#F5F7FA] font-semibold text-[#1F2937]" : "text-[#64748B]"
                        }`}
                      >
                        {item.label}
                      </Link>
                      <ul className="mb-1 ml-3 space-y-1 border-l border-[#E5E7EB] pl-3">
                        {CFH_SERVICE_LINKS.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={close}
                              className="cfh-interactive flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] text-[#64748B] hover:bg-[#F5F7FA] hover:text-[#1F2937]"
                            >
                              <span className={`h-2 w-2 shrink-0 rounded-full ${link.dot}`} />
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className={`cfh-interactive block rounded-lg px-4 py-3 text-[15px] ${
                        active ? "bg-[#F5F7FA] font-semibold text-[#1F2937]" : "text-[#64748B]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-2">
                <Link
                  href={cfhPath(CFH_SITE.primaryCTA.href)}
                  onClick={close}
                  className="cfh-interactive block rounded-lg px-4 py-3 text-center text-[15px] font-semibold text-white"
                  style={{ backgroundColor: CFH_HOME_PALETTE.cooling }}
                >
                  {CFH_SITE.primaryCTA.label}
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>
    </>
  );
}
