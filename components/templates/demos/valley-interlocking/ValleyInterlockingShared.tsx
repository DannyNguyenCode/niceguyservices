"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { SocialIcon } from "react-social-icons";
import type { ReactNode } from "react";
import { Fragment } from "react";
import {
  isViLocationPath,
  isViNavActive,
  VI_NAV_ITEMS,
  VI_NAV_SERVICES,
  VI_PATHS,
  VI_PRIMARY_PHONE,
  VI_PRIMARY_PHONE_HREF,
  VI_EMAIL,
  VI_SOCIAL_LINKS,
  VI_SITE,
  VI_SITE_LINE1,
  VI_SITE_LINE2,
  type ViNavKey,
} from "./valleyInterlockingConfig";
import { useViFocusTrap } from "./useViEffects";
import { ViMobileNavGroup, ViNavDropdown } from "./ViNavDropdown";

const MOBILE_NAV_ID = "vi-mobile-nav";

export function ViSkipLink() {
  return (
    <a href="#vi-main-content" className="vi-skip-link">
      Skip to main content
    </a>
  );
}

export function ViIcon({
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
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function ViContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`vi-container ${className}`}>{children}</div>;
}

export const VI_HERO_CTA_PRIMARY =
  "vi-hero-cta vi-hero-cta--primary inline-flex items-center rounded-lg px-8 py-4 vi-label-md uppercase tracking-wider transition-opacity hover:opacity-90";

export const VI_HERO_CTA_SECONDARY =
  "vi-hero-cta vi-hero-cta--secondary inline-flex items-center rounded-lg border-2 px-8 py-4 vi-label-md uppercase tracking-wider transition-all hover:bg-[var(--vi-on-primary)] hover:text-[var(--vi-primary)]";

export function ViHeroContentPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`vi-hero-content${className ? ` ${className}` : ""}`}>{children}</div>;
}

export function ViImg({
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
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes ?? "100vw"}
        priority={priority}
        quality={priority ? 85 : 75}
        loading={priority ? "eager" : "lazy"}
      />
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
      quality={priority ? 85 : 75}
      loading={priority ? "eager" : "lazy"}
    />
  );
}

export function ViGoogleReviewBadge({ className = "", light = false }: { className?: string; light?: boolean }) {
  const starClass = light ? "text-[var(--vi-secondary)]" : "text-[var(--vi-secondary)]";
  const labelClass = light ? "text-[var(--vi-primary)]" : "text-white";
  const containerClass = light
    ? "border border-[var(--vi-outline-variant)] bg-white"
    : "border border-white/20 bg-white/10 backdrop-blur-md";

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-6 py-3 ${containerClass} ${className}`}
      role="img"
      aria-label="5 out of 5 stars on Google, 42 reviews, rated Excellent"
    >
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <ViIcon key={i} name="star" className={starClass} fill />
        ))}
      </div>
      <span className={`vi-label-md ${labelClass}`}>5.0 Google Rating</span>
    </div>
  );
}

export function ViTopBar() {
  return (
    <div className="vi-top-bar" aria-label="Contact and social">
      <ViContainer className="vi-top-bar__inner">
        <div className="vi-top-bar__contact">
          <a href={VI_PRIMARY_PHONE_HREF}>{VI_PRIMARY_PHONE}</a>
          <span className="vi-top-bar__divider" aria-hidden>
            |
          </span>
          <a href={`mailto:${VI_EMAIL}`} className="vi-top-bar__email">
            {VI_EMAIL}
          </a>
        </div>
        <div className="vi-top-bar__socials">
          <SocialIcon
            url={VI_SOCIAL_LINKS.facebook}
            network="facebook"
            target="_blank"
            rel="noopener noreferrer"
            fgColor="#ffffff"
            bgColor="transparent"
            className="vi-top-bar__social-icon"
            style={{ height: 28, width: 28 }}
          />
          <SocialIcon
            url={VI_SOCIAL_LINKS.instagram}
            network="instagram"
            target="_blank"
            rel="noopener noreferrer"
            fgColor="#ffffff"
            bgColor="transparent"
            className="vi-top-bar__social-icon"
            style={{ height: 28, width: 28 }}
          />
        </div>
      </ViContainer>
    </div>
  );
}

export function ViNav({ activeKey }: { activeKey?: ViNavKey }) {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState({ open: false, atPath: "" });
  const open = mobileMenu.open && mobileMenu.atPath === pathname;
  const mobileNavRef = useRef<HTMLElement>(null);
  const [dropdownMenu, setDropdownMenu] = useState<{
    key: "services" | "locations" | null;
    atPath: string;
  }>({ key: null, atPath: pathname });
  const openDropdown = dropdownMenu.atPath === pathname ? dropdownMenu.key : null;
  const setOpenDropdown = useCallback(
    (key: "services" | "locations" | null) => {
      setDropdownMenu({ key, atPath: pathname });
    },
    [pathname],
  );
  const close = useCallback(() => setMobileMenu({ open: false, atPath: pathname }), [pathname]);

  useViFocusTrap(mobileNavRef, open);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const navItems = VI_NAV_ITEMS.filter(
    (item) => item.key !== "locations" && item.key !== "services" && item.key !== "quote",
  );
  const quoteNav = VI_NAV_ITEMS.find((item) => item.key === "quote")!;
  const path = pathname.replace(/\/$/, "") || "/";
  const locationLinks = [
    { label: "Toronto", href: VI_PATHS.toronto },
    { label: "Edmonton", href: VI_PATHS.edmonton },
  ];
  const servicesActive = activeKey ? activeKey === "services" : isViNavActive(pathname, "services");
  const quoteActive = activeKey ? activeKey === "quote" : isViNavActive(pathname, "quote");
  const locationsActive = activeKey ? activeKey === "locations" : isViLocationPath(pathname);
  const navLinkClass = (active: boolean) =>
    active
      ? "border-b-2 border-[var(--vi-primary)] pb-1 text-[var(--vi-primary)]"
      : "text-[var(--vi-on-surface-variant)] hover:text-[var(--vi-primary)]";

  const renderQuoteCta = (className = "", onNavigate?: () => void) => (
    <Link
      href={quoteNav.href}
      aria-current={quoteActive ? "page" : undefined}
      className={`vi-nav-cta ${className}`.trim()}
      onClick={onNavigate}
    >
      {quoteNav.label}
    </Link>
  );

  return (
    <>
      <ViSkipLink />
      <header className="vi-header template-demo-fixed-nav fixed top-0 left-0 z-50 w-full">
        <ViTopBar />
        <nav
          className="vi-nav relative flex h-[var(--vi-main-nav-height)] w-full items-stretch bg-[var(--vi-background)] shadow-sm"
          aria-label="Primary"
        >
        <ViContainer className="flex h-full w-full items-center gap-2 xl:gap-4">
          <button
            type="button"
            className="vi-nav-menu-button order-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--vi-primary)] xl:hidden"
            aria-expanded={open}
            aria-controls={MOBILE_NAV_ID}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => {
              setOpenDropdown(null);
              setMobileMenu((m) =>
                m.open && m.atPath === pathname ? { open: false, atPath: pathname } : { open: true, atPath: pathname },
              );
            }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href={VI_PATHS.home}
            className="vi-site-brand vi-headline-md order-2 min-w-0 flex-1 font-bold text-[var(--vi-primary)] xl:order-none xl:flex-none xl:shrink-0"
            aria-label={VI_SITE}
          >
            <span className="block leading-tight">{VI_SITE_LINE1}</span>
            <span className="block leading-tight">{VI_SITE_LINE2}</span>
          </Link>

          <div className="order-4 hidden min-w-0 flex-1 items-center justify-center gap-4 xl:order-none xl:flex xl:gap-5">
            {navItems.map((item) => {
              const active = activeKey ? item.key === activeKey : isViNavActive(pathname, item.key);
              if (item.key === "gallery") {
                return (
                  <span key="nav-dropdowns" className="contents">
                    <ViNavDropdown
                      menuKey="services"
                      label="Services"
                      href={VI_PATHS.services}
                      links={VI_NAV_SERVICES}
                      active={servicesActive}
                      open={openDropdown === "services"}
                      onOpenChange={(isOpen) => setOpenDropdown(isOpen ? "services" : null)}
                      currentPath={path}
                      navLinkClass={navLinkClass}
                    />
                    <Link
                      key={item.key}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`vi-label-md transition-colors duration-200 ${navLinkClass(active)}`}
                    >
                      {item.label}
                    </Link>
                  </span>
                );
              }
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`vi-label-md transition-colors duration-200 ${navLinkClass(active)}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <ViNavDropdown
              menuKey="locations"
              label="Locations"
              href={VI_PATHS.toronto}
              links={locationLinks}
              active={locationsActive}
              open={openDropdown === "locations"}
              onOpenChange={(isOpen) => setOpenDropdown(isOpen ? "locations" : null)}
              currentPath={path}
              navLinkClass={navLinkClass}
            />
          </div>

          <div className="order-3 flex shrink-0 items-center justify-end gap-2 xl:order-none">
            {renderQuoteCta("vi-nav-cta--header", close)}
          </div>
        </ViContainer>

        {open ? (
          <nav
            id={MOBILE_NAV_ID}
            ref={mobileNavRef}
            className="absolute top-full left-0 max-h-[calc(100dvh-var(--vi-nav-height))] w-full overflow-y-auto border-t border-[var(--vi-outline-variant)] bg-[var(--vi-background)] px-4 py-4 xl:hidden"
            aria-label="Main navigation"
          >
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => {
                const active = activeKey ? item.key === activeKey : isViNavActive(pathname, item.key);
                if (item.key === "gallery") {
                  return (
                    <Fragment key="nav-services-gallery">
                      <ViMobileNavGroup
                        key={`services-${path}`}
                        label="Services"
                        href={VI_PATHS.services}
                        links={VI_NAV_SERVICES}
                        currentPath={path}
                        defaultExpanded={servicesActive}
                        onNavigate={close}
                      />
                      <li>
                        <Link
                          href={item.href}
                          onClick={close}
                          aria-current={active ? "page" : undefined}
                          className={`block min-h-[2.75rem] rounded-lg px-4 py-3 vi-body-md ${
                            active
                              ? "bg-[var(--vi-primary-fixed)] font-bold text-[var(--vi-primary)]"
                              : "text-[var(--vi-on-surface-variant)]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    </Fragment>
                  );
                }
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={`block min-h-[2.75rem] rounded-lg px-4 py-3 vi-body-md ${
                        active
                          ? "bg-[var(--vi-primary-fixed)] font-bold text-[var(--vi-primary)]"
                          : "text-[var(--vi-on-surface-variant)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <ViMobileNavGroup
                key={`locations-${path}`}
                label="Locations"
                href={VI_PATHS.toronto}
                links={locationLinks}
                currentPath={path}
                defaultExpanded={locationsActive}
                onNavigate={close}
              />
              <li className="mt-2 border-t border-[var(--vi-outline-variant)] pt-4">
                {renderQuoteCta("vi-nav-cta--block", close)}
              </li>
            </ul>
          </nav>
        ) : null}
        </nav>
      </header>
    </>
  );
}
