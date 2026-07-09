"use client";

import PixelCtaLink from "@/components/ui/PixelCtaLink";
import pricingContent from "@/components/pricing/pricingContent.json";
import { PackageIncludesList } from "@/components/pricing/PackageIncludesList";
import homepageContent from "./homepageContent.json";
import { homeSectionTitleSizeClass } from "./homepageLayoutConstants";

function stripMoney(raw: string) {
    return raw.replace(/^\$/, "").replace(/,/g, "");
}

function hasMonthlyPrice(monthly: string | undefined) {
    return typeof monthly === "string" && monthly.trim().length > 0;
}

export default function HomePricing() {
    const { pricingTeaser } = homepageContent;
    const { packages } = pricingContent;
    const contactHref = pricingContent.meta.contactHref;

    const starter = packages.find((p) => p.id === "starter-website");
    const growth = packages.find((p) => p.id === "growth-optimization");

    if (!starter || !growth) {
        return null;
    }

    const starterUpfrontWord = starter.upfrontEyebrow.toLowerCase();
    const growthUpfrontWord = growth.upfrontEyebrow.toLowerCase();

    return (
        <section className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-16 text-center">
                <h2 className={`font-pixel mb-4 text-(--pm-on-surface) ${homeSectionTitleSizeClass}`}>
                    Website{" "}
                    <span className="pixel-word ng-pixel-word-highlight">Pricing</span>
                </h2>
                <p className="text-(--pm-on-surface-variant)">{pricingTeaser.subtitle}</p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col rounded-2xl border border-(--pm-outline-variant)/15 bg-base-100/60 p-8 backdrop-blur-xl sm:p-10 dark:bg-base-100/40">
                    <h3 className="font-pm-headline mb-2 text-2xl font-bold text-(--pm-on-surface) md:text-3xl">
                        {starter.name}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-(--pm-on-surface-variant) md:text-base">
                        {starter.tagline}
                    </p>
                    <div className="mb-6">
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-lg font-medium text-(--pm-on-surface)">$</span>
                            <span className="text-4xl font-bold tracking-tighter text-(--pm-on-surface) md:text-5xl">
                                {stripMoney(starter.upfront)}
                            </span>
                            <span className="text-base font-medium text-(--pm-on-surface-variant)">
                                {starterUpfrontWord}
                            </span>
                        </div>
                        {hasMonthlyPrice(starter.monthly) ? (
                            <p className="mt-1 text-lg font-bold text-primary">
                                + ${stripMoney(starter.monthly)}
                                {starter.monthlyUnit}
                            </p>
                        ) : null}
                    </div>
                    <div className="mb-12 grow">
                        <PackageIncludesList
                            items={starter.includes}
                            tone="homeLight"
                            title={starter.includesTitle}
                            layout="home"
                            maxRegular={4}
                        />
                    </div>
                    <PixelCtaLink
                        href={contactHref}
                        color="var(--ng-btn-sky)"
                        filled
                        xl
                        block
                        className="mt-auto"
                        fill="color-mix(in srgb, var(--ng-btn-sky) 8%, transparent)"
                    >
                        {pricingTeaser.projectCtaLabel}
                    </PixelCtaLink>
                </div>

                <div className="relative flex flex-col overflow-hidden rounded-2xl bg-neutral p-8 text-neutral-content sm:p-10">
                    {growth.popularBadge ? (
                        <div className="absolute top-0 right-0 rounded-bl-xl bg-primary px-4 py-1.5 sm:px-5">
                            <span className="text-[10px] font-bold tracking-widest text-primary-content uppercase">
                                {growth.popularBadge}
                            </span>
                        </div>
                    ) : null}
                    <h3 className="font-pm-headline mb-2 pt-2 text-2xl font-bold md:text-3xl">{growth.name}</h3>
                    <p className="mb-6 text-sm leading-relaxed text-neutral-content/80 md:text-base">
                        {growth.tagline}
                    </p>
                    <div className="mb-6">
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-lg font-medium">$</span>
                            <span className="text-4xl font-bold tracking-tighter md:text-5xl">
                                {stripMoney(growth.upfront)}
                            </span>
                            <span className="text-base font-medium text-neutral-content/60">{growthUpfrontWord}</span>
                        </div>
                        {hasMonthlyPrice(growth.monthly) ? (
                            <p className="mt-1 text-2xl font-bold text-secondary md:text-3xl">
                                ${stripMoney(growth.monthly)}
                                {growth.monthlyUnit}
                            </p>
                        ) : null}
                    </div>
                    <div className="mb-12 grow">
                        <PackageIncludesList
                            items={growth.includes}
                            tone="homeDark"
                            title={growth.includesTitle}
                            layout="home"
                            maxRegular={4}
                        />
                    </div>
                    <PixelCtaLink
                        href={contactHref}
                        color="var(--ng-btn-sky)"
                        fill="var(--color-primary)"
                        textColor="var(--color-primary-content)"
                        filled
                        xl
                        block
                        className="mt-auto"
                    >
                        {pricingTeaser.monthlyCtaLabel}
                    </PixelCtaLink>
                </div>
            </div>
            <div className="mt-12 text-center">
                <PixelCtaLink
                    href={pricingTeaser.fullPricingHref}
                    color="var(--ng-btn-accent)"
                    className="mx-auto"
                >
                    {pricingTeaser.fullPricingLabel}
                </PixelCtaLink>
            </div>
        </section>
    );
}
