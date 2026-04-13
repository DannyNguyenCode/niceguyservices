"use client";

import pricingContent from "./pricingContent.json";
import {
    type TrustAccent,
    pricingLayoutHeadline as headline,
} from "./pricingLayoutConstants";
import { trustIcons, type TrustIconKey } from "./pricingIconMaps";

function isTrustAccent(v: string): v is TrustAccent {
    return v === "primary" || v === "secondary" || v === "tertiary";
}

export default function PricingTrustSection() {
    const { items } = pricingContent.trust;

    return (
        <section
            className="relative overflow-hidden px-4 py-20 sm:px-8"
            style={{ backgroundColor: "var(--pm-trust-section-bg)" }}
        >
            <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
                {items.map((item) => {
                    const Icon = trustIcons[item.icon as TrustIconKey];
                    const accent = isTrustAccent(item.accent) ? item.accent : "primary";
                    return (
                        <div key={item.title} className="flex flex-col items-center text-center">
                            <div
                                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm"
                                style={{
                                    backgroundColor: "var(--pm-surface-highest)",
                                    borderColor: "var(--pm-border-light)",
                                }}
                            >
                                <Icon
                                    className="h-8 w-8"
                                    style={{ color: `var(--pm-${accent})` }}
                                    aria-hidden
                                />
                            </div>
                            <h4 className={`mb-2 text-xl font-bold ${headline}`}>{item.title}</h4>
                            <p
                                className="max-w-xs text-sm leading-relaxed font-medium"
                                style={{ color: "var(--pm-on-surface-variant)" }}
                            >
                                {item.body}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
