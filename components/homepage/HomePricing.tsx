"use client";

import { CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import pricingContent from "@/components/pricing/pricingContent.json";
import homepageContent from "./homepageContent.json";

export default function HomePricing() {
    const { pricingTeaser } = homepageContent;
    const { nova, monthlyCare } = pricingContent.plans;
    const contactHref = pricingContent.meta.contactHref;

    const novaAmount = nova.price.replace(/^\$/, "");
    const monthlyAmount = monthlyCare.price.replace(/^\$/, "");

    return (
        <section className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-16 text-center">
                <h2 className="font-pm-headline mb-4 text-4xl font-bold tracking-tight text-(--pm-on-surface)">
                    {pricingTeaser.title}
                </h2>
                <p className="text-(--pm-on-surface-variant)">
                    {pricingTeaser.subtitle}
                </p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                <div className="flex flex-col rounded-2xl border border-(--pm-outline-variant)/15 bg-base-100/60 p-10 backdrop-blur-xl dark:bg-base-100/40">
                    <span className="font-pm-headline mb-2 text-xs tracking-[0.2em] text-primary uppercase">
                        {nova.tierLabel} · {nova.name}
                    </span>
                    <h3 className="font-pm-headline mb-6 text-3xl font-bold text-(--pm-on-surface)">
                        Pay once
                    </h3>
                    <div className="mb-8 flex items-baseline gap-1">
                        <span className="text-lg font-medium text-(--pm-on-surface)">
                            $
                        </span>
                        <span className="text-5xl font-bold tracking-tighter text-(--pm-on-surface)">
                            {novaAmount}
                        </span>
                        <span className="ml-2 font-pm-headline text-xs text-(--pm-on-surface-variant) uppercase">
                            {nova.priceUnit}
                        </span>
                    </div>
                    <ul className="mb-12 flex-grow space-y-4">
                        {nova.features.slice(0, 3).map((line) => (
                            <li
                                key={line}
                                className="flex items-center gap-3 text-(--pm-on-surface-variant)"
                            >
                                <CheckCircleIcon
                                    className="h-5 w-5 shrink-0 text-primary"
                                    aria-hidden
                                />
                                {line}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href={contactHref}
                        className="w-full rounded-xl border border-primary/20 py-4 text-center font-pm-headline font-bold text-primary transition-colors hover:bg-primary hover:text-primary-content"
                    >
                        {pricingTeaser.projectCtaLabel}
                    </Link>
                </div>

                <div className="relative flex flex-col overflow-hidden rounded-2xl bg-neutral p-10 text-neutral-content">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="rounded bg-primary px-3 py-1 text-[10px] font-bold tracking-widest text-primary-content uppercase">
                            {monthlyCare.popularBadge}
                        </span>
                    </div>
                    <span className="mb-2 font-pm-headline text-xs tracking-[0.2em] text-secondary uppercase">
                        {monthlyCare.tierLabel}
                    </span>
                    <h3 className="font-pm-headline mb-6 text-3xl font-bold">
                        Monthly care
                    </h3>
                    <div className="mb-8 flex items-baseline gap-1">
                        <span className="text-lg font-medium">$</span>
                        <span className="text-5xl font-bold tracking-tighter">
                            {monthlyAmount}
                        </span>
                        <span className="ml-2 font-pm-headline text-xs text-neutral-content/60 uppercase">
                            {monthlyCare.priceUnit.trim()}
                        </span>
                    </div>
                    <ul className="mb-12 flex-grow space-y-4">
                        {monthlyCare.features.slice(0, 3).map((line) => (
                            <li
                                key={line}
                                className="flex items-center gap-3 text-neutral-content/75"
                            >
                                <ShieldCheckIcon
                                    className="h-5 w-5 shrink-0 text-secondary"
                                    aria-hidden
                                />
                                {line}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href={contactHref}
                        className="w-full rounded-xl bg-primary py-4 text-center font-pm-headline font-bold text-primary-content transition-colors hover:bg-(--pm-primary-dim)"
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
