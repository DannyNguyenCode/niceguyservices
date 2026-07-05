"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  isPpeNavActive,
  PPE_NAV_ITEMS,
  PPE_PATHS,
  PPE_SITE_NAME,
  ppePath,
  type PpeNavKey,
} from "./powerPelletElectricConfig";
import { PPE_FOOTER_LINKS, PPE_MOBILE_NAV, PPE_SITE } from "./powerPelletElectricSiteContent";

export function PpeIcon({
  name,
  className = "",
  fill = false,
  weight = 400,
}: {
  name: string;
  className?: string;
  fill?: boolean;
  weight?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined notranslate ${className}`}
      style={{
        fontFamily: '"Material Symbols Outlined", sans-serif',
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function PpeContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`ppe-container ${className}`}>{children}</div>;
}

export function PpeImg({
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
    return (
      <Image src={src} alt={alt} fill className={className} sizes={sizes ?? "100vw"} priority={priority} />
    );
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

const navLinkClass = (active: boolean) =>
  [
    "ppe-label-caps ppe-interactive transition-all duration-300",
    active
      ? "border-b-2 border-[var(--ppe-primary-fixed)] pb-1 font-bold text-[var(--ppe-primary-fixed)]"
      : "text-[var(--ppe-on-surface-variant)] hover:text-[var(--ppe-secondary)] hover:drop-shadow-[0_0_8px_#ffaaf7]",
  ].join(" ");

export function PpeNav({ activeKey }: { activeKey?: PpeNavKey }) {
  const pathname = usePathname();

  return (
    <>
      <a href="#ppe-main-content" className="ppe-skip-link">
        Skip to main content
      </a>
      <header className="template-demo-sticky-nav fixed inset-x-0 top-0 z-50 w-full max-w-[100vw] border-b-2 border-[var(--ppe-on-tertiary-container)] bg-[color-mix(in_srgb,var(--ppe-surface)_95%,transparent)] shadow-[0_0_15px_rgba(233,234,0,0.3)] backdrop-blur-sm">
        <div className="flex w-full items-center justify-between gap-2 px-[var(--ppe-margin-mobile)] py-3 sm:gap-3 sm:py-4 md:px-[var(--ppe-margin-desktop)]">
          <Link
            href={PPE_PATHS.home}
            className="ppe-interactive min-w-0 flex-1 truncate font-bold uppercase tracking-tighter text-[var(--ppe-primary-fixed)] sm:text-base lg:flex-none lg:text-2xl"
            style={{ fontFamily: "var(--font-ppe-headline), Space Grotesk, system-ui, sans-serif" }}
          >
            {PPE_SITE_NAME}
          </Link>

          <nav className="hidden shrink-0 items-center gap-4 lg:flex lg:gap-6 xl:gap-8" aria-label="Main">
            {PPE_NAV_ITEMS.map((item) => {
              const active = activeKey ? item.key === activeKey : isPpeNavActive(pathname, item.key);
              return (
                <Link key={item.key} href={item.href} className={navLinkClass(active)}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href={ppePath(PPE_SITE.primaryCTA.href)}
            className="ppe-label-caps ppe-interactive inline-flex shrink-0 items-center rounded-full bg-[var(--ppe-primary-container)] px-3 py-1.5 text-[10px] font-bold text-[var(--ppe-on-primary-container)] transition-transform hover:scale-105 active:scale-95 sm:px-4 sm:py-2 sm:text-xs lg:px-6 ppe-neon-glow-yellow"
          >
            <span className="sm:hidden">Get A Quote</span>
            <span className="hidden sm:inline">{PPE_SITE.primaryCTA.label}</span>
          </Link>
        </div>
      </header>

      <PpeBottomNav pathname={pathname} activeKey={activeKey} />
    </>
  );
}

const PPE_MOBILE_HREF: Record<string, string> = {
  home: PPE_PATHS.home,
  services: PPE_PATHS.services,
  contact: PPE_PATHS.contact,
  about: PPE_PATHS.about,
};

function PpeBottomNav({ pathname, activeKey }: { pathname: string; activeKey?: PpeNavKey }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex min-h-16 w-full max-w-[100vw] items-stretch justify-center border-t-2 border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-surface-container)] pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
      aria-label="Mobile navigation"
    >
      {PPE_MOBILE_NAV.map((item) => {
        const href = PPE_MOBILE_HREF[item.key] ?? PPE_PATHS.home;
        const active = activeKey ? item.key === activeKey : isPpeNavActive(pathname, item.key as PpeNavKey);
        return (
          <Link
            key={item.key}
            href={href}
            className={`ppe-interactive flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 sm:px-2 ${active ? "text-[var(--ppe-secondary)]" : "text-[var(--ppe-on-surface-variant)]"
              }`}
            aria-current={active ? "page" : undefined}
          >
            <PpeIcon name={item.icon} fill={active} className="text-xl sm:text-2xl" />
            <span className="ppe-label-caps max-w-full truncate text-[9px] sm:text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function PpeFooter() {
  return (
    <footer className="border-t-2 border-dotted border-[var(--ppe-on-tertiary-container)] bg-[var(--ppe-surface-container-lowest)] px-[var(--ppe-margin-mobile)] py-12 text-[var(--ppe-tertiary-fixed-dim)] md:px-[var(--ppe-margin-desktop)]">
      <PpeContainer className="flex flex-col items-center justify-between gap-[var(--ppe-gutter)] md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="ppe-headline-md font-bold uppercase tracking-tighter text-[var(--ppe-secondary)]">
            {PPE_SITE_NAME}
          </div>
          <p className="ppe-body-md text-center text-[var(--ppe-on-surface-variant)] md:text-left">
            {PPE_SITE.copyright}
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8" aria-label="Footer">
          {PPE_FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href.startsWith("/") ? ppePath(link.href) : link.href}
              className={`ppe-label-caps ppe-interactive transition-colors ${link.highlight
                  ? "text-[var(--ppe-secondary)] hover:text-[var(--ppe-primary-fixed)]"
                  : "text-[var(--ppe-on-surface-variant)] hover:text-[var(--ppe-primary-fixed)]"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </PpeContainer>
    </footer>
  );
}

export function PpeScanline() {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let frame = 0;
    let y = 0;

    const tick = () => {
      y += 2;
      if (y > window.innerHeight) y = 0;
      setPos(y);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className="ppe-scanline"
      aria-hidden
      style={{ transform: `translateY(${pos}px)` }}
    />
  );
}

export function usePpeFormLabelFocus(formId: string) {
  useEffect(() => {
    const form = document.getElementById(formId);
    if (!form) return;

    const fields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea",
    );

    const handlers: Array<{ el: Element; focus: () => void; blur: () => void }> = [];

    fields.forEach((input) => {
      const label = input.parentElement?.querySelector("label");
      if (!label) return;

      const onFocus = () => {
        label.classList.add("ppe-input-label-focus");
        label.classList.remove("text-[var(--ppe-on-surface-variant)]");
      };
      const onBlur = () => {
        label.classList.remove("ppe-input-label-focus");
        label.classList.add("text-[var(--ppe-on-surface-variant)]");
      };

      input.addEventListener("focus", onFocus);
      input.addEventListener("blur", onBlur);
      handlers.push({ el: input, focus: onFocus, blur: onBlur });
    });

    return () => {
      handlers.forEach(({ el, focus, blur }) => {
        el.removeEventListener("focus", focus);
        el.removeEventListener("blur", blur);
      });
    };
  }, [formId]);
}

export function PpeCtaLink({
  href,
  children,
  className = "",
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "emergency";
}) {
  const variants = {
    primary:
      "bg-[var(--ppe-primary-container)] text-[var(--ppe-on-primary)] ppe-neon-glow-yellow hover:scale-105 active:scale-95",
    secondary:
      "border-2 border-[var(--ppe-secondary)] text-[var(--ppe-secondary)] hover:bg-[color-mix(in_srgb,var(--ppe-secondary)_10%,transparent)]",
    outline:
      "border-2 border-[var(--ppe-secondary)] text-[var(--ppe-secondary)] hover:bg-[var(--ppe-secondary)] hover:text-[var(--ppe-on-secondary)]",
    emergency:
      "border-2 border-[var(--ppe-error)] text-[var(--ppe-error)] ppe-neon-glow-red hover:bg-[color-mix(in_srgb,var(--ppe-error-container)_20%,transparent)]",
  };

  return (
    <Link href={ppePath(href)} className={`ppe-interactive inline-flex items-center justify-center gap-2 transition-all ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
