"use client";

import Link from "next/link";
import pricingContent from "@/components/pricing/pricingContent.json";
import { PackageIncludesList } from "@/components/pricing/PackageIncludesList";
import homepageContent from "./homepageContent.json";

function stripMoney(raw: string) {
    return raw.replace(/^\$/, "").replace(/,/g, "");
}

export default function HomePricing() {
    const { pricingTeaser } = homepageContent;
    const { packages } = pricingContent;
    const contactHref = pricingContent.meta.contactHref;
    const [firstPkg, secondPkg] = packages;

    if (!firstPkg || !secondPkg) {
        return null;
    }

    const firstUpfrontWord = firstPkg.upfrontEyebrow.toLowerCase();
    const secondUpfrontWord = secondPkg.upfrontEyebrow.toLowerCase();

    return (
        <section className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-16 text-center">
                <h2 className="font-pm-headline mb-4 text-4xl font-bold tracking-tight text-(--pm-on-surface)">
                    {pricingTeaser.title}
                </h2>
                <p className="text-(--pm-on-surface-variant)">{pricingTeaser.subtitle}</p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col rounded-2xl border border-(--pm-outline-variant)/15 bg-base-100/60 p-10 backdrop-blur-xl dark:bg-base-100/40">
                    <h3 className="font-pm-headline mb-2 text-2xl font-bold text-(--pm-on-surface) md:text-3xl">
                        {firstPkg.name}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-(--pm-on-surface-variant) md:text-base">
                        {firstPkg.tagline}
                    </p>
                    <div className="mb-6">
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-lg font-medium text-(--pm-on-surface)">$</span>
                            <span className="text-4xl font-bold tracking-tighter text-(--pm-on-surface) md:text-5xl">
                                {stripMoney(firstPkg.upfront)}
                            </span>
                            <span className="text-base font-medium text-(--pm-on-surface-variant)">
                                {firstUpfrontWord}
                            </span>
                        </div>
                        <p className="mt-1 text-lg font-bold text-primary">
                            + ${stripMoney(firstPkg.monthly)}
                            {firstPkg.monthlyUnit}
                        </p>
                    </div>
                    <div className="mb-12 grow">
                        <PackageIncludesList
                            items={firstPkg.includes}
                            tone="homeLight"
                            title={firstPkg.includesTitle}
                            layout="home"
                            maxRegular={4}
                        />
                    </div>
                    <Link
                        href={contactHref}
                        className="mt-auto w-full rounded-xl border border-primary/20 py-4 text-center font-pm-headline font-bold text-primary transition-colors hover:bg-primary hover:text-primary-content"
                    >
                        {pricingTeaser.projectCtaLabel}
                    </Link>
                </div>

                <div className="relative flex flex-col overflow-hidden rounded-2xl bg-neutral p-10 text-neutral-content">
                    {secondPkg.popularBadge ? (
                        <div className="absolute top-0 right-0 rounded-bl-xl bg-primary px-5 py-1.5">
                            <span className="text-[10px] font-bold tracking-widest text-primary-content uppercase">
                                {secondPkg.popularBadge}
                            </span>
                        </div>
                    ) : null}
                    <h3 className="font-pm-headline mb-2 pt-2 text-2xl font-bold md:text-3xl">
                        {secondPkg.name}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-neutral-content/80 md:text-base">
                        {secondPkg.tagline}
                    </p>
                    <div className="mb-6">
                        <div className="flex flex-wrap items-baseline gap-1">
                            <span className="text-lg font-medium">$</span>
                            <span className="text-4xl font-bold tracking-tighter md:text-5xl">
                                {stripMoney(secondPkg.upfront)}
                            </span>
                            <span className="text-base font-medium text-neutral-content/60">
                                {secondUpfrontWord}
                            </span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-secondary md:text-3xl">
                            ${stripMoney(secondPkg.monthly)}
                            {secondPkg.monthlyUnit}
                        </p>
                    </div>
                    <div className="mb-12 grow">
                        <PackageIncludesList
                            items={secondPkg.includes}
                            tone="homeDark"
                            title={secondPkg.includesTitle}
                            layout="home"
                            maxRegular={4}
                        />
                    </div>
                    <Link
                        href={contactHref}
                        className="mt-auto w-full rounded-xl bg-primary py-4 text-center font-pm-headline font-bold text-primary-content transition-colors hover:bg-(--pm-primary-dim)"
                    >
                        {pricingTeaser.monthlyCtaLabel}
                    </Link>
                </div>
            </div>
            <div className="mt-12 text-center">
                <Link
                    href={pricingTeaser.fullPricingHref}
                    className="font-pm-headline text-sm tracking-widest text-(--pm-on-surface-variant) uppercase underline decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                >
                    {pricingTeaser.fullPricingLabel}
                </Link>
            </div>
        </section>
    );
}
