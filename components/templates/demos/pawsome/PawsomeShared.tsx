import Link from "next/link";
import type { ReactNode } from "react";
import { PS_SITE } from "./pawsomeConfig";

type PsIconProps = {
  name: string;
  filled?: boolean;
  className?: string;
};

export function PsIcon({ name, filled, className = "" }: PsIconProps) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? "ps-filled" : ""} ${className}`}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function PsFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="mt-20 w-full border-t border-[var(--ps-outline-variant)] bg-[var(--ps-surface-container-low)]">
      <div
        className={`mx-auto flex w-full max-w-[var(--ps-container-max)] flex-col items-center space-y-4 px-[var(--ps-margin-mobile)] py-8 text-center md:px-[var(--ps-margin-desktop)] ${compact ? "" : "md:py-12"}`}
      >
        <span
          className="text-xl font-bold text-[var(--ps-primary)]"
          style={{ fontFamily: "var(--font-ps-headline)" }}
        >
          {PS_SITE}
        </span>
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
          {["Privacy Policy", "Terms of Service", "Shipping Info"].map((label) => (
            <span
              key={label}
              className="cursor-default text-xs font-medium text-[var(--ps-on-surface-variant)]"
            >
              {label}
            </span>
          ))}
        </nav>
        <p
          className={
            compact
              ? "text-[10px] uppercase tracking-widest text-[var(--ps-on-surface-variant)] opacity-60"
              : "text-sm text-[var(--ps-on-surface-variant)] opacity-70"
          }
        >
          © 2024 Pawsome Ecosystem. All Rights Reserved. Fictional demo.
        </p>
      </div>
    </footer>
  );
}

export function PsPageWrap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--ps-container-max)] px-[var(--ps-margin-mobile)] md:px-[var(--ps-margin-desktop)] ${className}`}
    >
      {children}
    </div>
  );
}

export function PsPrimaryButton({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  const cls = `inline-flex items-center justify-center rounded-xl bg-[var(--ps-primary)] px-8 py-4 text-sm font-semibold tracking-wide text-[var(--ps-on-primary)] shadow-lg transition-all hover:opacity-90 active:scale-95 ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls}>
      {children}
    </button>
  );
}

export function PsSecondaryButton({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  const cls = `inline-flex items-center justify-center rounded-xl bg-[var(--ps-surface-container-high)] px-8 py-4 text-sm font-semibold tracking-wide text-[var(--ps-primary)] transition-all hover:bg-[var(--ps-surface-container-highest)] active:scale-95 ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls}>
      {children}
    </button>
  );
}

export function PsBadge({
  children,
  variant = "secondary",
}: {
  children: ReactNode;
  variant?: "secondary" | "tertiary" | "neutral";
}) {
  const styles = {
    secondary:
      "bg-[color-mix(in_srgb,var(--ps-secondary-container)_10%,transparent)] text-[var(--ps-secondary)]",
    tertiary:
      "bg-[color-mix(in_srgb,var(--ps-on-tertiary-container)_10%,transparent)] text-[var(--ps-on-tertiary-container)]",
    neutral: "bg-[var(--ps-surface-container-high)] text-[var(--ps-on-surface-variant)]",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
}

export function PsProgressBar({
  value,
  className = "",
  height = "h-2",
}: {
  value: number;
  className?: string;
  height?: string;
}) {
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-[var(--ps-surface-container-high)] ${height} ${className}`}
    >
      <div
        className={`${height} rounded-full bg-[var(--ps-secondary)] transition-all duration-700`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
