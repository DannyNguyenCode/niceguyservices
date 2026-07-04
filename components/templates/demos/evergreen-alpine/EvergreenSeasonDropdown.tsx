"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  EVERGREEN_SEASON_NAV,
  isEvergreenSeasonNavActive,
} from "./evergreenConfig";
import { EvergreenSectionLink } from "./EvergreenSectionLink";
import { useEvergreenActiveNavKey, useEvergreenActiveScrollSection } from "./useEvergreenActiveSection";

const SEASON_TRIGGER_ID = "evergreen-season-trigger";
const SEASON_PANEL_ID = "evergreen-season-panel";

function seasonTriggerClass(active: boolean, open: boolean) {
  if (active) {
    return "eg-nav-link eg-nav-link--active text-sm font-bold tracking-wide text-[#012d1d]";
  }
  if (open) {
    return "eg-nav-link text-sm font-semibold tracking-wide text-[#012d1d] bg-[#c1ecd4]/30";
  }
  return "eg-nav-link text-sm font-semibold tracking-wide text-[#414844] transition-colors hover:text-[#012d1d]";
}

function seasonLinkClass(active: boolean) {
  return `eg-focus-ring flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
    active
      ? "bg-[#012d1d] text-white"
      : "text-[#414844] hover:bg-[#f6f3f2] hover:text-[#012d1d]"
  }`;
}

function getPanelLinks(panel: HTMLElement | null): HTMLAnchorElement[] {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<HTMLAnchorElement>('a[href]'));
}

function focusPanelLink(panel: HTMLElement | null, index: number) {
  const links = getPanelLinks(panel);
  if (links.length === 0) return;
  const i = ((index % links.length) + links.length) % links.length;
  links[i]?.focus();
}

export function EvergreenSeasonDropdown() {
  const navKey = useEvergreenActiveNavKey();
  const scrollSection = useEvergreenActiveScrollSection();
  const seasonActive = navKey === "seasons";
  const activeSeason = EVERGREEN_SEASON_NAV.find((season) =>
    isEvergreenSeasonNavActive(scrollSection, season.href),
  );

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  const openPanel = useCallback((focusFirst = false) => {
    setOpen(true);
    if (focusFirst) {
      requestAnimationFrame(() => focusPanelLink(panelRef.current, 0));
    }
  }, []);

  const toggle = useCallback(() => {
    setOpen((current) => {
      const next = !current;
      if (next) {
        requestAnimationFrame(() => focusPanelLink(panelRef.current, 0));
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      close();
    };

    const onScroll = () => close();
    const onHashChange = () => close();

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [open, close]);

  const handleTriggerKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (open) {
        focusPanelLink(panelRef.current, 0);
      } else {
        openPanel(true);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (open) {
        focusPanelLink(panelRef.current, getPanelLinks(panelRef.current).length - 1);
      } else {
        openPanel(true);
        requestAnimationFrame(() =>
          focusPanelLink(panelRef.current, getPanelLinks(panelRef.current).length - 1),
        );
      }
      return;
    }

    if (e.key === "Escape" && open) {
      e.preventDefault();
      close(true);
    }
  };

  const handlePanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const links = getPanelLinks(panelRef.current);
    const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);

    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusPanelLink(panelRef.current, currentIndex < 0 ? 0 : currentIndex + 1);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentIndex <= 0) {
        close(true);
      } else {
        focusPanelLink(panelRef.current, currentIndex - 1);
      }
      return;
    }

    if (e.key === "Home") {
      e.preventDefault();
      focusPanelLink(panelRef.current, 0);
      return;
    }

    if (e.key === "End") {
      e.preventDefault();
      focusPanelLink(panelRef.current, links.length - 1);
    }
  };

  const triggerLabel = activeSeason
    ? `Services, ${activeSeason.label} selected`
    : "Services";

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          setOpen(true);
        }
      }}
      onMouseLeave={(e) => {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const next = e.relatedTarget as Node | null;
        if (!containerRef.current?.contains(next)) {
          close();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        id={SEASON_TRIGGER_ID}
        className={`eg-focus-ring inline-flex items-center gap-1 rounded-sm ${seasonTriggerClass(seasonActive, open)}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={SEASON_PANEL_ID}
        aria-current={seasonActive ? "true" : undefined}
        aria-label={triggerLabel}
        onClick={toggle}
        onKeyDown={handleTriggerKeyDown}
      >
        <span aria-hidden="true">Services</span>
        {activeSeason ? (
          <span
            className="rounded-full bg-[#c1ecd4]/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#012d1d]"
            aria-hidden="true"
          >
            {activeSeason.label}
          </span>
        ) : null}
        <span
          className={`material-symbols-outlined text-base leading-none transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      {/* Hover bridge — keeps panel open while moving pointer from trigger to menu */}
      <div
        className={`absolute inset-x-0 top-full h-3 ${open ? "block" : "hidden"}`}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        id={SEASON_PANEL_ID}
        role="menu"
        aria-labelledby={SEASON_TRIGGER_ID}
        hidden={!open}
        onKeyDown={handlePanelKeyDown}
        className={`eg-season-dropdown absolute left-0 top-[calc(100%+0.75rem)] z-50 min-w-52 rounded-xl border border-[#c1c8c2]/60 bg-white p-2 shadow-lg ${open ? "block" : "hidden"}`}
      >
        <p className="px-3 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-[#414844]">
          When it is
        </p>
        <ul className="flex flex-col gap-0.5" role="none">
          {EVERGREEN_SEASON_NAV.map((season) => {
            const active = isEvergreenSeasonNavActive(scrollSection, season.href);
            return (
              <li key={season.href} role="none">
                <EvergreenSectionLink
                  href={season.href}
                  role="menuitem"
                  tabIndex={open ? 0 : -1}
                  className={seasonLinkClass(active)}
                  aria-current={active ? "page" : undefined}
                  onNavigate={() => close()}
                >
                  <span className="material-symbols-outlined text-lg leading-none" aria-hidden="true">
                    {season.icon}
                  </span>
                  <span>{season.label}</span>
                  {active ? <span className="sr-only"> (current season)</span> : null}
                </EvergreenSectionLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
