import type { CSSProperties, ReactNode } from "react";

export const hrDisplay: CSSProperties = {
  fontFamily: "var(--font-hr-display), ui-serif, Georgia, serif",
};

export const hrBody: CSSProperties = {
  fontFamily: "var(--font-hr-body), ui-sans-serif, system-ui, sans-serif",
};

export function HrIcon({
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
      className={`material-symbols-outlined ${filled ? "hr-icon-filled" : ""} ${className}`}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function HrSectionLabel({ children }: { children: ReactNode }) {
  return <p className="hr-label mb-4 text-[var(--hr-gold)]">{children}</p>;
}

export function HrSectionHeading({
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
      className={`hr-display text-[var(--hr-charcoal)] ${className}`}
      style={hrDisplay}
    >
      {children}
    </Tag>
  );
}

type HrButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
};

export function HrButton({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  type = "button",
}: HrButtonProps) {
  const base =
    "hr-focus-ring hr-label inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-medium tracking-[0.14em]";
  const variantClass =
    variant === "primary"
      ? "hr-btn-primary"
      : variant === "outline"
        ? "hr-btn-outline"
        : "hr-btn-ghost px-0 py-1";

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

export function HrContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[var(--hr-container)] px-5 md:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
}

export function HrArchFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute -inset-4 text-[var(--hr-beige)] md:-inset-6"
        viewBox="0 0 100 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 50 0 Q 100 0 100 50 L 100 120 L 0 120 L 0 50 Q 0 0 50 0 Z"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>
      <svg
        className="pointer-events-none absolute -inset-2 text-[var(--hr-gold)] md:-inset-3"
        viewBox="0 0 100 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 50 0 Q 100 0 100 50 L 100 120 L 0 120 L 0 50 Q 0 0 50 0 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.5"
        />
      </svg>
      <div className="relative overflow-hidden rounded-t-[50%] rounded-b-2xl">{children}</div>
    </div>
  );
}

export function HrArchDecoration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`hr-arch-decoration absolute ${className}`}
      viewBox="0 0 200 240"
      aria-hidden
      fill="none"
    >
      <path
        d="M 100 0 Q 200 0 200 100 L 200 240 L 0 240 L 0 100 Q 0 0 100 0 Z"
        stroke="var(--hr-gold)"
        strokeWidth="1"
      />
    </svg>
  );
}
