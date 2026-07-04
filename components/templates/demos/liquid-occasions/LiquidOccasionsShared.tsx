"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import {
  isLoNavActive,
  LO_NAV_ITEMS,
  LO_PATHS,
  LO_SITE,
} from "./liquidOccasionsConfig";

export const loDisplay: CSSProperties = {
  fontFamily: "var(--font-lo-display), ui-serif, Georgia, serif",
};

export const loBody: CSSProperties = {
  fontFamily: "var(--font-lo-body), ui-sans-serif, system-ui, sans-serif",
};

export function LoIcon({
  name,
  className = "",
  weight = 400,
}: {
  name: string;
  className?: string;
  weight?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' 0, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24` }}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function LoNav({ ctaVariant = "primary" }: { ctaVariant?: "primary" | "container" }) {
  const pathname = usePathname();

  const ctaClass =
    ctaVariant === "container"
      ? "bg-[var(--lo-primary-container)] text-[var(--lo-on-primary-container)] px-6 py-2 rounded-full lo-label scale-105 active:scale-95 transition-transform hover:shadow-lg"
      : "bg-[var(--lo-primary)] text-[var(--lo-on-primary)] px-6 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform";

  return (
    <header className="template-demo-fixed-nav fixed left-0 right-0 z-50 mx-auto mt-6 flex w-[90%] max-w-5xl items-center justify-between rounded-full bg-[color-mix(in_srgb,var(--lo-surface)_80%,transparent)] px-8 py-3 shadow-xl shadow-[color-mix(in_srgb,var(--lo-on-surface)_5%,transparent)] backdrop-blur-lg">
      <Link href={LO_PATHS.home} className="lo-headline-md text-[var(--lo-primary)]">
        {LO_SITE}
      </Link>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
        {LO_NAV_ITEMS.map((item) => {
          const active = isLoNavActive(pathname, item.key);
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`lo-body-md transition-all duration-300 hover:scale-105 ${
                active
                  ? "font-bold text-[var(--lo-primary)] border-b-2 border-[var(--lo-secondary-container)] pb-1"
                  : "text-[var(--lo-on-surface-variant)] hover:text-[var(--lo-primary)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link href={LO_PATHS.journey} className={ctaClass}>
        Plan Your Event
      </Link>
    </header>
  );
}

export function LoFooter({ showAccentLine = false }: { showAccentLine?: boolean }) {
  return (
    <footer className="relative z-10 flex w-full flex-col items-center gap-2 bg-[var(--lo-surface-container-lowest)] px-[var(--lo-gutter)] pb-10 pt-20">
      <div className="lo-headline-md mb-8 text-[var(--lo-on-surface)]">{LO_SITE}</div>
      <div className="mb-12 flex gap-8 md:gap-12">
        {["Privacy Policy", "Terms of Service", "Press Kit"].map((label) => (
          <span
            key={label}
            className="lo-body-md cursor-default text-[var(--lo-on-surface-variant)] opacity-80 transition-colors hover:text-[var(--lo-secondary-fixed-dim)]"
          >
            {label}
          </span>
        ))}
      </div>
      {showAccentLine ? (
        <div className="mb-6 h-1 w-24 bg-[var(--lo-secondary-container)]" />
      ) : null}
      <p className="lo-body-md text-center text-[var(--lo-on-surface-variant)] opacity-80">
        © 2024 {LO_SITE}. Crafted for the extraordinary. Fictional demo.
      </p>
    </footer>
  );
}

export function LoContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[var(--lo-container-max)] px-[var(--lo-gutter)] ${className}`}>
      {children}
    </div>
  );
}

export function LoImg({
  src,
  alt,
  className = "",
  fill,
  width,
  height,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${className}`}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={priority}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 800}
      className={`object-cover ${className}`}
      priority={priority}
    />
  );
}

export function LoWaveDivider({
  className = "",
  flip = false,
  fillClass = "fill-[var(--lo-surface-container-low)]",
}: {
  className?: string;
  flip?: boolean;
  fillClass?: string;
}) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${className}`}>
      <svg
        className={`relative block h-[120px] w-[calc(140%+1.3px)] ${flip ? "rotate-180" : ""} ${fillClass}`}
        preserveAspectRatio="none"
        viewBox="0 0 1200 120"
        aria-hidden
      >
        <path d="M377.9,65.8c161.2,0,245.4-82.7,440.5-82.7c102.5,0,158,29.4,218,52.7c74.2,28.7,163.6,56.7,163.6,56.7V0H0v120 C0,120,216.7,65.8,377.9,65.8z" />
      </svg>
    </div>
  );
}

