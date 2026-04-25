"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ThemeToggleBtn from "./ThemeToggleBtn";
import { useTheme } from "@/components/theme/ThemeProvider";

const pages = [
    { title: "Home", link: "/" },
    { title: "Services", link: "/services" },
    { title: "Pricing", link: "/pricing" },
    { title: "About Us", link: "/about" },
    { title: "Contact", link: "/contact" },
    { title: "Resources", link: "/resources" },
];

function isNavActive(pathname: string, href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navigation() {
    const pathname = usePathname();
    const { theme } = useTheme();
    const navRef = useRef<HTMLDivElement>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menuTopPx, setMenuTopPx] = useState(0);
    const logoSrc =
        theme === "dark" ? "/logoNiceGuyServices.svg" : "/blue_logo_test.png";

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
        const id = window.setTimeout(() => {
            setMobileOpen(false);
        }, 0);
        return () => window.clearTimeout(id);
    }, [pathname]);

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

    return (
        <div
            ref={navRef}
            className="navbar sticky top-0 z-50 min-h-16 flex-nowrap items-center gap-4 border-b border-base-300/60 bg-base-100/80 px-6 text-base-content shadow-sm backdrop-blur-md transition-[background-color,border-color,color] duration-200 sm:px-10 md:px-12 lg:px-16 xl:px-20"
            id="nav"
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
                        className="btn btn-ghost border-0 shadow-none"
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
                            className="menu menu-sm dropdown-content fixed! inset-x-0 z-60 max-h-[min(75dvh,calc(100dvh-4rem))] w-full max-w-none translate-none! flex-col overflow-y-auto rounded-none border-0 border-b border-base-300 bg-base-100 p-0 shadow-lg"
                            style={{
                                top:
                                    menuTopPx > 0
                                        ? `${menuTopPx}px`
                                        : undefined,
                            }}
                        >
                            {pages.map((p) => {
                                const active = isNavActive(pathname, p.link);
                                return (
                                    <li
                                        key={p.title}
                                        className="w-full border-b border-base-300 last:border-b-0"
                                    >
                                        <Link
                                            href={p.link}
                                            aria-current={
                                                active ? "page" : undefined
                                            }
                                            onClick={() =>
                                                setMobileOpen(false)
                                            }
                                            className={[
                                                "block w-full rounded-none py-4 pr-6 pl-6 text-base font-medium",
                                                active
                                                    ? "bg-base-200 text-primary"
                                                    : "text-base-content hover:bg-base-200/70",
                                            ].join(" ")}
                                        >
                                            {p.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : null}
                </div>

                <Link
                    href="/"
                    className="hidden items-center pl-1 pr-2 lg:flex"
                    aria-label="Go to homepage"
                >
                    <Image
                        src={logoSrc}
                        width={160}
                        height={55}
                        alt="Nice Guy Services"
                        className="h-[55px] w-auto max-w-[160px] object-contain object-left transition"
                    />
                </Link>
            </div>

            <Link
                href="/"
                className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center lg:hidden"
                aria-label="Go to homepage"
            >
                <Image
                    src={logoSrc}
                    width={160}
                    height={55}
                    alt="Nice Guy Services"
                    priority
                    className="h-[52px] w-auto max-w-[min(9rem,42vw)] object-contain object-center transition sm:h-[55px] sm:max-w-[140px]"
                />
            </Link>

            <div className="navbar-center hidden min-w-0 flex-1 justify-center lg:flex">
                <ul className="menu menu-horizontal flex flex-nowrap items-center justify-center gap-x-2 text-base sm:gap-x-4 lg:gap-x-6">
                    {pages.map((p) => {
                        const active = isNavActive(pathname, p.link);
                        return (
                            <li key={p.title} className="shrink-0">
                                <Link
                                    href={p.link}
                                    aria-current={active ? "page" : undefined}
                                    className={[
                                        "inline-flex whitespace-nowrap rounded-lg px-2 py-2 font-medium transition-colors sm:px-3",
                                        active
                                            ? "bg-base-200 text-primary"
                                            : "text-base-content/80 hover:bg-base-200 hover:text-primary",
                                    ].join(" ")}
                                >
                                    {p.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="navbar-end z-20 flex shrink-0 items-center pl-2 lg:z-auto">
                <ThemeToggleBtn />
            </div>
        </div>
    );
}
