import type { ReactNode } from "react";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import {
    pricingLayoutHeroHeadline as heroHeadline,
    pricingLayoutPixelLabel as pixelLabel,
    pixelPageEyebrow,
    pixelPageHeading,
    responsiveHeroBodyClass,
    responsivePageHeroTitleClass,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";

type PageHeroProps = {
    eyebrow: string;
    title: ReactNode;
    description: string;
    primaryHref?: string;
    primaryLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    visual?: ReactNode;
};

export default function PageHero({
    eyebrow,
    title,
    description,
    primaryHref,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
    visual,
}: PageHeroProps) {
    return (
        <section className="relative w-full overflow-hidden pt-24 pb-12 sm:pb-16 md:pb-24 md:pt-28">
            <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-40" aria-hidden />
            <div className={`relative z-10 ${sitePageContentClass}`}>
                <div className={visual ? "grid min-w-0 grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12" : ""}>
                    <div className={visual ? "min-w-0 lg:col-span-7" : "w-full min-w-0"}>
                        <span
                            className={`mb-4 block text-sm font-bold ${pixelLabel} ${pixelPageEyebrow}`}
                        >
                            {eyebrow}
                        </span>
                        <h1
                            className={`mb-6 w-full min-w-0 text-balance font-extrabold ${heroHeadline} ${responsivePageHeroTitleClass} ${pixelPageHeading}`}
                        >
                            {title}
                        </h1>
                        <p className={`w-full max-w-none ${responsiveHeroBodyClass} text-[color:var(--ng-body)]`}>
                            {description}
                        </p>
                        {primaryHref && primaryLabel ? (
                            <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
                                <PixelCtaLink
                                    href={primaryHref}
                                    color="var(--ng-btn-coral)"
                                    className="group"
                                >
                                    {primaryLabel}
                                </PixelCtaLink>
                                {secondaryHref && secondaryLabel ? (
                                    <PixelCtaLink
                                        href={secondaryHref}
                                        color="var(--ng-btn-sky)"
                                        className="group"
                                    >
                                        {secondaryLabel}
                                    </PixelCtaLink>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                    {visual ? (
                        <div className="min-w-0 lg:col-span-5" aria-hidden>
                            {visual}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
