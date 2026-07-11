"use client";

import pricingContent from "./pricingContent.json";
import {
    pricingLayoutHeadline as headline,
    siteDisclosureSummaryClass,
    sitePageContentClass,
} from "./pricingLayoutConstants";

export default function PricingHostingFaq() {
    const { hostingFaq } = pricingContent;
    if (!hostingFaq) return null;

    return (
        <section className={`py-10 md:py-14 ${sitePageContentClass}`}>
            <h2 className={`mb-6 text-2xl font-extrabold md:text-3xl ${headline}`}>
                {hostingFaq.title}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {hostingFaq.items.map((item) => (
                    <details
                        key={item.question}
                        className="group rounded-lg bg-(--pm-surface-low) p-5 open:bg-(--pm-surface-container)"
                    >
                        <summary className={`cursor-pointer list-none font-pm-headline text-base font-bold text-(--pm-on-surface) marker:content-none ${siteDisclosureSummaryClass}`}>
                            {item.question}
                        </summary>
                        <p className="mt-3 text-sm leading-relaxed text-(--pm-on-surface-variant)">
                            {item.answer}
                        </p>
                    </details>
                ))}
            </div>
        </section>
    );
}
