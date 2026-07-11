"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ThemeToggleBtn from "./ThemeToggleBtn";
import { useTheme } from "@/components/theme/ThemeProvider";
import { getSiteLogoForTheme } from "@/lib/siteConfig";
import {
    isNavItemActive,
    isNavPathActive,
    mainNavigation,
    type NavItem,
} from "@/lib/navigation";
import { isDarkTheme } from "@/lib/themes/siteTheme";
import { siteNavLinkClass } from "@/components/pricing/pricingLayoutConstants";

function navLinkClasses(active: boolean) {
    return [
        siteNavLinkClass,
        active
            ? "bg-base-200 font-semibold text-(--pm-on-surface) ring-1 ring-inset ring-primary/35"
            : "text-(--pm-on-surface)/85 hover:bg-base-200 hover:text-(--pm-on-surface)",
    ].join(" ");
}

function WorkDropdown({
    item,
    pathname,
    onNavigate,
}: {
    item: Extract<NavItem, { type: "dropdown" }>;
    pathname: string;
    onNavigate?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLLIElement>(null);
    const firstLinkRef = useRef<HTMLAnchorElement>(null);
    const buttonId = "work-nav-button";
    const menuId = "work-nav-submenu";
    const active = isNavItemActive(pathname, item);

    useEffect(() => {
        if (!open) return;
        firstLinkRef.current?.focus();
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onDoc = (e: MouseEvent) => {
            if (ref.current?.contains(e.target as Node)) return;
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const openMenu = () => setOpen(true);
    const closeMenu = () => setOpen(false);
    const toggleMenu = () => setOpen((o) => !o);

    return (
        <li ref={ref} className="relative shrink-0">
            <button
                type="button"
                id={buttonId}
                className={`inline-flex min-h-11 items-center gap-1 whitespace-nowrap px-2 py-2 font-medium sm:px-3 ${navLinkClasses(active)}`}
                aria-expanded={open}
                aria-controls={menuId}
                onClick={toggleMenu}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openMenu();
                    }
                    if (e.key === "Escape") {
                        closeMenu();
                    }
                }}
            >
                {item.title}
                <span aria-hidden className="text-xs">
                    ▾
                </span>
            </button>
            {open ? (
                <ul
                    id={menuId}
                    aria-labelledby={buttonId}
                    className="menu absolute top-full left-0 z-50 mt-1 min-w-[220px] rounded-lg bg-base-100 p-2 shadow-lg ring-1 ring-base-300/60"
                >
                    {item.children.map((child, index) => {
                        const childActive = isNavPathActive(pathname, child.href);
                        return (
                            <li key={child.href}>
                                <Link
                                    ref={index === 0 ? firstLinkRef : undefined}
                                    href={child.href}
                                    aria-current={childActive ? "page" : undefined}
                                    className={`block min-h-11 rounded-md px-3 py-2 text-sm ${navLinkClasses(childActive)}`}
                                    onClick={() => {
                                        closeMenu();
                                        onNavigate?.();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Escape") {
                                            e.preventDefault();
                                            closeMenu();
                                            document.getElementById(buttonId)?.focus();
                                        }
                                    }}
                                >
                                    {child.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </li>
    );
}

export default function Navigation() {
    const pathname = usePathname();
    const { theme } = useTheme();
    const navRef = useRef<HTMLDivElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuTopPx, setMenuTopPx] = useState(0);
    const logoSrc = getSiteLogoForTheme(theme);
    const logoBlendClass = isDarkTheme(theme) ? "mix-blend-lighten" : "";

    useLayoutEffect(() => {
        if (!mobileOpen || !navRef.current) return;
        const update = () => {
            if (navRef.current) {
                setMenuTopPx(navRef.current.getBoundingClientRect().bottom);
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [mobileOpen]);

    useEffect(() => {
        const id = window.setTimeout(() => setMobileOpen(false), 0);
        return () => window.clearTimeout(id);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    useEffect(() => {
        if (!mobileOpen) return;
        const onDocMouseDown = (e: MouseEvent) => {
            if (navRef.current?.contains(e.target as Node)) return;
            setMobileOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMobileOpen(false);
        };
        document.addEventListener("mousedown", onDocMouseDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onDocMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [mobileOpen]);

    const renderMobileItem = (item: NavItem) => {
        if (item.type === "link") {
            const active = isNavPathActive(pathname, item.href);
            return (
                <li key={item.href} className="w-full border-b border-base-300 last:border-b-0">
                    <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={`block w-full min-h-11 rounded-none py-4 pr-6 pl-6 text-base font-medium ${navLinkClasses(active)}`}
                    >
                        {item.title}
                    </Link>
                </li>
            );
        }
        return (
            <li key={item.href} className="w-full border-b border-base-300">
                <div className="px-6 py-3 text-xs font-semibold uppercase text-(--pm-on-surface-variant)">
                    {item.title}
                </div>
                <ul>
                    {item.children.map((child) => {
                        const active = isNavPathActive(pathname, child.href);
                        return (
                            <li key={child.href}>
                                <Link
                                    href={child.href}
                                    aria-current={active ? "page" : undefined}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block w-full min-h-11 py-3 pr-6 pl-10 text-base font-medium ${navLinkClasses(active)}`}
                                >
                                    {child.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </li>
        );
    };

    return (
        <header className="sticky top-0 z-50">
            <nav
                ref={navRef}
                className="navbar h-16 min-h-16 flex-nowrap items-center gap-2 overflow-x-clip border-b border-base-300/60 bg-base-100/80 px-4 text-base-content shadow-sm backdrop-blur-md transition-[background-color,border-color,color] duration-200 sm:gap-4 sm:px-6 md:px-12 lg:px-16 xl:px-20"
                id="nav"
                aria-label="Main"
            >
            <div className="navbar-start z-20 flex min-w-0 shrink-0 items-center lg:z-auto lg:gap-3">
                <div
                    className={[
                        "dropdown dropdown-bottom lg:hidden",
                        mobileOpen ? "dropdown-open" : "",
                    ].join(" ")}
                >
                    <button
                        type="button"
                        className="btn btn-ghost min-h-11 min-w-11 border-0 shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav-menu"
                        onClick={() => setMobileOpen((o) => !o)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-8 6h8"
                            />
                        </svg>
                    </button>

                    {mobileOpen ? (
                        <ul
                            id="mobile-nav-menu"
                            role="navigation"
                            aria-label="Mobile"
                            className="menu menu-sm dropdown-content fixed! inset-x-0 z-60 max-h-[min(75dvh,calc(100dvh-4rem))] w-full max-w-none translate-none! flex-col overflow-y-auto rounded-none border-0 border-b border-base-300 bg-base-100 p-0 shadow-lg"
                            style={{
                                top: menuTopPx > 0 ? `${menuTopPx}px` : undefined,
                            }}
                        >
                            {mainNavigation.map(renderMobileItem)}
                        </ul>
                    ) : null}
                </div>

                <Link
                    href="/"
                    className="hidden h-16 items-center bg-transparent pl-1 pr-2 hover:bg-transparent lg:flex"
                    aria-label="Go to homepage"
                >
                    <Image
                        src={logoSrc}
                        width={160}
                        height={160}
                        alt=""
                        className={`h-16 max-h-16 w-auto bg-transparent object-contain object-left transition ${logoBlendClass}`}
                    />
                </Link>
            </div>

            <Link
                href="/"
                className="absolute top-1/2 left-1/2 z-10 flex h-16 -translate-x-1/2 -translate-y-1/2 items-center bg-transparent hover:bg-transparent lg:hidden"
                aria-label="Go to homepage"
            >
                <Image
                    src={logoSrc}
                    width={160}
                    height={160}
                    alt=""
                    priority
                    className={`h-16 max-h-16 w-auto bg-transparent object-contain object-center transition ${logoBlendClass}`}
                />
            </Link>

            <div className="navbar-center hidden min-w-0 flex-1 justify-center lg:flex">
                <ul className="menu menu-horizontal flex flex-nowrap items-center justify-center gap-x-2 text-base sm:gap-x-4 lg:gap-x-6">
                    {mainNavigation.map((item) =>
                        item.type === "dropdown" ? (
                            <WorkDropdown key={item.href} item={item} pathname={pathname} />
                        ) : (
                            <li key={item.href} className="shrink-0">
                                <Link
                                    href={item.href}
                                    aria-current={
                                        isNavPathActive(pathname, item.href)
                                            ? "page"
                                            : undefined
                                    }
                                    className={`inline-flex min-h-11 items-center whitespace-nowrap px-2 py-2 font-medium sm:px-3 ${navLinkClasses(isNavPathActive(pathname, item.href))}`}
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ),
                    )}
                </ul>
            </div>

            <div className="navbar-end z-20 flex shrink-0 items-center pl-2 lg:z-auto">
                <ThemeToggleBtn />
            </div>
            </nav>
        </header>
    );
}
