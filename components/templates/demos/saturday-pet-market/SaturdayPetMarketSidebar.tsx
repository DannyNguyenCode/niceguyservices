import Link from "next/link";
import type { ReactNode } from "react";
import { SPM_PATHS } from "./saturdayPetMarketConfig";
import { SpmIcon } from "./SaturdayPetMarketShared";

const CATEGORY_LINKS = [
  { icon: "pets", label: "All Products", href: SPM_PATHS.shop, active: false },
  { icon: "pets", label: "Dog Supplies", href: SPM_PATHS.shop },
  { icon: "pets", label: "Cat Supplies", href: SPM_PATHS.shop },
  { icon: "flutter_dash", label: "Bird & Small Pet", href: SPM_PATHS.shop },
  { icon: "sell", label: "Special Offers", href: SPM_PATHS.shop },
] as const;

type SpmCategorySidebarProps = {
  title?: string;
  subtitle?: string;
  links?: { icon: string; label: string; href: string; active?: boolean }[];
  footer?: ReactNode;
  className?: string;
};

export function SpmCategorySidebar({
  title = "Shop by Category",
  subtitle = "Local & Fresh",
  links = CATEGORY_LINKS.map((l) => ({ ...l })),
  footer,
  className = "",
}: SpmCategorySidebarProps) {
  return (
    <aside className={`hidden md:flex md:w-64 md:flex-col ${className}`}>
      <div className="sticky top-24 flex h-[calc(100vh-120px)] flex-col gap-2 rounded-r-lg border-r border-[var(--spm-outline-variant)] bg-[var(--spm-surface-container-low)] p-6 shadow-md">
        <div>
          <h2 className="spm-headline-md mb-1 text-[var(--spm-secondary)]">{title}</h2>
          <p className="spm-label-sm uppercase tracking-wider text-[var(--spm-on-surface-variant)]">{subtitle}</p>
        </div>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`group flex items-center gap-3 rounded-full px-4 py-2 transition-all ${
                link.active
                  ? "bg-[var(--spm-tertiary-container)] text-[var(--spm-on-tertiary-container)]"
                  : "text-[var(--spm-on-surface-variant)] hover:bg-[var(--spm-surface-container-high)]"
              }`}
            >
              <SpmIcon name={link.icon} className={link.active ? "" : "group-hover:text-[var(--spm-primary)]"} />
              <span className="spm-label-sm">{link.label}</span>
            </Link>
          ))}
        </nav>
        {footer ?? (
          <div className="spm-candy-stripe-subtle mt-auto rounded-lg border border-[var(--spm-outline-variant)] p-3">
            <p className="spm-label-sm font-bold text-[var(--spm-primary)]">Need help?</p>
            <p className="text-xs text-[var(--spm-on-surface-variant)]">Our local pet experts are just a whistle away.</p>
          </div>
        )}
      </div>
    </aside>
  );
}

export function SpmFab({
  icon,
  label,
  className = "",
  onClick,
  expanded = false,
}: {
  icon: string;
  label?: string;
  className?: string;
  onClick?: () => void;
  /** Wider pill style with visible label (shop page) */
  expanded?: boolean;
}) {
  if (expanded) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`fixed bottom-8 right-8 z-40 flex items-center gap-2 rounded-full bg-[var(--spm-secondary)] p-6 text-[var(--spm-on-secondary)] shadow-lg transition-all hover:scale-105 active:scale-95 ${className}`}
        aria-label={label ?? "Help"}
      >
        <SpmIcon name={icon} fill />
        {label ? <span className="hidden font-bold md:inline">{label}</span> : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--spm-secondary)] text-[var(--spm-on-secondary)] shadow-lg transition-transform hover:scale-110 active:scale-95 ${className}`}
      aria-label={label ?? "Help"}
    >
      <SpmIcon name={icon} className="text-3xl" />
      {label ? (
        <span className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-full bg-[var(--spm-secondary)] px-4 py-1 text-sm font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
          {label}
        </span>
      ) : null}
    </button>
  );
}
