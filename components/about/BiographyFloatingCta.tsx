"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type BiographyFloatingCtaProps = {
    href: string;
    label: string;
};

export default function BiographyFloatingCta({
    href,
    label,
}: BiographyFloatingCtaProps) {
    return (
        <div className="pointer-events-none fixed right-4 bottom-6 z-100 md:right-8 md:bottom-8">
            <Link
                href={href}
                className="pointer-events-auto flex items-center space-x-3 rounded-full border border-base-300/30 bg-base-100 p-3 pr-5 shadow-[0px_12px_32px_rgba(44,47,48,0.06)] transition-all hover:scale-105 active:scale-95 md:p-4 md:pr-6"
            >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content">
                    <PaperAirplaneIcon className="h-5 w-5" aria-hidden />
                </span>
                <span className="font-pm-headline text-xs font-bold tracking-widest">
                    {label}
                </span>
            </Link>
        </div>
    );
}
