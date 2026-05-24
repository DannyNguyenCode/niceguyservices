"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/siteConfig";

const LOGO_SRC = "/blue_logo_test.png";
const BRAND_NAME = "Nice Guy Web Design";

const FOOTER_PAGES = [
    { title: "Home", link: "/" },
    { title: "Services", link: "/services" },
    { title: "Pricing", link: "/pricing" },
    { title: "About Us", link: "/about" },
    { title: "Resources", link: "/resources" },
    { title: "Contact", link: "/contact" },
] as const;

const linkMuted =
    "text-[#414845] transition-colors hover:text-[#416359]";
const socialBtn =
    "inline-flex items-center justify-center rounded-lg p-2 text-[#414845] transition-colors hover:text-[#416359]";

function BrandMark({ showName = true }: { showName?: boolean }) {
    return (
        <Link
            href="/"
            className="flex min-w-0 items-center gap-2 sm:gap-3"
            aria-label={`${BRAND_NAME} home`}
        >
            <Image
                src={LOGO_SRC}
                width={160}
                height={55}
                alt="Nice Guy Services"
                className="h-9 w-auto max-w-[120px] shrink-0 object-contain object-left sm:h-10 sm:max-w-[140px]"
                priority={showName}
            />
            {showName ? (
                <span className="dc-display truncate text-lg leading-tight font-bold text-[#416359] sm:text-xl md:text-2xl">
                    {BRAND_NAME}
                </span>
            ) : null}
        </Link>
    );
}

export function DigitalCraftsmanHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#c1c8c4] bg-[#fbf9f8]">
            <div className="mx-auto flex h-16 max-w-[1120px] items-center px-4 md:px-6">
                <BrandMark />
            </div>
        </header>
    );
}

export function DigitalCraftsmanFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-16 w-full border-t border-[#c1c8c4] bg-white">
            <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between md:py-12">
                <aside className="flex flex-col items-start gap-2">
                    <Link href="/" className="flex items-center" aria-label="Go to homepage">
                        <Image
                            src={LOGO_SRC}
                            width={160}
                            height={50}
                            alt={BUSINESS.name}
                            className="h-[50px] w-auto max-w-[160px] object-contain object-left"
                        />
                    </Link>

                    <p className="text-sm text-[#414845]">
                        Custom websites for small businesses in Toronto and the GTA.
                    </p>

                    <address className="not-italic text-sm text-[#414845]">
                        <span className="sr-only">Contact: </span>
                        <span className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1">
                            <a
                                href={`tel:${BUSINESS.phoneE164}`}
                                className={`shrink-0 ${linkMuted}`}
                            >
                                {BUSINESS.phoneDisplay}
                            </a>
                            <span className="text-[#c1c8c4]" aria-hidden>
                                ·
                            </span>
                            <a
                                href={`mailto:${BUSINESS.email}`}
                                className={`min-w-0 break-all ${linkMuted}`}
                            >
                                {BUSINESS.email}
                            </a>
                        </span>
                    </address>

                    <p className="text-sm text-[#414845]/80">
                        © {year} {BUSINESS.name}. All rights reserved.
                    </p>
                </aside>

                <nav
                    className="flex flex-col gap-8 md:place-self-center md:justify-self-end"
                    aria-label="Footer navigation"
                >
                    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm md:justify-end">
                        {FOOTER_PAGES.map((page) => (
                            <li key={page.title}>
                                <Link href={page.link} className={linkMuted}>
                                    {page.title}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div
                        className="mt-1 flex flex-wrap items-center gap-2"
                        aria-label="Social links"
                    >
                        <a
                            href="https://x.com/BaoGiaNguyen"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={socialBtn}
                            aria-label={`${BUSINESS.name} on X`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1200 1227"
                                className="h-6 w-6 fill-current"
                                aria-hidden
                            >
                                <path d="M714.163 519.284L1160.89 0H1057.7L671.303 450.887L393.196 0H0L468.49 727.515L0 1226.62H103.19L512.057 744.779L806.803 1226.62H1200L714.137 519.284H714.163ZM563.43 672.043L517.516 602.826L137.115 79.6012H341.8L620.757 511.028L666.671 580.244L1057.81 1180.19H853.128L563.43 672.043Z" />
                            </svg>
                        </a>

                        <a
                            href="https://github.com/DannyNguyenCode"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={socialBtn}
                            aria-label="Danny Nguyen on GitHub"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="h-6 w-6 fill-current"
                                aria-hidden
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.07-.74.08-.73.08-.73 1.18.08 1.8 1.22 1.8 1.22 1.05 1.79 2.75 1.27 3.42.97.11-.77.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.2-3.11-.12-.3-.52-1.52.11-3.17 0 0 .97-.31 3.18 1.19a10.9 10.9 0 0 1 5.8 0c2.2-1.5 3.17-1.19 3.17-1.19.64 1.65.24 2.87.12 3.17.75.82 1.2 1.85 1.2 3.11 0 4.44-2.69 5.4-5.25 5.68.42.36.8 1.1.8 2.22v3.29c0 .31.21.68.8.56A10.99 10.99 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"
                                />
                            </svg>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/gia-bao-danny-nguyen/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={socialBtn}
                            aria-label={`${BUSINESS.name} on LinkedIn`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                                className="h-6 w-6 fill-current"
                                aria-hidden
                            >
                                <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341C24.36 107 0 82.6 0 53.9A53.9 53.9 0 0 1 53.84 0C83.5 0 107.33 24.34 107.33 53.9c0 28.7-23.82 53.14-53.49 53.14zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.7 37.72-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                            </svg>
                        </a>
                    </div>
                </nav>
            </div>
        </footer>
    );
}

export function DigitalCraftsmanAuditButton({
    className = "",
    children = "Get an AI Audit",
}: {
    className?: string;
    children?: ReactNode;
}) {
    return (
        <Link
            href="/contact"
            className={`dc-audit-btn inline-block rounded bg-[#416359] px-8 py-4 text-sm font-medium tracking-widest text-white uppercase transition-all duration-150 hover:bg-[#597b71] active:scale-95 ${className}`}
        >
            {children}
        </Link>
    );
}
