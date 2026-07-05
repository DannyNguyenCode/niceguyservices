"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type ReactNode } from "react";
import { CFH_SITE_NAME, cfhPath } from "./comfortflowHvacConfig";
import { CFH_FOOTER, CFH_SITE } from "./comfortflowHvacSiteContent";

export function CfhIcon({
  name,
  className = "",
  fill = false,
  style,
}: {
  name: string;
  className?: string;
  fill?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-outlined notranslate ${className}`}
      style={{
        fontFamily: '"Material Symbols Outlined", sans-serif',
        fontFeatureSettings: '"liga" 1',
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function CfhContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`cfh-container ${className}`}>{children}</div>;
}

export function CfhImg({
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

export function CfhFooter() {
  return (
    <footer className="border-t border-[var(--cfh-on-primary)]/10 bg-[var(--cfh-primary)] text-[var(--cfh-on-primary)]">
      <CfhContainer className="cfh-section-py grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <span className="cfh-headline-sm font-bold">{CFH_SITE_NAME}</span>
          <p className="cfh-body-md text-[var(--cfh-on-primary)]/70">{CFH_SITE.tagline}</p>
        </div>
        {CFH_FOOTER.columns.map((col) => (
          <div key={col.title} className="space-y-4">
            <p className="cfh-label-caps text-[var(--cfh-on-primary)]/40">{col.title}</p>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href.startsWith("/") ? cfhPath(link.href) : link.href}
                    className={`cfh-interactive cfh-body-md transition-colors ${
                      link.highlight
                        ? "text-[var(--cfh-secondary-fixed)]"
                        : "text-[var(--cfh-on-primary)]/70 hover:text-[var(--cfh-on-primary)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CfhContainer>
      <CfhContainer className="border-t border-[var(--cfh-on-primary)]/10 py-8 text-center">
        <p className="cfh-body-md text-sm text-[var(--cfh-on-primary)]/40">{CFH_FOOTER.copyright}</p>
      </CfhContainer>
    </footer>
  );
}

export function CfhCtaLink({
  href,
  children,
  className = "",
  variant = "primary",
  accentColor,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "outlineOnDark";
  /** Service accent — tints primary CTA and outline hover */
  accentColor?: string;
}) {
  const variants = {
    primary: accentColor
      ? "text-white hover:brightness-110"
      : "bg-[var(--cfh-secondary)] text-[var(--cfh-on-secondary)] hover:opacity-90",
    secondary:
      "bg-[var(--cfh-primary)] text-[var(--cfh-on-primary)] hover:bg-[var(--cfh-brand-indigo)]",
    outline: accentColor
      ? "border-2 bg-transparent hover:text-white"
      : "border border-[var(--cfh-outline-variant)] text-[var(--cfh-primary)] hover:bg-[var(--cfh-surface-container)]",
    outlineOnDark:
      "border border-[color-mix(in_srgb,var(--cfh-on-primary)_30%,transparent)] bg-transparent text-[var(--cfh-on-primary)] hover:bg-[color-mix(in_srgb,var(--cfh-on-primary)_10%,transparent)]",
  };

  const style: CSSProperties | undefined = accentColor
    ? variant === "primary"
      ? { backgroundColor: accentColor, ["--cfh-cta-accent" as string]: accentColor }
      : variant === "outline"
        ? { borderColor: accentColor, color: accentColor, ["--cfh-cta-accent" as string]: accentColor }
        : { ["--cfh-cta-accent" as string]: accentColor }
    : undefined;

  return (
    <Link
      href={cfhPath(href)}
      className={`cfh-interactive cfh-cta-link inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 font-bold transition-all ${variants[variant]} ${className}`}
      style={style}
      data-accent={accentColor ? "true" : undefined}
    >
      {children}
    </Link>
  );
}
