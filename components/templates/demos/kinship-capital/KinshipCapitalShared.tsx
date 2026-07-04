"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import {
  isKcNavActive,
  KC_NAV_ITEMS,
  KC_PATHS,
  KC_SITE,
  KC_TAGLINE,
  type KcNavKey,
} from "./kinshipCapitalConfig";

const MOBILE_NAV_ID = "kc-mobile-nav";

export function KcIcon({
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

export function KcContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`kc-container ${className}`}>{children}</div>;
}

export function KcImg({
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

export function KcNav({ activeKey }: { activeKey?: KcNavKey }) {
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
    <header className="kc-nav template-demo-sticky-nav sticky top-0 z-50 bg-[var(--kc-surface-container-lowest)] shadow-sm">
      <KcContainer className="flex h-20 items-center justify-between gap-4">
        <Link href={KC_PATHS.home} className="kc-headline-md shrink-0 font-bold text-[var(--kc-primary)]">
          {KC_SITE}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {KC_NAV_ITEMS.map((item) => {
            const active = activeKey ? item.key === activeKey : isKcNavActive(pathname, item.key);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`kc-body-md transition-colors ${
                  active
                    ? "border-b-2 border-[var(--kc-primary)] pb-1 font-bold text-[var(--kc-primary)]"
                    : "text-[var(--kc-on-surface-variant)] hover:text-[var(--kc-primary)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={KC_PATHS.contact}
            className="hidden rounded-lg bg-[var(--kc-primary)] px-6 py-2.5 kc-label-sm text-[var(--kc-on-primary)] transition-all hover:opacity-90 active:scale-95 sm:inline-flex"
          >
            Book Consultation
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--kc-outline-variant)] md:hidden"
            aria-expanded={open}
            aria-controls={MOBILE_NAV_ID}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </KcContainer>

      {open ? (
        <nav
          id={MOBILE_NAV_ID}
          className="border-t border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container-lowest)] px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-2">
            {KC_NAV_ITEMS.map((item) => {
              const active = activeKey ? item.key === activeKey : isKcNavActive(pathname, item.key);
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className={`block rounded-lg px-4 py-3 kc-body-md ${
                      active
                        ? "bg-[var(--kc-primary-fixed)] font-bold text-[var(--kc-primary)]"
                        : "text-[var(--kc-on-surface-variant)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={KC_PATHS.contact}
                onClick={close}
                className="block rounded-lg bg-[var(--kc-primary)] px-4 py-3 text-center kc-label-sm text-[var(--kc-on-primary)]"
              >
                Book Consultation
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

export type KcFooterVariant = "home" | "contact" | "pricing" | "services" | "faq" | "about";

export function KcFooter({ variant = "home" }: { variant?: KcFooterVariant }) {
  if (variant === "services") {
    return (
      <footer className="w-full border-t border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container)] py-[var(--kc-stack-lg)]">
        <KcContainer>
          <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="kc-headline-md mb-6 font-bold text-[var(--kc-on-surface)]">{KC_SITE}</div>
              <p className="kc-body-md max-w-sm text-[var(--kc-on-surface-variant)]">
                Specialized tax and advisory services for those who view wealth as a multi-generational responsibility.
              </p>
            </div>
            <div>
              <h4 className="kc-label-sm mb-6 font-bold uppercase text-[var(--kc-on-surface)]">Navigation</h4>
              <ul className="space-y-4">
                {["Services", "About Us", "Careers", "Contact"].map((label) => (
                  <li key={label}>
                    <span className="cursor-default text-[var(--kc-on-surface-variant)] transition-opacity hover:text-[var(--kc-on-surface)]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="kc-label-sm mb-6 font-bold uppercase text-[var(--kc-on-surface)]">Legal</h4>
              <ul className="space-y-4">
                {["Privacy Policy", "Terms of Service", "Security"].map((label) => (
                  <li key={label}>
                    <span className="cursor-default text-[var(--kc-on-surface-variant)]">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <KcFooterBottom />
        </KcContainer>
      </footer>
    );
  }

  if (variant === "faq") {
    return (
      <footer className="border-t border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container)]">
        <KcContainer className="py-[var(--kc-stack-lg)]">
          <div className="mb-12 grid grid-cols-1 gap-[var(--kc-gutter)] md:grid-cols-4">
            <div>
              <div className="kc-headline-md mb-6 font-bold text-[var(--kc-on-surface)]">{KC_SITE}</div>
              <p className="kc-body-md text-[var(--kc-on-surface-variant)]">
                Preserving wealth for the next generation through expert tax and financial governance.
              </p>
            </div>
            <div className="md:col-span-3 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { title: "SERVICES", links: ["Personal Tax", "Corporate Tax", "Trusts & Estates"] },
                { title: "RESOURCES", links: ["Tax Calendar", "Checklists", "Blog"] },
                { title: "COMPANY", links: ["Privacy Policy", "Terms of Service", "Careers"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="kc-label-sm mb-4 text-[var(--kc-primary)]">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <span className="text-[var(--kc-on-surface-variant)]">{link}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <h4 className="kc-label-sm mb-4 text-[var(--kc-primary)]">CONNECT</h4>
                <div className="flex gap-4">
                  {["linked_camera", "person_search", "mail"].map((icon) => (
                    <KcIcon key={icon} name={icon} className="cursor-pointer text-[var(--kc-on-surface-variant)] hover:text-[var(--kc-primary)]" />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <KcFooterBottom showShield />
        </KcContainer>
      </footer>
    );
  }

  if (variant === "about") {
    return (
      <footer className="border-t border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container)]">
        <KcContainer className="py-[var(--kc-stack-lg)]">
          <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="kc-headline-md mb-6 font-bold text-[var(--kc-on-surface)]">{KC_SITE}</div>
              <p className="max-w-md text-[var(--kc-on-surface-variant)]">
                The modern financial marketplace for families who value legacy above all else. Concierge services designed
                for the next generation.
              </p>
            </div>
            <div>
              <h5 className="mb-6 font-bold text-[var(--kc-on-surface)]">Legal</h5>
              <div className="flex flex-col gap-4">
                {["Privacy Policy", "Terms of Service", "Security"].map((label) => (
                  <span key={label} className="text-[var(--kc-on-surface-variant)] hover:text-[var(--kc-on-surface)]">
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="mb-6 font-bold text-[var(--kc-on-surface)]">Company</h5>
              <div className="flex flex-col gap-4">
                {["Careers", "Our Story", "Press"].map((label) => (
                  <span key={label} className="text-[var(--kc-on-surface-variant)]">{label}</span>
                ))}
              </div>
            </div>
          </div>
          <KcFooterBottom icons={["public", "hub", "token"]} />
        </KcContainer>
      </footer>
    );
  }

  if (variant === "pricing") {
    return (
      <footer className="border-t border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container)]">
        <KcContainer className="py-[var(--kc-stack-lg)]">
          <div className="mb-12 flex flex-col items-start justify-between gap-12 md:flex-row md:items-center">
            <div>
              <div className="kc-headline-md mb-2 font-bold text-[var(--kc-on-surface)]">Heritage Family Marketplace</div>
              <p className="kc-body-md max-w-sm text-[var(--kc-on-surface-variant)]">
                Elevating family wealth management through modern technology and institutional reliability.
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              {["Privacy Policy", "Terms of Service", "Security", "Careers"].map((label) => (
                <span key={label} className="kc-label-sm cursor-default text-[var(--kc-on-surface-variant)] hover:text-[var(--kc-on-surface)]">
                  {label}
                </span>
              ))}
            </div>
          </div>
          <KcFooterBottom icons={["public", "hub", "share"]} />
        </KcContainer>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[var(--kc-outline-variant)] bg-[var(--kc-surface-container)]">
      <KcContainer className="py-[var(--kc-stack-lg)]">
        <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className={variant === "contact" ? "max-w-md" : "max-w-xs"}>
            <div className="kc-headline-md mb-4 font-bold text-[var(--kc-on-surface)]">{KC_SITE}</div>
            <p className="kc-body-md text-[var(--kc-on-surface-variant)]">
              {variant === "contact"
                ? "Institutional excellence meets familial care. Serving legacy wealth through concierge strategy."
                : "Precision accounting for families who build legacy. Member AICPA."}
            </p>
          </div>
          <div className={variant === "home" ? "grid grid-cols-2 gap-16" : "grid grid-cols-2 gap-x-12 gap-y-4"}>
            {variant === "home" ? (
              <>
                <div className="space-y-4">
                  <h4 className="font-bold text-[var(--kc-on-surface)]">Company</h4>
                  <ul className="space-y-2">
                    {["Privacy Policy", "Terms of Service", "Security", "Careers"].map((label) => (
                      <li key={label}>
                        <span className="text-sm text-[var(--kc-on-surface-variant)]">{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-[var(--kc-on-surface)]">Social</h4>
                  <ul className="space-y-2">
                    {["LinkedIn", "Twitter", "Instagram"].map((label) => (
                      <li key={label}>
                        <span className="text-sm text-[var(--kc-on-surface-variant)]">{label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              ["Privacy Policy", "Terms of Service", "Security", "Careers"].map((label) => (
                <span key={label} className="kc-label-sm text-[var(--kc-on-surface-variant)]">
                  {label}
                </span>
              ))
            )}
          </div>
        </div>
        <KcFooterBottom icons={variant === "contact" ? ["public", "share"] : undefined} />
      </KcContainer>
    </footer>
  );
}

function KcFooterBottom({
  icons,
  showShield,
}: {
  icons?: string[];
  showShield?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--kc-outline-variant)]/30 pt-8 md:flex-row">
      <p className="kc-label-sm text-center text-[var(--kc-on-surface-variant)] md:text-left">
        © 2024 Heritage Family Marketplace. All rights reserved. Certified Public Accountants.
      </p>
      <div className="flex gap-4 md:gap-6">
        {showShield ? (
          <>
            <KcIcon name="shield" className="text-2xl text-[var(--kc-primary)]" fill />
            <KcIcon name="lock" className="text-2xl text-[var(--kc-primary)]" fill />
          </>
        ) : icons ? (
          icons.map((icon) => (
            <KcIcon
              key={icon}
              name={icon}
              className="cursor-pointer text-[var(--kc-outline)] transition-colors hover:text-[var(--kc-primary)]"
            />
          ))
        ) : null}
      </div>
    </div>
  );
}

export function KcBrandPill() {
  return (
    <span className="inline-block rounded-full bg-[var(--kc-primary-fixed)] px-3 py-1 kc-label-sm text-[var(--kc-on-primary-fixed)]">
      {KC_TAGLINE}
    </span>
  );
}
