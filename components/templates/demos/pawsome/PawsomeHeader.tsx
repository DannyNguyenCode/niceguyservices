"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PS_IMAGES } from "./pawsomeImages";
import { PS_NAV_ITEMS, PS_PATHS, PS_SITE, isPsNavActive } from "./pawsomeConfig";
import { PawsomeCartButton } from "./PawsomeCartButton";
import { usePawsomeAuth } from "./PawsomeAuthContext";
import { PsIcon } from "./PawsomeShared";

export type PsHeaderVariant = "default" | "minimal" | "checkout" | "back" | "task" | "success";

type PawsomeHeaderProps = {
  variant?: PsHeaderVariant;
  title?: string;
};

export function PawsomeHeader({ variant = "default", title }: PawsomeHeaderProps) {
  const pathname = usePathname();
  const { isLoggedIn } = usePawsomeAuth();

  if (variant === "success") {
    return (
      <header className="fixed top-0 z-50 w-full bg-[color-mix(in_srgb,var(--ps-surface)_80%,transparent)] shadow-[var(--ps-shadow)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 py-4">
          <h1
            className="text-2xl font-bold text-[var(--ps-primary)]"
            style={{ fontFamily: "var(--font-ps-headline)" }}
          >
            Paws &amp; Primrose
          </h1>
          <PawsomeCartButton />
        </div>
      </header>
    );
  }

  if (variant === "back" || variant === "task") {
    return (
      <header className="fixed top-0 z-50 w-full bg-[color-mix(in_srgb,var(--ps-surface)_80%,transparent)] shadow-[var(--ps-shadow)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[var(--ps-container-max)] items-center justify-between px-[var(--ps-margin-mobile)] md:px-[var(--ps-margin-desktop)]">
          <div className="flex items-center gap-4">
            <Link href={PS_PATHS.account} className="text-[var(--ps-on-surface)] active:scale-95">
              <PsIcon name="arrow_back" />
            </Link>
            <h1
              className="text-xl font-bold text-[var(--ps-on-surface)]"
              style={{ fontFamily: "var(--font-ps-headline)" }}
            >
              {title ?? PS_SITE}
            </h1>
          </div>
          {variant === "task" ? (
            <button type="button" className="text-[var(--ps-on-surface-variant)]">
              <PsIcon name="close" />
            </button>
          ) : (
            <PawsomeCartButton />
          )}
        </div>
      </header>
    );
  }

  if (variant === "checkout") {
    return (
      <header className="sticky top-0 z-50 h-16 w-full bg-[color-mix(in_srgb,var(--ps-surface)_80%,transparent)] shadow-[var(--ps-shadow)] backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[var(--ps-container-max)] items-center justify-between px-[var(--ps-margin-mobile)] md:px-[var(--ps-margin-desktop)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ps-primary-container)] text-[var(--ps-on-primary)]">
              <PsIcon name="pets" />
            </div>
            <h1
              className="text-xl font-bold text-[var(--ps-primary)]"
              style={{ fontFamily: "var(--font-ps-headline)" }}
            >
              {PS_SITE}
            </h1>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <span className="text-sm font-semibold tracking-wide text-[var(--ps-primary)]">
              Secure Checkout
            </span>
            <div className="h-4 w-px bg-[var(--ps-outline-variant)]" />
            <div className="flex items-center gap-2 text-[var(--ps-on-surface-variant)]">
              <PsIcon name="lock" className="text-sm" />
              <span className="text-xs font-medium uppercase tracking-widest">SSL Encrypted</span>
            </div>
          </div>
          <PawsomeCartButton />
        </div>
      </header>
    );
  }

  if (variant === "minimal") {
    return (
      <header className="sticky top-0 z-50 bg-[color-mix(in_srgb,var(--ps-surface)_80%,transparent)] shadow-[var(--ps-shadow)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[var(--ps-container-max)] items-center justify-between px-[var(--ps-margin-mobile)] md:px-[var(--ps-margin-desktop)]">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PS_IMAGES.lunaAvatar}
              alt=""
              className="h-10 w-10 rounded-full border-2 border-[color-mix(in_srgb,var(--ps-primary)_10%,transparent)] object-cover"
            />
            <span
              className="text-xl font-bold text-[var(--ps-primary)]"
              style={{ fontFamily: "var(--font-ps-headline)" }}
            >
              {PS_SITE}
            </span>
          </div>
          <PawsomeCartButton />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-[color-mix(in_srgb,var(--ps-surface)_80%,transparent)] shadow-[var(--ps-shadow)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[var(--ps-container-max)] items-center justify-between px-[var(--ps-margin-mobile)] md:px-[var(--ps-margin-desktop)]">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PS_IMAGES.lunaAvatar}
            alt=""
            className="h-10 w-10 overflow-hidden rounded-full bg-[var(--ps-surface-container-highest)] object-cover"
          />
          <span
            className="text-xl font-bold tracking-tight text-[var(--ps-primary)]"
            style={{ fontFamily: "var(--font-ps-headline)" }}
          >
            {PS_SITE}
          </span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          {PS_NAV_ITEMS.map((item) => {
            const active = isPsNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold tracking-wide transition-colors ${
                  active
                    ? "bg-[color-mix(in_srgb,var(--ps-secondary-container)_10%,transparent)] font-bold text-[var(--ps-primary)]"
                    : "text-[var(--ps-on-surface-variant)] hover:bg-[var(--ps-surface-container-high)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href={isLoggedIn ? PS_PATHS.account : PS_PATHS.login}
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[var(--ps-secondary)] hover:underline sm:inline"
          >
            {isLoggedIn ? "Account" : "Sign in"}
          </Link>
          <PawsomeCartButton />
        </div>
      </div>
    </header>
  );
}
