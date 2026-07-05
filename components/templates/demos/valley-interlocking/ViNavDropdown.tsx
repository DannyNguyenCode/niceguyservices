"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type ViNavDropdownLink = { label: string; href: string };

type ViNavDropdownProps = {
  menuKey: string;
  label: string;
  links: readonly ViNavDropdownLink[];
  active: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPath: string;
  navLinkClass: (active: boolean) => string;
  /** When set, the label navigates here; a separate control opens the submenu. */
  href?: string;
};

const HOVER_CLOSE_DELAY_MS = 200;

export function ViNavDropdown({
  menuKey,
  label,
  links,
  active,
  open,
  onOpenChange,
  currentPath,
  navLinkClass,
  href,
}: ViNavDropdownProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const show = useCallback(() => onOpenChange(true), [onOpenChange]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(close, HOVER_CLOSE_DELAY_MS);
  }, [clearCloseTimer, close]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        close();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close();
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const focusMenuLink = (index: number) => {
    const items = panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
    if (!items?.length) return;
    items[Math.max(0, Math.min(index, items.length - 1))]?.focus();
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) show();
      requestAnimationFrame(() => focusMenuLink(0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) show();
      requestAnimationFrame(() => {
        const items = panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
        focusMenuLink((items?.length ?? 1) - 1);
      });
    }
  };

  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
    if (!items?.length) return;
    const list = Array.from(items);
    const index = list.indexOf(document.activeElement as HTMLAnchorElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusMenuLink(index < 0 ? 0 : index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (index <= 0) {
        triggerRef.current?.focus();
        return;
      }
      focusMenuLink(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusMenuLink(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusMenuLink(list.length - 1);
    } else if (event.key === "Tab" && !event.shiftKey && index === list.length - 1) {
      close();
    } else if (event.key === "Tab" && event.shiftKey && index === 0) {
      close();
    }
  };

  const onContainerFocusOut = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!open) return;
    const next = event.relatedTarget as Node | null;
    if (next && event.currentTarget.contains(next)) return;
    close();
  };

  const panelLabelId = `vi-nav-${menuKey}-trigger`;

  const toggleButton = (
    <button
      ref={triggerRef}
      type="button"
      id={panelLabelId}
      className={
        href
          ? "vi-nav-dropdown-chevron inline-flex shrink-0 items-center justify-center rounded p-0.5 text-[var(--vi-on-surface-variant)] transition-colors hover:text-[var(--vi-primary)]"
          : `vi-nav-dropdown-trigger vi-label-md inline-flex items-center gap-1 transition-colors duration-200 ${navLinkClass(active)}`
      }
      aria-expanded={open}
      aria-haspopup="true"
      aria-controls={menuId}
      aria-label={href ? `${label} submenu` : undefined}
      onClick={() => onOpenChange(!open)}
      onKeyDown={onTriggerKeyDown}
    >
      {!href ? label : null}
      <ChevronDown
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        aria-hidden
      />
    </button>
  );

  return (
    <div
      className="vi-nav-dropdown relative"
      onMouseEnter={() => {
        clearCloseTimer();
        show();
      }}
      onMouseLeave={scheduleClose}
      onBlur={onContainerFocusOut}
    >
      {href ? (
        <div className="inline-flex items-center gap-0.5">
          <Link
            href={href}
            className={`vi-label-md transition-colors duration-200 ${navLinkClass(active)}`}
            aria-current={currentPath === href.replace(/\/$/, "") ? "page" : undefined}
            onClick={close}
          >
            {label}
          </Link>
          {toggleButton}
        </div>
      ) : (
        toggleButton
      )}
      <div
        ref={panelRef}
        id={menuId}
        hidden={!open}
        className="vi-nav-dropdown-panel absolute top-full left-0 z-50 mt-2 min-w-[14rem] rounded-lg border border-[var(--vi-outline-variant)] bg-[var(--vi-background)] py-2 shadow-lg"
        role="region"
        aria-labelledby={panelLabelId}
        onKeyDown={onPanelKeyDown}
      >
        <ul role="list">
          {links.map((link: any) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="vi-nav-dropdown-link block px-4 py-2 vi-body-md text-[var(--vi-on-surface-variant)] hover:bg-[var(--vi-surface-container-low)] hover:text-[var(--vi-primary)]"
                aria-current={currentPath === link.href ? "page" : undefined}
                onClick={close}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type ViMobileNavGroupProps = {
  label: string;
  links: readonly ViNavDropdownLink[];
  currentPath: string;
  defaultExpanded?: boolean;
  onNavigate?: () => void;
  /** When set, the label navigates here; chevron toggles the submenu. */
  href?: string;
};

export function ViMobileNavGroup({
  label,
  links,
  currentPath,
  defaultExpanded = false,
  onNavigate,
  href,
}: ViMobileNavGroupProps) {
  const panelId = useId();
  const childActive = links.some((link: any) => currentPath === link.href);
  const [expanded, setExpanded] = useState(defaultExpanded || childActive);

  return (
    <li>
      {href ? (
        <div className="flex min-h-[2.75rem] items-stretch">
          <Link
            href={href}
            onClick={onNavigate}
            aria-current={currentPath === href.replace(/\/$/, "") ? "page" : undefined}
            className={`flex flex-1 items-center rounded-lg px-4 py-3 vi-label-md ${
              childActive || currentPath === href.replace(/\/$/, "")
                ? "font-bold text-[var(--vi-primary)]"
                : "text-[var(--vi-primary)]"
            }`}
          >
            {label}
          </Link>
          <button
            type="button"
            className="vi-mobile-nav-group-trigger inline-flex items-center justify-center rounded-lg px-3 text-[var(--vi-primary)]"
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-label={`${label} submenu`}
            onClick={() => setExpanded((value) => !value)}
          >
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="vi-mobile-nav-group-trigger flex min-h-[2.75rem] w-full items-center justify-between rounded-lg px-4 py-3 vi-label-md text-[var(--vi-primary)]"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((value) => !value)}
        >
          {label}
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      )}
      <ul
        id={panelId}
        hidden={!expanded}
        className="flex flex-col gap-1 py-1 pl-2"
        role="list"
      >
        {links.map((link: any) => {
          const active = currentPath === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`block min-h-[2.75rem] rounded-lg px-4 py-3 vi-body-md ${
                  active
                    ? "bg-[var(--vi-primary-fixed)] font-bold text-[var(--vi-primary)]"
                    : "text-[var(--vi-on-surface-variant)] hover:bg-[var(--vi-surface-container-low)]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </li>
  );
}
