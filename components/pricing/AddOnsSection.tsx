"use client";

import { ArrowRightIcon } from "@heroicons/react/24/solid";
import pricingContent from "./pricingContent.json";
import { goToContact, pricingLayoutHeadline as headline } from "./pricingLayoutConstants";
import { addOnIcons, type AddOnIconKey } from "./pricingIconMaps";

export default function AddOnsSection() {
    const { sectionEyebrow, title, subtitle, ctaLabel, cards } = pricingContent.addOns;
    const showSubtitle = Boolean(subtitle && subtitle.trim().length > 0);

    return (
        <section
            className="relative mb-20 w-full overflow-hidden rounded-2xl border p-8 shadow-sm md:p-12"
            style={{
                backgroundColor: "var(--pm-bento-tile-light)",
                borderColor: "var(--pm-outline-variant)",
                boxShadow: "var(--pm-shadow-card-hover)",
            }}
        >
            <div
                className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full blur-3xl"
                style={{ backgroundColor: "var(--pm-hero-orb)" }}
                aria-hidden
            />
            <div className="relative z-10">
                <div className="mb-10 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-end">
                    <div>
                        <span
                            className={`mb-2 block text-xs font-bold tracking-widest uppercase ${headline}`}
                            style={{ color: "var(--pm-primary)" }}
                        >
                            {sectionEyebrow}
                        </span>
                        <h2
                            className={`text-3xl font-black tracking-tight md:text-4xl ${headline}`}
                            style={{ color: "var(--pm-on-surface)" }}
                        >
                            {title}
                        </h2>
                        {showSubtitle ? (
                            <p
                                className="mt-3 max-w-xl font-medium"
                                style={{ color: "var(--pm-on-surface-variant)" }}
                            >
                                {subtitle}
                            </p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={goToContact}
                        className={`flex items-center gap-2 rounded-lg px-1 py-1 text-sm font-bold transition-all hover:gap-3 ${headline}`}
                        style={{ color: "var(--pm-primary)" }}
                    >
                        {ctaLabel} <ArrowRightIcon className="h-4 w-4 shrink-0" aria-hidden />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {cards.map((card) => {
                        const Icon = addOnIcons[card.icon as AddOnIconKey];

                        return (
                            <div
                                key={card.title}
                                className="flex flex-col justify-between gap-4 rounded-xl border border-(--pm-outline-variant)/55 bg-(--pm-surface-low) p-6 shadow-none transition-all duration-300 hover:bg-(--pm-surface-container) hover:shadow-(--pm-shadow-card-hover) sm:flex-row sm:items-center"
                            >
                                <div className="flex min-w-0 items-center gap-4">
                                    <div
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                                        style={{
                                            backgroundColor:
                                                "color-mix(in srgb, var(--pm-primary) 14%, transparent)",
                                        }}
                                    >
                                        <Icon
                                            className="h-6 w-6"
                                            style={{ color: "var(--pm-primary)" }}
                                            aria-hidden
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h3
                                            className={`text-base font-bold ${headline}`}
                                            style={{ color: "var(--pm-on-surface)" }}
                                        >
                                            {card.title}
                                        </h3>
                                        <p className="text-sm" style={{ color: "var(--pm-on-surface-variant)" }}>
                                            {card.desc}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className={`shrink-0 text-2xl font-black tracking-tight ${headline}`}
                                    style={{ color: "var(--pm-primary)" }}
                                >
                                    {card.priceMain}
                                    {card.priceSuffix ? (
                                        <span
                                            className="text-sm font-normal"
                                            style={{ color: "var(--pm-on-surface-variant)" }}
                                        >
                                            {card.priceSuffix}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
