"use client";

import { ArrowRightIcon, CodeBracketIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import type { HeroCta, HeroFocusCard, IntroImage } from "./aboutBiographyTypes";

type BiographyHeroProps = {
    locationEyebrow: string;
    headlineLine1: string;
    headlineAccent: string;
    subtitle: string;
    primaryCta: HeroCta;
    secondaryCta: HeroCta;
    focusCard: HeroFocusCard;
    portrait: IntroImage;
};

export default function BiographyHero({
    locationEyebrow,
    headlineLine1,
    headlineAccent,
    subtitle,
    primaryCta,
    secondaryCta,
    focusCard,
    portrait,
}: BiographyHeroProps) {
    return (
        <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-12 md:flex-row md:px-8 md:py-20">
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-(--pm-outline-variant)/25 bg-(--pm-surface-low) px-3 py-1">
                    <MapPinIcon
                        className="h-4 w-4 shrink-0 text-primary"
                        aria-hidden
                    />
                    <span className="font-pm-headline text-xs font-bold tracking-widest text-(--pm-on-surface-variant) uppercase">
                        {locationEyebrow}
                    </span>
                </div>
                <h1 className="font-pm-headline text-5xl leading-none font-bold tracking-tighter text-(--pm-on-surface) sm:text-6xl md:text-6xl">
                    {headlineLine1}{" "}
                    <span className="text-primary italic">{headlineAccent}</span>
                </h1>
                <p className="max-w-xl text-xl leading-relaxed text-(--pm-on-surface-variant)">
                    {subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link
                        href={primaryCta.href}
                        className="inline-flex items-center gap-2 rounded-xl bg-linear-to-br from-primary to-(--pm-primary-container) px-8 py-4 font-pm-headline font-bold text-primary-content shadow-lg transition-shadow hover:shadow-xl"
                    >
                        {primaryCta.label}
                        <ArrowRightIcon
                            className="h-5 w-5 shrink-0"
                            aria-hidden
                        />
                    </Link>
                    <Link
                        href={secondaryCta.href}
                        className="rounded-xl border border-(--pm-outline-variant)/25 px-8 py-4 font-pm-headline font-bold transition-colors hover:bg-(--pm-surface-low)"
                    >
                        {secondaryCta.label}
                    </Link>
                </div>
            </div>
            <div className="relative flex flex-1 justify-center md:justify-end">
                <div
                    className="border-primary/20 absolute -top-4 -left-4 hidden h-[min(100%,420px)] w-[min(100%,420px)] rounded-full border animate-pulse md:block"
                    aria-hidden
                />
                <div className="relative z-10">
                    <Image
                        src={portrait.src}
                        alt={portrait.alt}
                        width={450}
                        height={450}
                        className="h-72 w-72 rounded-full border-8 border-(--pm-white) object-cover shadow-2xl dark:border-base-100 md:h-[min(100vw-4rem,450px)] md:w-[min(100vw-4rem,450px)]"
                        priority
                    />
                </div>
                <div className="border-(--pm-outline-variant)/15 absolute -right-2 -bottom-6 z-20 rounded-2xl border bg-(--pm-white) p-6 shadow-xl dark:bg-base-100 md:-right-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-content">
                            <CodeBracketIcon
                                className="h-6 w-6"
                                aria-hidden
                            />
                        </div>
                        <div>
                            <div className="font-pm-headline text-xs font-black text-(--pm-on-surface-variant) uppercase">
                                {focusCard.eyebrow}
                            </div>
                            <div className="font-pm-headline font-bold text-(--pm-on-surface)">
                                {focusCard.title}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
