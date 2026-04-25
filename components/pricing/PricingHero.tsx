"use client";

import pricingContent from "./pricingContent.json";
import { pricingLayoutHeadline as headline } from "./pricingLayoutConstants";

export default function PricingHero() {
    const { hero } = pricingContent;

    return (
        <section className="w-full overflow-hidden pt-24 pb-16 md:pb-24 md:pt-28">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div
                    className="absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl md:-left-8"
                    style={{ backgroundColor: "var(--pm-primary-alpha-30)" }}
                />
                <div
                    className="absolute -top-8 right-0 h-96 w-96 max-w-[min(100vw,28rem)] rounded-full blur-[100px] md:right-[8%]"
                    style={{
                        backgroundColor: `color-mix(in srgb, var(--pm-secondary-container) 20%, transparent)`,
                    }}
                />
            </div>
            <div className="relative z-10 w-full">
                <div className="max-w-3xl">
                    <span
                        className={`mb-4 block text-sm font-bold tracking-[0.2em] uppercase ${headline}`}
                        style={{ color: "var(--pm-primary)" }}
                    >
                        {hero.eyebrow}
                    </span>
                    <h1
                        className={`mb-6 max-w-3xl text-5xl leading-[1.1] font-bold tracking-tight md:text-7xl ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        {hero.headlineLine1} <br />
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(to right, var(--pm-primary), var(--pm-primary-container))`,
                            }}
                        >
                            {hero.headlineGradient}
                        </span>
                    </h1>
                    <p
                        className="max-w-xl text-xl font-light leading-relaxed"
                        style={{ color: "var(--pm-on-surface-variant)" }}
                    >
                        {hero.subtitle}
                    </p>
                </div>
            </div>
        </section>
    );
}
