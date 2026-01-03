"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggleBtn from "./ThemeToggleBtn";

const pages = [
    { title: "Home", link: "/" },
    { title: "Services", link: "/services" },
    { title: "Pricing", link: "/pricing" },
    { title: "About Us", link: "/about" },
    { title: "Contact", link: "/contact" },
    { title: "Resources", link: "/resources" },
];

export default function Navigation() {
    return (
        <div className="navbar bg-neutral/90 backdrop-blur-md  text-neutral-content  shadow-sm  px-4  sticky top-0  z-50" id="nav">
            {/* LEFT — Mobile Menu + Logo */}
            <div className="navbar-start">
                {/* Mobile dropdown */}
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost lg:hidden"
                        aria-label="Open menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-8 6h8"
                            />
                        </svg>
                    </div>

                    {/* Mobile Menu Items */}
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow"
                    >
                        {pages.map((p) => (
                            <li key={p.title}>
                                <Link href={p.link}>{p.title}</Link>
                            </li>
                        ))}
                        <li className="mt-1">
                            <ThemeToggleBtn />
                        </li>
                    </ul>
                </div>

                {/* LOGO */}
                <Link href="/" className="px-2 " aria-label="Go to homepage">
                    <Image
                        src="/logoNiceGuyServices.svg"
                        width={55}
                        height={55}
                        alt="Nice Guy Services Logo"
                        priority
                        className="px-1 transition "
                    />
                </Link>
            </div>

            {/* CENTER — Desktop Menu */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-2 px-1 text-base">
                    {pages.map((p) => (
                        <li key={p.title}>
                            <Link
                                href={p.link}
                                className="hover:text-primary transition-colors font-medium"
                            >
                                {p.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* RIGHT — Theme Toggle */}
            <div className="navbar-end">
                <ThemeToggleBtn />
            </div>
        </div>
    );
}
