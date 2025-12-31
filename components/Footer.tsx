"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const pages = [
    { title: "Home", link: "/" },
    { title: "Services", link: "/services" },
    { title: "Pricing", link: "/pricing" },
    { title: "About Us", link: "/about" },
    { title: "Contact", link: "/contact" },
];

export default function Footer() {
    return (
        <footer className="footer sm:footer-horizontal items-center p-6 mt-12">
            {/* LEFT SIDE — Logo + About Text */}
            <aside className="flex flex-col gap-2 items-start">
                <Link href="/" className="flex items-center" aria-label="Go to homepage">
                    <Image
                        src="/logoNiceGuyServices.svg"
                        width={50}
                        height={50}
                        alt="Nice Guy Services Logo"
                    />
                </Link>

                <p className="text-sm">
                    Custom websites for small businesses in Toronto and the GTA.
                </p>

                <p className="text-sm">
                    © {new Date().getFullYear()} Nice Guy Services. All rights reserved.
                </p>
            </aside>

            {/* RIGHT SIDE — Footer Navigation + Socials */}
            <nav className="flex flex-col gap-4 md:place-self-center md:justify-self-end" aria-label="Footer navigation">
                {/* Navigation Links */}
                <ul className="grid grid-flow-col gap-4 text-sm">
                    {pages.map((page) => (
                        <li key={page.title}>
                            <Link
                                href={page.link}
                                className="hover:text-primary transition-colors"
                            >
                                {page.title}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Social Icons */}
                <div className="grid grid-flow-col gap-4 mt-1" aria-label="Social links">
                    {/* Twitter / X */}
                    <a
                        href="https://x.com/BaoGiaNguyen"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                        aria-label="Nice Guy Services on X"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1200 1227"
                            className="w-6 h-6 fill-current"
                        >
                            <path d="M714.163 519.284L1160.89 0H1057.7L671.303 450.887L393.196 0H0L468.49 727.515L0 1226.62H103.19L512.057 744.779L806.803 1226.62H1200L714.137 519.284H714.163ZM563.43 672.043L517.516 602.826L137.115 79.6012H341.8L620.757 511.028L666.671 580.244L1057.81 1180.19H853.128L563.43 672.043Z" />
                        </svg>
                    </a>

                    {/* GitHub */}
                    <a
                        href="https://github.com/DannyNguyenCode"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                        aria-label="Danny Nguyen on GitHub"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-6 h-6 fill-current"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.07-.74.08-.73.08-.73 1.18.08 1.8 1.22 1.8 1.22 1.05 1.79 2.75 1.27 3.42.97.11-.77.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.2-3.11-.12-.3-.52-1.52.11-3.17 0 0 .97-.31 3.18 1.19a10.9 10.9 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.64 1.65.24 2.87.12 3.17.75.82 1.2 1.85 1.2 3.11 0 4.44-2.69 5.4-5.25 5.68.42.36.8 1.1.8 2.22v3.29c0 .31.21.68.8.56A10.99 10.99 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"
                            />
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com/in/gia-bao-danny-nguyen/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                        aria-label="Nice Guy Services on LinkedIn"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            className="w-6 h-6 fill-current"
                        >
                            <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341C24.36 107 0 82.6 0 53.9A53.9 53.9 0 0 1 53.84 0C83.5 0 107.33 24.34 107.33 53.9c0 28.7-23.82 53.14-53.49 53.14zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.7 37.72-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                        </svg>
                    </a>
                </div>
            </nav>
        </footer>
    );
}
