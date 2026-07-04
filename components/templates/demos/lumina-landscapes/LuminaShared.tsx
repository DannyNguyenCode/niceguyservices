import type { CSSProperties, ReactNode } from "react";

export const luminaDisplay: CSSProperties = {
  fontFamily: "var(--font-lumina-display), ui-serif, Georgia, serif",
};

export const luminaBody: CSSProperties = {
  fontFamily: "var(--font-lumina-body), ui-sans-serif, system-ui, sans-serif",
};

export const luminaLabel: CSSProperties = {
  fontFamily: "var(--font-lumina-label), ui-sans-serif, system-ui, sans-serif",
};

export function LuminaSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      className="lumina-label mb-4 text-[var(--lumina-bronze)]"
      style={luminaLabel}
    >
      {children}
    </p>
  );
}

export function LuminaSectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`lumina-display text-3xl leading-tight text-[var(--lumina-cream)] md:text-4xl lg:text-5xl ${className}`}
      style={luminaDisplay}
    >
      {children}
    </h2>
  );
}

type LuminaButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  children: ReactNode;
  className?: string;
  "aria-current"?: "page" | "true" | "false";
};

export function LuminaButton({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  "aria-current": ariaCurrent,
}: LuminaButtonProps) {
  const base =
    "lumina-label inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium tracking-[0.18em]";
  const variantClass =
    variant === "primary" ? "lumina-btn-primary rounded-sm" : "lumina-btn-outline rounded-sm";

  if (href) {
    return (
      <a
        href={href}
        className={`${base} ${variantClass} ${className}`}
        aria-current={ariaCurrent}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${base} ${variantClass} ${className}`}>
      {children}
    </button>
  );
}

export function LuminaBlueprintOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 lumina-blueprint-grid opacity-40"
      aria-hidden
    />
  );
}

export function LuminaFadeIn({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
