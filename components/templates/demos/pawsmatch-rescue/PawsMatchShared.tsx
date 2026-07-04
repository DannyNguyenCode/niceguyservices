import type { CSSProperties, ReactNode } from "react";

export const pmrDisplay: CSSProperties = {
  fontFamily: "var(--font-pmr-display), ui-serif, Georgia, serif",
};

export const pmrBody: CSSProperties = {
  fontFamily: "var(--font-pmr-body), ui-sans-serif, system-ui, sans-serif",
};

export function PmrIcon({
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
      className={`material-symbols-outlined ${filled ? "pmr-icon-filled" : ""} ${className}`}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function PmrSectionLabel({ children }: { children: ReactNode }) {
  return <p className="pmr-label mb-3 text-[var(--pmr-sage-muted)]">{children}</p>;
}

export function PmrSectionHeading({
  children,
  className = "",
  as: Tag = "h2",
  serif = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  serif?: boolean;
}) {
  return (
    <Tag
      className={`${serif ? "pmr-display" : ""} text-[var(--pmr-brown)] ${className}`}
      style={serif ? pmrDisplay : pmrBody}
    >
      {children}
    </Tag>
  );
}

type PmrButtonProps = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
};

export function PmrButton({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  type = "button",
  ariaLabel,
}: PmrButtonProps) {
  const base =
    "pmr-focus-ring inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold transition-all";
  const variantClass =
    variant === "primary"
      ? "pmr-btn-primary"
      : variant === "outline"
        ? "pmr-btn-outline"
        : "pmr-btn-ghost";

  if (href) {
    return (
      <a href={href} className={`${base} ${variantClass} ${className}`} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variantClass} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function PmrTag({
  children,
  variant = "sage",
}: {
  children: ReactNode;
  variant?: "sage" | "terracotta";
}) {
  return (
    <span className={variant === "sage" ? "pmr-tag-sage" : "pmr-tag-terracotta"}>
      {children}
    </span>
  );
}

export function PmrContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[var(--pmr-container)] px-5 md:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
