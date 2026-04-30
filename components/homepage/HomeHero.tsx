"use client";

import Link from "next/link";
import homepageContent from "./homepageContent.json";

export default function HomeHero() {
    const { hero } = homepageContent;

    return (
        <section
            className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-7xl flex-col items-center justify-center px-4 py-12 text-center md:py-16"
            aria-labelledby="home-hero-heading"
        >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 font-pm-headline text-xs font-bold tracking-widest text-secondary-content uppercase">
                <span
                    className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-secondary-content"
                    aria-hidden
                />
                {hero.availabilityBadge}
            </div>
            <h1
                id="home-hero-heading"
                className="font-pm-headline mb-10 text-5xl leading-none font-bold tracking-tighter text-(--pm-on-surface) md:text-7xl lg:text-8xl"
            >
                {hero.headlineBefore}{" "}
                <span className="bg-linear-to-r from-primary to-(--pm-primary-container) bg-clip-text text-transparent">
                    {hero.headlineGradient}
                </span>
            </h1>
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-(--pm-on-surface-variant)">
                {hero.subtitle}
            </p>
            <div className="flex justify-center">
                <Link
                    href={hero.primaryCta.href}
                    className="rounded-full bg-linear-to-br from-primary to-(--pm-primary-container) px-10 py-4 font-pm-headline font-bold tracking-wide text-primary-content shadow-xl shadow-primary/25 transition-opacity hover:opacity-90"
                >
                    {hero.primaryCta.label}
                </Link>
            </div>
        </section>
    );
}
