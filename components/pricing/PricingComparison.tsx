"use client";

import PixelCtaLink from "@/components/ui/PixelCtaLink";
import pricingContent from "./pricingContent.json";
import {
    pricingLayoutHeadline as headline,
    sitePageContentClass,
} from "./pricingLayoutConstants";

export default function PricingComparison() {
    const { packageComparison } = pricingContent;
    if (!packageComparison) return null;

    return (
        <section className={`py-10 md:py-14 ${sitePageContentClass}`}>
            <h2 className={`mb-2 text-2xl font-extrabold md:text-3xl ${headline}`}>
                {packageComparison.title}
            </h2>
            <p className="mb-8 max-w-2xl text-(--pm-on-surface-variant)">
                {packageComparison.subtitle}
            </p>
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm sm:min-w-[640px]">
                    <thead>
                        <tr className="border-b border-base-300/60">
                            <th className="py-3 pr-4 font-pm-headline font-bold">Feature</th>
                            {packageComparison.columns.map((col) => (
                                <th key={col.id} className="px-3 py-3 font-pm-headline font-bold">
                                    {col.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {packageComparison.rows.map((row) => (
                            <tr key={row.feature} className="border-b border-base-300/30">
                                <td className="py-3 pr-4 text-(--pm-on-surface-variant)">
                                    {row.feature}
                                </td>
                                {packageComparison.columns.map((col) => (
                                    <td key={col.id} className="px-3 py-3">
                                        {row.values[col.id as keyof typeof row.values]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mt-8 text-(--pm-on-surface-variant)">{packageComparison.ctaText}</p>
            <div className="mt-4">
                <PixelCtaLink href="/contact" color="var(--ng-btn-coral)">
                    Start a project
                </PixelCtaLink>
            </div>
        </section>
    );
}
