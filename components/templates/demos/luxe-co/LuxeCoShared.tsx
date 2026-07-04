import type { CSSProperties, ReactNode } from "react";

export const lcDisplay: CSSProperties = {
  fontFamily: "var(--font-lc-display), ui-serif, Georgia, serif",
};

export const lcBody: CSSProperties = {
  fontFamily: "var(--font-lc-body), ui-sans-serif, system-ui, sans-serif",
};

export function LcIcon({
  name,
  filled = false,
  className = "",
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${filled ? "lc-icon-filled" : ""} ${className}`}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function LcSectionLabel({ children }: { children: ReactNode }) {
  return <p className="lc-label mb-4 text-[var(--lc-gold)]">{children}</p>;
}

export function LcSectionHeading({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={`lc-display text-[var(--lc-charcoal)] ${className}`}
      style={lcDisplay}
    >
      {children}
    </Tag>
  );
}

type LcButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
};

export function LcButton({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  type = "button",
}: LcButtonProps) {
  const base =
    "lc-focus-ring lc-label inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium tracking-[0.14em]";
  const variantClass =
    variant === "primary"
      ? "lc-btn-primary"
      : variant === "outline"
        ? "lc-btn-outline"
        : "lc-btn-ghost px-0 py-1";

  if (href) {
    return (
      <a href={href} className={`${base} ${variantClass} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={`${base} ${variantClass} ${className}`}>
      {children}
    </button>
  );
}

export function LcContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[var(--lc-container)] px-5 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function LcStarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <LcIcon key={i} name="star" filled className="lc-star text-base" />
      ))}
    </div>
  );
}
