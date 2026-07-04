"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { SD_FOOTER_LINKS } from "./skylineDesignsData";
import {
  isSdNavActive,
  SD_EMAIL_HREF,
  SD_NAV_ITEMS,
  SD_PATHS,
  SD_SITE,
  SD_TAGLINE,
  type SdNavKey,
} from "./skylineDesignsConfig";

const MOBILE_NAV_ID = "sd-mobile-nav";

export function SdIcon({
  name,
  className = "",
  fill = false,
  weight = 400,
  size = 24,
}: {
  name: string;
  className?: string;
  fill?: boolean;
  weight?: number;
  size?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function SdContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`sd-container ${className}`}>{children}</div>;
}

export function SdImg({
  src,
  alt,
  className = "",
  fill,
  width,
  height,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}) {
  if (fill) {
    return <Image src={src} alt={alt} fill className={className} sizes={sizes ?? "100vw"} priority={priority} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}

export function SdNav({ activeKey }: { activeKey?: SdNavKey }) {
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
      <nav
        className="sd-nav-pill template-demo-fixed-nav fixed top-4 left-1/2 z-50 flex w-[90%] -translate-x-1/2 items-center justify-between rounded-full bg-white/70 px-6 py-4 shadow-xl backdrop-blur-md md:px-8"
        aria-label="Main"
      >
        <Link href={SD_PATHS.home} className="sd-headline-md shrink-0 font-extrabold text-[var(--sd-primary)]">
          {SD_SITE}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {SD_NAV_ITEMS.map((item) => {
            const active = activeKey ? item.key === activeKey : isSdNavActive(pathname, item.key);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`sd-body-md transition-colors ${
                  active
                    ? "border-b-2 border-[var(--sd-primary)] pb-1 font-bold text-[var(--sd-primary)]"
                    : "text-[var(--sd-on-surface-variant)] hover:text-[var(--sd-primary)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={SD_PATHS.contact}
            className="sd-label-md hidden rounded-full bg-[var(--sd-primary)] px-6 py-2 text-[var(--sd-on-primary)] transition-all hover:scale-105 active:scale-95 sm:inline-flex"
          >
            Get in Touch
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--sd-outline-variant)] md:hidden"
            aria-expanded={open}
            aria-controls={MOBILE_NAV_ID}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <nav
          id={MOBILE_NAV_ID}
          className="fixed inset-x-4 top-24 z-50 rounded-2xl border border-[var(--sd-surface-dim)] bg-white/95 p-4 shadow-2xl backdrop-blur-md md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {SD_NAV_ITEMS.map((item) => {
              const active = activeKey ? item.key === activeKey : isSdNavActive(pathname, item.key);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className={`block rounded-xl px-4 py-3 sd-body-md ${
                      active
                        ? "bg-[var(--sd-primary-fixed)] font-bold text-[var(--sd-primary)]"
                        : "text-[var(--sd-on-surface-variant)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link
                href={SD_PATHS.contact}
                onClick={close}
                className="block rounded-full bg-[var(--sd-primary)] px-4 py-3 text-center sd-label-md text-[var(--sd-on-primary)]"
              >
                Get in Touch
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </>
  );
}

export function SdFooter({ showCraftedBadge = false }: { showCraftedBadge?: boolean }) {
  return (
    <footer className="relative z-30 flex w-full flex-col items-center justify-between gap-8 rounded-t-xl bg-[var(--sd-surface-container-low)] px-10 py-20 md:flex-row">
      <div className={`flex flex-col gap-2 ${showCraftedBadge ? "space-y-4 text-center md:text-left" : ""}`}>
        <div className="sd-headline-md font-bold text-[var(--sd-on-surface)]">{SD_SITE}</div>
        <p className="sd-body-md max-w-xs text-[var(--sd-on-surface-variant)]">
          © 2024 {SD_SITE} • {SD_TAGLINE}
        </p>
      </div>
      <div className="flex gap-8 md:gap-12">
        {SD_FOOTER_LINKS.map((label) => (
          <a
            key={label}
            href={label === "Email Me" ? SD_EMAIL_HREF : "#"}
            className="sd-label-md text-[var(--sd-on-surface-variant)] transition-transform hover:-translate-y-0.5 hover:text-[var(--sd-primary)]"
          >
            {label}
          </a>
        ))}
      </div>
      {showCraftedBadge ? (
        <div className="sd-label-md flex items-center gap-2 text-[var(--sd-on-surface-variant)]">
          <SdIcon name="favorite" className="animate-pulse text-[var(--sd-error)]" size={16} />
          Crafted in the 6ix
        </div>
      ) : null}
    </footer>
  );
}
