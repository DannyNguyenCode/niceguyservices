"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import {
  getNeopetsActiveSection,
  getNeopetsPinnedDropdown,
  isNeopetsNavActive,
  isNeopetsNavGroupActive,
  isNeopetsProfileActive,
  NEOPETS_COMMUNITY_NAV,
  NEOPETS_MAIN_NAV,
  NEOPETS_PATHS,
  NEOPETS_RESOURCES_NAV,
  NEOPETS_SITE,
  type NeopetsNavItem,
} from "./neopetsConfig";
import { NeopetsDonateButton } from "./NeopetsDonateButton";

const MOBILE_NAV_PANEL_ID = "neopets-mobile-nav-panel";
const DESKTOP_DROPDOWN_ID = "neopets-desktop-nav-dropdown";
const bodyFont = { fontFamily: "var(--font-np-body), ui-sans-serif, system-ui" } as const;

type DropdownId = "community" | "resources";

const DROPDOWN_CONFIG: Record<
  DropdownId,
  { label: string; items: readonly NeopetsNavItem[] }
> = {
  community: { label: "Community", items: NEOPETS_COMMUNITY_NAV },
  resources: { label: "Resources", items: NEOPETS_RESOURCES_NAV },
};

const DROPDOWN_ORDER: DropdownId[] = ["community", "resources"];

const NAV_ITEM_IDLE =
  "inline-flex h-7 items-center justify-center gap-0.5 rounded-full border border-transparent px-2.5 text-sm font-semibold leading-none text-[#40484e] transition-colors hover:border-[#c0c7cf] hover:bg-white/80";

const NAV_ITEM_ACTIVE =
  "inline-flex h-7 items-center justify-center gap-0.5 rounded-full px-2.5 text-sm font-bold leading-none text-white bg-[#0d658c]";

function navLinkClass(active: boolean) {
  return active ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE;
}

function dropdownTriggerClass(active: boolean, open: boolean) {
  if (active) {
    return NAV_ITEM_ACTIVE;
  }
  if (open) {
    return `${NAV_ITEM_IDLE} border-[#0d658c] bg-[#8fd3ff]/20 text-[#0d658c]`;
  }
  return NAV_ITEM_IDLE;
}

function dropdownLinkClass(active: boolean, touchFriendly: boolean) {
  const size = touchFriendly ? "min-h-11 gap-2.5 px-3 py-2" : "h-7 gap-2 px-2.5";
  return active
    ? `np-focus-ring inline-flex items-center justify-center rounded-full text-sm font-bold leading-none text-white ${size} bg-[#0d658c]`
    : `np-focus-ring inline-flex items-center justify-center rounded-full border border-transparent text-sm font-semibold leading-none transition-colors ${size} text-[#40484e] hover:border-[#c0c7cf] hover:bg-white/80`;
}

function mobileNavLinkClass(active: boolean) {
  return active
    ? "flex min-h-11 items-center gap-2.5 rounded-lg bg-[#0d658c] px-3 py-2 text-sm font-bold text-white"
    : "flex min-h-11 items-center gap-2.5 rounded-lg border border-[#ebe1d5] bg-[#fff8f2] px-3 py-2 text-sm font-semibold text-[#1f1b14] hover:border-[#0d658c]/40";
}

function getPanelLinks(panel: HTMLElement | null): HTMLAnchorElement[] {
  if (!panel) return [];
  return Array.from(panel.querySelectorAll<HTMLAnchorElement>("a[href]"));
}

function focusPanelLink(panel: HTMLElement | null, index: number) {
  const links = getPanelLinks(panel);
  if (links.length === 0) return;
  links[Math.max(0, Math.min(index, links.length - 1))]?.focus();
}

function NavDropdownLinks({
  items,
  pathname,
  onNavigate,
  listClassName = "flex flex-wrap items-center justify-center gap-0.5 sm:gap-1",
  touchFriendly = false,
}: {
  items: readonly NeopetsNavItem[];
  pathname: string;
  onNavigate?: () => void;
  listClassName?: string;
  touchFriendly?: boolean;
}) {
  return (
    <ul className={listClassName}>
      {items.map((item) => {
        const active = isNeopetsNavActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={dropdownLinkClass(active, touchFriendly)}
              style={bodyFont}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <span className="material-symbols-outlined text-xl leading-none" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function NavDropdownTrigger({
  id,
  label,
  isActive,
  isOpen,
  triggerRef,
  onOpen,
  onToggle,
  onTriggerKeyDown,
}: {
  id: DropdownId;
  label: string;
  isActive: boolean;
  isOpen: boolean;
  triggerRef: RefObject<HTMLButtonElement | null>;
  onOpen: () => void;
  onToggle: () => void;
  onTriggerKeyDown: (e: ReactKeyboardEvent<HTMLButtonElement>, id: DropdownId) => void;
}) {
  return (
    <button
      ref={triggerRef}
      type="button"
      id={`${id}-trigger`}
      className={`np-focus-ring ${dropdownTriggerClass(isActive, isOpen)}`}
      style={bodyFont}
      aria-haspopup="true"
      aria-expanded={isOpen}
      aria-controls={DESKTOP_DROPDOWN_ID}
      aria-current={isActive ? "true" : undefined}
      onMouseEnter={onOpen}
      onFocus={onOpen}
      onClick={onToggle}
      onKeyDown={(e) => onTriggerKeyDown(e, id)}
    >
      {label}
      <span
        className={`material-symbols-outlined block text-base leading-none ${isOpen ? "rotate-180" : ""}`}
        aria-hidden
      >
        expand_more
      </span>
    </button>
  );
}

function MobileNavAccordion({
  id,
  title,
  items,
  pathname,
  onNavigate,
}: {
  id: DropdownId;
  title: string;
  items: readonly NeopetsNavItem[];
  pathname: string;
  onNavigate: () => void;
}) {
  const groupActive = isNeopetsNavGroupActive(pathname, items);
  const [manualOpen, setManualOpen] = useState(false);
  const open = groupActive || manualOpen;
  const triggerId = `${id}-mobile-trigger`;
  const panelId = `${id}-mobile-panel`;

  return (
    <div className="overflow-hidden rounded-xl border border-[#ebe1d5] bg-white">
      <button
        type="button"
        id={triggerId}
        className={`np-focus-ring flex min-h-11 w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors ${
          groupActive
            ? "bg-[#0d658c] text-white"
            : open
              ? "bg-[#8fd3ff]/20 text-[#0d658c]"
              : "text-[#1f1b14] hover:bg-[#fff8f2]"
        }`}
        style={bodyFont}
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={groupActive ? "true" : undefined}
        onClick={() => {
          if (!groupActive) setManualOpen((current) => !current);
        }}
      >
        <span className="flex items-center gap-2 text-sm font-bold">
          <span className="material-symbols-outlined text-xl" aria-hidden>
            {id === "community" ? "groups" : "menu_book"}
          </span>
          {title}
        </span>
        <span
          className={`material-symbols-outlined text-xl transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          expand_more
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className={open ? "w-full border-t border-[#ebe1d5] bg-[#fff8f2] px-2 py-1.5" : "hidden"}
      >
        <NavDropdownLinks
          items={items}
          pathname={pathname}
          onNavigate={onNavigate}
          listClassName="flex flex-col gap-0.5"
          touchFriendly
        />
      </div>
    </div>
  );
}

export function NeopetsHeader() {
  const pathname = usePathname() ?? "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLElement>(null);
  const desktopPanelRef = useRef<HTMLDivElement>(null);
  const communityTriggerRef = useRef<HTMLButtonElement>(null);
  const resourcesTriggerRef = useRef<HTMLButtonElement>(null);

  const triggerRefs = useMemo<Record<DropdownId, RefObject<HTMLButtonElement | null>>>(
    () => ({
      community: communityTriggerRef,
      resources: resourcesTriggerRef,
    }),
    [],
  );

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const closeDropdown = useCallback((returnFocusTo?: DropdownId) => {
    setOpenDropdown(null);
    if (returnFocusTo) {
      requestAnimationFrame(() => triggerRefs[returnFocusTo].current?.focus());
    }
  }, [triggerRefs]);

  const openDropdownPanel = useCallback((id: DropdownId, focusFirst = false) => {
    setOpenDropdown(id);
    if (focusFirst) {
      requestAnimationFrame(() => focusPanelLink(desktopPanelRef.current, 0));
    }
  }, []);

  useEffect(() => {
    closeMenu();
    setOpenDropdown(getNeopetsPinnedDropdown(pathname));
  }, [pathname, closeMenu]);

  const pinnedDropdown = getNeopetsPinnedDropdown(pathname);
  const visibleDropdown = openDropdown ?? pinnedDropdown;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    requestAnimationFrame(() => {
      const first = mobilePanelRef.current?.querySelector<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      first?.focus();
    });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu();
        menuButtonRef.current?.focus();
      }
      if (e.key === "Tab" && mobilePanelRef.current) {
        const focusables = Array.from(
          mobilePanelRef.current.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          ),
        ).filter((el) => !el.closest("[hidden]"));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!openDropdown) return;
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current?.contains(e.target as Node)) return;
      setOpenDropdown(getNeopetsPinnedDropdown(pathname));
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [openDropdown, pathname]);

  const handleTriggerKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>, id: DropdownId) => {
      const idx = DROPDOWN_ORDER.indexOf(id);

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (visibleDropdown === id) {
          focusPanelLink(desktopPanelRef.current, 0);
        } else {
          openDropdownPanel(id, true);
        }
        return;
      }

      if (e.key === "ArrowRight" && idx < DROPDOWN_ORDER.length - 1) {
        e.preventDefault();
        const next = DROPDOWN_ORDER[idx + 1];
        triggerRefs[next].current?.focus();
        return;
      }

      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        const prev = DROPDOWN_ORDER[idx - 1];
        triggerRefs[prev].current?.focus();
        return;
      }

      if (e.key === "Escape" && visibleDropdown === id && openDropdown === id) {
        e.preventDefault();
        closeDropdown(id);
      }
    },
    [openDropdown, openDropdownPanel, closeDropdown, triggerRefs, visibleDropdown],
  );

  const handlePanelKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (!visibleDropdown) return;
      const pinned = getNeopetsPinnedDropdown(pathname);
      const links = getPanelLinks(desktopPanelRef.current);
      const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);

      if (e.key === "Escape") {
        e.preventDefault();
        if (pinned && openDropdown && openDropdown !== pinned) {
          setOpenDropdown(pinned);
          requestAnimationFrame(() => triggerRefs[pinned].current?.focus());
        } else if (!pinned) {
          closeDropdown(openDropdown ?? undefined);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        focusPanelLink(desktopPanelRef.current, currentIndex < 0 ? 0 : currentIndex + 1);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (currentIndex <= 0) {
          if (openDropdown && (!pinned || openDropdown !== pinned)) {
            setOpenDropdown(pinned);
            if (openDropdown) {
              requestAnimationFrame(() => triggerRefs[openDropdown].current?.focus());
            }
          }
        } else {
          focusPanelLink(desktopPanelRef.current, currentIndex - 1);
        }
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        focusPanelLink(desktopPanelRef.current, 0);
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        focusPanelLink(desktopPanelRef.current, links.length - 1);
      }
    },
    [openDropdown, closeDropdown, pathname, visibleDropdown, triggerRefs],
  );

  const handleHeaderMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const next = e.relatedTarget as Node | null;
      if (!headerRef.current?.contains(next)) {
        setOpenDropdown(getNeopetsPinnedDropdown(pathname));
      }
    },
    [pathname],
  );

  const activeSection = getNeopetsActiveSection(pathname);
  const profileActive = isNeopetsProfileActive(pathname);
  const activeDropdown = visibleDropdown ? DROPDOWN_CONFIG[visibleDropdown] : null;

  const openDropdownIfAllowed = useCallback((id: DropdownId) => {
    setOpenDropdown(id);
  }, []);

  const toggleDropdownIfAllowed = useCallback(
    (id: DropdownId) => {
      if (pinnedDropdown === id && openDropdown !== id) {
        setOpenDropdown(id);
        return;
      }
      setOpenDropdown((current) => (current === id ? pinnedDropdown : id));
    },
    [pinnedDropdown, openDropdown],
  );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-[#ebe1d5] bg-[#fcf2e6]"
      onMouseLeave={handleHeaderMouseLeave}
    >
      {menuOpen ? (
        <div
          className="fixed inset-0 z-45 bg-[#1f1b14]/40 lg:hidden"
          aria-hidden
          onClick={closeMenu}
        />
      ) : null}

      <div className="relative z-50 mx-auto h-12 max-w-[1200px] px-3 sm:px-5 lg:px-8">
        {/* Mobile: hamburger left, logo centered */}
        <div className="flex h-12 items-center lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            className="np-focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#0d658c] text-[#0d658c] transition-colors hover:bg-[#8fd3ff]/30"
            aria-expanded={menuOpen}
            aria-controls={MOBILE_NAV_PANEL_ID}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => {
              setMenuOpen((open) => {
                if (open) menuButtonRef.current?.focus();
                return !open;
              });
            }}
          >
            <span className="material-symbols-outlined text-xl leading-none" aria-hidden>
              {menuOpen ? "close" : "menu"}
            </span>
          </button>

          <Link
            href={NEOPETS_PATHS.home}
            className="np-focus-ring flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2"
          >
            <span className="material-symbols-outlined shrink-0 text-xl text-[#0d658c]" aria-hidden>
              pets
            </span>
            <span
              className="truncate text-sm font-bold text-[#0d658c] sm:text-base"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              {NEOPETS_SITE}
            </span>
          </Link>

          <div className="h-11 w-11 shrink-0" aria-hidden />
        </div>

        {/* Desktop */}
        <div className="hidden h-12 items-center gap-2 lg:flex">
          <Link href={NEOPETS_PATHS.home} className="np-focus-ring flex min-w-0 shrink-0 items-center gap-1.5 rounded-lg">
            <span className="material-symbols-outlined shrink-0 text-2xl text-[#0d658c]" aria-hidden>
              pets
            </span>
            <span
              className="truncate text-lg font-bold text-[#0d658c]"
              style={{ fontFamily: "var(--font-np-headline), ui-sans-serif, system-ui" }}
            >
              {NEOPETS_SITE}
            </span>
          </Link>

          <nav className="flex flex-1 items-center justify-center gap-0.5 self-stretch" aria-label="Main">
            {NEOPETS_MAIN_NAV.map((item) => {
              const sectionId = item.href === NEOPETS_PATHS.explorer ? "explore" : "journey";
              const active = activeSection === sectionId;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`np-focus-ring ${navLinkClass(active)}`}
                  style={bodyFont}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <NavDropdownTrigger
              id="community"
              label="Community"
              isActive={activeSection === "community"}
              isOpen={visibleDropdown === "community"}
              triggerRef={communityTriggerRef}
              onOpen={() => openDropdownIfAllowed("community")}
              onToggle={() => toggleDropdownIfAllowed("community")}
              onTriggerKeyDown={handleTriggerKeyDown}
            />
            <NavDropdownTrigger
              id="resources"
              label="Resources"
              isActive={activeSection === "resources"}
              isOpen={visibleDropdown === "resources"}
              triggerRef={resourcesTriggerRef}
              onOpen={() => openDropdownIfAllowed("resources")}
              onToggle={() => toggleDropdownIfAllowed("resources")}
              onTriggerKeyDown={handleTriggerKeyDown}
            />
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <NeopetsDonateButton variant="header-desktop" />
            <Link
              href={NEOPETS_PATHS.profile}
              className={`np-focus-ring flex min-h-10 min-w-10 items-center justify-center rounded-full transition-transform hover:scale-95 ${
                profileActive ? "bg-[#0d658c]/10 text-[#0d658c]" : "text-[#0d658c]"
              }`}
              aria-label="Profile (demo)"
              aria-current={profileActive ? "page" : undefined}
            >
              <span className="material-symbols-outlined text-2xl" aria-hidden>
                account_circle
              </span>
            </Link>
          </div>
        </div>
      </div>

      {activeDropdown ? (
        <div
          ref={desktopPanelRef}
          id={DESKTOP_DROPDOWN_ID}
          className="np-nav-quest-panel absolute inset-x-0 top-full z-40 hidden w-full border-t border-b border-[#ebe1d5] bg-[#fff8f2] py-1.5 lg:block"
          role="region"
          aria-labelledby={`${visibleDropdown}-trigger`}
          onKeyDown={handlePanelKeyDown}
        >
          <div className="mx-auto w-full max-w-[1200px] px-3 sm:px-5 lg:px-8">
            <NavDropdownLinks
              items={activeDropdown.items}
              pathname={pathname}
              onNavigate={() => {
                if (!pinnedDropdown && visibleDropdown) closeDropdown(visibleDropdown);
              }}
            />
          </div>
        </div>
      ) : null}

      {menuOpen ? (
        <nav
          ref={mobilePanelRef}
          id={MOBILE_NAV_PANEL_ID}
          className="absolute left-0 right-0 top-full z-55 border-t border-[#ebe1d5] bg-[#fcf2e6] lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="max-h-[min(75dvh,calc(100dvh-3rem))] overflow-y-auto overscroll-contain px-3 py-3">
            <div className="mb-3 flex gap-2">
              <NeopetsDonateButton variant="header-mobile" className="mt-0 ml-0 min-h-11 flex-1 justify-center" />
              <Link
                href={NEOPETS_PATHS.profile}
                className={`np-focus-ring flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-bold ${
                  profileActive
                    ? "border-[#0d658c] bg-[#0d658c] text-white"
                    : "border-[#ebe1d5] bg-[#fff8f2] text-[#0d658c]"
                }`}
                style={bodyFont}
                aria-current={profileActive ? "page" : undefined}
                onClick={closeMenu}
              >
                <span className="material-symbols-outlined text-xl" aria-hidden>
                  account_circle
                </span>
                Profile
              </Link>
            </div>

            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#745b00]" style={bodyFont}>
              Explore &amp; adopt
            </p>
            <ul className="mb-3 flex flex-col gap-1">
              {NEOPETS_MAIN_NAV.map((item) => {
                const sectionId = item.href === NEOPETS_PATHS.explorer ? "explore" : "journey";
                const active = activeSection === sectionId;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={mobileNavLinkClass(active)}
                      style={bodyFont}
                      aria-current={active ? "page" : undefined}
                      onClick={closeMenu}
                    >
                      <span className="material-symbols-outlined text-xl leading-none" aria-hidden>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-2">
              <MobileNavAccordion
                id="community"
                title="Community"
                items={NEOPETS_COMMUNITY_NAV}
                pathname={pathname}
                onNavigate={closeMenu}
              />
              <MobileNavAccordion
                id="resources"
                title="Resources"
                items={NEOPETS_RESOURCES_NAV}
                pathname={pathname}
                onNavigate={closeMenu}
              />
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
