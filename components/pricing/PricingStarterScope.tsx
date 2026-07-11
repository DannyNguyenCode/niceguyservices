"use client";

import pricingContent from "./pricingContent.json";
import {
    pricingLayoutHeadline as headline,
    sitePageContentClass,
} from "./pricingLayoutConstants";

export default function PricingStarterScope() {
    const { starterScope } = pricingContent;
    if (!starterScope) return null;

    return (
        <section className={`py-10 md:py-14 ${sitePageContentClass}`}>
            <div className="rounded-xl bg-(--pm-surface-low) p-8 md:p-10">
                <h2 className={`text-2xl font-extrabold md:text-3xl ${headline}`}>
                    {starterScope.title}
                </h2>
                <p className="mt-3 max-w-3xl text-(--pm-on-surface-variant)">
                    {starterScope.intro}
                </p>
                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div>
                        <h3 className="font-pm-headline text-sm font-bold text-primary">
                            {starterScope.includesTitle}
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2 text-sm text-(--pm-on-surface-variant)">
                            {starterScope.includes.map((line) => (
                                <li key={line} className="flex gap-2">
                                    <span aria-hidden className="text-primary">✓</span>
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-pm-headline text-sm font-bold text-(--pm-on-surface-variant)">
                            {starterScope.excludesTitle}
                        </h3>
                        <ul className="mt-3 flex flex-col gap-2 text-sm text-(--pm-on-surface-variant)">
                            {starterScope.excludes.map((line) => (
                                <li key={line} className="flex gap-2">
                                    <span aria-hidden>—</span>
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
