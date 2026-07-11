"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import PixelKeyword from "@/components/ui/PixelKeyword";
import {
    pixelPageEyebrow,
    pixelPageHeading,
    pricingLayoutHeroHeadline as heroHeadline,
    pricingLayoutPixelLabel as pixelLabel,
    responsiveHeroBodyClass,
    responsivePageHeroTitleClass,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";

export default function ServicesHero() {
    return (
        <section className="relative w-full overflow-hidden pt-24 pb-12 sm:pb-16 md:pb-24 md:pt-28">
            <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-40" aria-hidden />
            <div className={`relative z-10 ${sitePageContentClass}`}>
                <div className="w-full min-w-0">
                    <span
                        className={`mb-4 block text-sm font-bold ${pixelLabel} ${pixelPageEyebrow}`}
                    >
                        Professional capabilities
                    </span>
                    <h1
                        className={`mb-6 w-full min-w-0 text-balance font-extrabold ${heroHeadline} ${responsivePageHeroTitleClass} ${pixelPageHeading}`}
                    >
                        Web Design &amp; <br />
                        <PixelKeyword>Development</PixelKeyword> <br />
                        For Small <PixelKeyword variant="base">Businesses</PixelKeyword>
                    </h1>
                    <p
                        className={`w-full max-w-none ${responsiveHeroBodyClass} text-[color:var(--ng-body)]`}
                    >
                        Custom sites that load fast, rank well, and stay easy to maintain — built with
                        modern stacks and explained in plain language.
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
                        <PixelCtaLink
                            href="/contact"
                            color="var(--ng-btn-coral)"
                            className="group"
                        >
                            Start a project
                            <ArrowRightIcon
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                aria-hidden
                            />
                        </PixelCtaLink>
                        <PixelCtaLink
                            href="/work"
                            color="var(--ng-btn-sky)"
                            className="group"
                        >
                            View work
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
