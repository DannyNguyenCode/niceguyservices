"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import PixelKeyword from "@/components/ui/PixelKeyword";
import pricingContent from "./pricingContent.json";
import {
    pixelPageEyebrow,
    pixelPageHeading,
    pricingLayoutHeroHeadline as heroHeadline,
    pricingLayoutPixelLabel as pixelLabel,
} from "./pricingLayoutConstants";

export default function PricingHero() {
    const { hero } = pricingContent;

    return (
        <section className="relative w-full overflow-hidden pt-24 pb-16 md:pb-24 md:pt-28">
            <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-40" aria-hidden />
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div
                    className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
                    style={{ background: "radial-gradient(closest-side, var(--ng-hero-glow), transparent)" }}
                />
            </div>
            <div className="relative z-10 w-full">
                <div className="w-full">
                    <span
                        className={`mb-4 block text-sm font-bold tracking-[0.2em] ${pixelLabel} ${pixelPageEyebrow}`}
                    >
                        {hero.eyebrow}
                    </span>
                    <h1
                        className={`mb-6 w-full text-5xl leading-[1.1] font-extrabold tracking-tight md:text-7xl ${heroHeadline} ${pixelPageHeading}`}
                    >
                        Simple <PixelKeyword>Plans</PixelKeyword>, <br />
                        Serious <PixelKeyword variant="base">Results</PixelKeyword>
                    </h1>
                    <p className="w-full max-w-none text-xl font-light leading-relaxed text-[color:var(--ng-body)]">
                        {hero.subtitle}
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
                        <PixelCtaLink
                            href={pricingContent.meta.contactHref}
                            color="var(--ng-btn-coral)"
                            className="group"
                        >
                            Start your project
                            <ArrowRightIcon
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                aria-hidden
                            />
                        </PixelCtaLink>
                        <PixelCtaLink
                            href="/services"
                            color="var(--ng-btn-sky)"
                            className="group"
                        >
                            View services
                            <ArrowRightIcon
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                aria-hidden
                            />
                        </PixelCtaLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
