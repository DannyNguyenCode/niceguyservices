"use client";

import { ArrowRightIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import PixelKeyword from "@/components/ui/PixelKeyword";
import {
    pixelPageEyebrow,
    pixelPageHeading,
    pricingLayoutHeadline as headline,
    pricingLayoutHeroHeadline as heroHeadline,
    pricingLayoutPixelLabel as pixelLabel,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";
import type { HeroCta, HeroFocusCard, IntroImage } from "./aboutBiographyTypes";

type BiographyHeroProps = {
    eyebrow: string;
    headlineHighlight: string;
    headlinePlain: string;
    headlineBase: string;
    subtitle: string;
    primaryCta: HeroCta;
    secondaryCta: HeroCta;
    focusCard: HeroFocusCard;
    portrait: IntroImage;
};

export default function BiographyHero({
    eyebrow,
    headlineHighlight,
    headlinePlain,
    headlineBase,
    subtitle,
    primaryCta,
    secondaryCta,
    focusCard,
    portrait,
}: BiographyHeroProps) {
    return (
        <section
            className={`relative flex flex-col items-center gap-12 py-12 md:flex-row md:py-20 ${sitePageContentClass}`}
        >
            <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-30" aria-hidden />
            <div className="relative z-10 flex flex-1 flex-col space-y-6">
                <span
                    className={`w-fit text-sm font-bold tracking-[0.2em] ${pixelLabel} ${pixelPageEyebrow}`}
                >
                    {eyebrow}
                </span>
                <h1 className={`${heroHeadline} text-5xl leading-[1.1] font-extrabold tracking-tight sm:text-6xl md:text-6xl ${pixelPageHeading}`}>
                    <PixelKeyword>{headlineHighlight}</PixelKeyword>
                    <br />
                    {headlinePlain}{" "}
                    <PixelKeyword variant="base">{headlineBase}</PixelKeyword>
                </h1>
                <p className="max-w-xl text-xl leading-relaxed text-[color:var(--ng-body)]">
                    {subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                    <PixelCtaLink
                        href={primaryCta.href}
                        color="var(--ng-btn-coral)"
                        className="group"
                    >
                        {primaryCta.label}
                        <ArrowRightIcon
                            className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                            aria-hidden
                        />
                    </PixelCtaLink>
                    <PixelCtaLink
                        href={secondaryCta.href}
                        color="var(--ng-btn-sky)"
                    >
                        {secondaryCta.label}
                    </PixelCtaLink>
                </div>
            </div>
            <div className="relative z-10 flex flex-1 justify-center md:justify-end">
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
                            <div className={`${pixelLabel} text-xs font-black capitalize text-[color:var(--ng-body)]`}>
                                {focusCard.eyebrow}
                            </div>
                            <div className={`${headline} font-bold ${pixelPageHeading}`}>
                                {focusCard.title}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
