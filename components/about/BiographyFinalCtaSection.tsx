"use client";

import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type BiographyFinalCtaSectionProps = {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
};

export default function BiographyFinalCtaSection({
    title,
    description,
    buttonLabel,
    buttonHref,
}: BiographyFinalCtaSectionProps) {
    return (
        <section className="relative overflow-hidden py-24 md:py-32">
            <div
                className="absolute inset-0 bg-linear-to-br from-primary to-(--pm-primary-container) opacity-[0.07]"
                aria-hidden
            />
            <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-8">
                <h2 className="font-pm-headline mb-8 text-4xl font-bold tracking-tight text-(--pm-on-surface) md:text-5xl">
                    {title}
                </h2>
                <p className="mb-12 text-xl text-(--pm-on-surface-variant)">
                    {description}
                </p>
                <Link
                    href={buttonHref}
                    className="inline-flex items-center gap-3 rounded-full bg-(--pm-on-surface) px-10 py-5 font-pm-headline text-lg font-bold text-(--pm-surface) transition-colors hover:bg-primary hover:text-primary-content"
                >
                    {buttonLabel}
                    <PaperAirplaneIcon
                        className="h-6 w-6 shrink-0"
                        aria-hidden
                    />
                </Link>
            </div>
        </section>
    );
}
