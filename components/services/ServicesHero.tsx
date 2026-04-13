"use client";

import { pricingLayoutHeadline as headline } from "@/components/pricing/pricingLayoutConstants";

export default function ServicesHero() {
    return (
        <section className="relative w-full overflow-hidden pt-24 pb-16 md:pb-24 md:pt-28">
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
            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="max-w-3xl">
                    <span
                        className={`mb-4 block text-sm font-bold tracking-[0.2em] uppercase ${headline}`}
                        style={{ color: "var(--pm-primary)" }}
                    >
                        Professional capabilities
                    </span>
                    <h1
                        className={`mb-6 max-w-3xl text-5xl leading-[1.1] font-bold tracking-tight md:text-7xl ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        Expert web <br />
                        <span
                            className="bg-clip-text text-transparent"
                            style={{
                                backgroundImage: `linear-gradient(to right, var(--pm-primary), var(--pm-primary-container))`,
                            }}
                        >
                            Development
                        </span>{" "}
                        <br />
                        services
                    </h1>
                    <p
                        className="max-w-xl text-xl font-light leading-relaxed"
                        style={{ color: "var(--pm-on-surface-variant)" }}
                    >
                        Expert solutions for scale. Architecting high-performance digital environments
                        where precision meets a clean, modern aesthetic.
                    </p>
                </div>
            </div>
        </section>
    );
}
