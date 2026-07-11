"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import PixelKeyword from "@/components/ui/PixelKeyword";
import featuredWorkContent from "@/components/featuredWork/featuredWorkContent.json";
import {
    pixelPageEyebrow,
    pixelPageHeading,
    pricingLayoutHeroHeadline as heroHeadline,
    pricingLayoutPixelLabel as pixelLabel,
    responsiveHeroBodyClass,
    responsivePageHeroTitleClass,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";

export default function WorkHero() {
    const { meta, hero } = featuredWorkContent;

    return (
        <section className="relative w-full overflow-hidden pt-24 pb-12 sm:pb-16 md:pb-24 md:pt-28">
            <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-40" aria-hidden />
            <div className={`relative z-10 ${sitePageContentClass}`}>
                <div className="w-full min-w-0">
                    <span
                        className={`mb-4 block text-sm font-bold ${pixelLabel} ${pixelPageEyebrow}`}
                    >
                        {hero.eyebrow}
                    </span>
                    <h1
                        className={`mb-6 w-full min-w-0 text-balance font-extrabold ${heroHeadline} ${responsivePageHeroTitleClass} ${pixelPageHeading}`}
                    >
                        Featured <PixelKeyword>Websites</PixelKeyword> <br />
                        Built With{" "}
                        <PixelKeyword variant="base">Clarity</PixelKeyword>,{" "}
                        <PixelKeyword variant="base">Care</PixelKeyword>, And{" "}
                        <PixelKeyword variant="base">Purpose</PixelKeyword>
                    </h1>
                    <p className={`w-full max-w-none ${responsiveHeroBodyClass} text-[color:var(--ng-body)]`}>
                        {hero.subtitle}
                    </p>
                    <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
                        <PixelCtaLink
                            href={meta.contactHref}
                            color="var(--ng-btn-coral)"
                            className="group"
                        >
                            {hero.primaryCta}
                            <ArrowRightIcon
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                aria-hidden
                            />
                        </PixelCtaLink>
                        <PixelCtaLink
                            href={meta.servicesHref}
                            color="var(--ng-btn-sky)"
                            className="group"
                        >
                            {hero.secondaryCta}
                            <ArrowRightIcon
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                aria-hidden
                            />
                        </PixelCtaLink>
                    </div>
                    <p
                        className="mt-8 border-l-2 py-1 pl-4 text-sm italic text-[color:var(--ng-body)]"
                        style={{ borderColor: "var(--ng-border)" }}
                    >
                        {hero.note}
                    </p>
                </div>
            </div>
        </section>
    );
}
