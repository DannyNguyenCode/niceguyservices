"use client";

import React from "react";

export default function PricingSection() {
    return (
        <section
            id="homepage-pricing"
            aria-labelledby="homepage-pricing-heading"
            className="bg-base-200 py-12 md:py-16 px-3 md:px-6"
        >
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="mb-8 md:mb-10 flex flex-col items-center text-center gap-3">
                    <span className="badge badge-outline badge-lg rounded-full font-semibold tracking-[0.08em] uppercase text-primary">
                        Two ways to work together
                    </span>

                    <h2
                        id="homepage-pricing-heading"
                        className="text-2xl md:text-3xl font-extrabold"
                    >
                        Pricing that fits where your business is today
                    </h2>

                    <p className="max-w-xl text-sm md:text-base text-base-content/80">
                        Some owners prefer to invest up front, others want a predictable
                        monthly cost with support included. I offer both—without hidden
                        fees or agency bloat.
                    </p>
                </div>

                {/* Two-path cards */}
                <div className="grid gap-4 md:gap-6 md:grid-cols-2">
                    {/* Pay-once option */}
                    <div>
                        <div className="card h-full border border-base-300 bg-base-100 shadow-md">
                            <div className="card-body gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-primary rounded-full font-semibold">
                                        Pay once, own the site
                                    </span>
                                    <span className="text-[0.7rem] uppercase tracking-[0.12em] text-base-content/60">
                                        Best for 3–10 page sites
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-extrabold">
                                        $2,000 – $5,000 one-time
                                    </h3>
                                    <p className="text-sm text-base-content/80">
                                        Most local projects land in this range depending on pages,
                                        integrations, and content needs.
                                    </p>
                                </div>

                                <div className="mt-1 space-y-2">
                                    {[
                                        "Custom design matched to your brand",
                                        "Built on a modern stack (Next.js + MUI)",
                                        "You own the site and can host anywhere",
                                    ].map((line) => (
                                        <div
                                            key={line}
                                            className="flex items-start gap-2 text-sm text-base-content/80"
                                        >
                                            <span className="mt-1 inline-block h-3 w-3 rounded-full bg-success" />
                                            <p>{line}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-2">
                                    <a
                                        href="/pricing"
                                        className="btn btn-primary normal-case rounded-lg font-semibold"
                                    >
                                        See full pay-once details
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription option */}
                    <div>
                        <div className="card h-full border border-primary bg-gradient-to-br from-primary/10 via-primary/20 to-primary shadow-lg">
                            <div className="card-body gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="badge rounded-full font-semibold bg-base-100 text-primary">
                                        Website subscription
                                    </span>
                                    <span className="text-[0.7rem] uppercase tracking-[0.12em] text-base-content/70">
                                        Best for ongoing support
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-extrabold text-base-content">
                                        From $150 / month
                                    </h3>
                                    <p className="text-sm text-base-content/90">
                                        Lower upfront cost, with hosting, updates, and tweaks
                                        bundled into one simple monthly fee.
                                    </p>
                                </div>

                                <div className="mt-1 space-y-2">
                                    {[
                                        "Launch-ready site without a big lump sum",
                                        "Ongoing changes, bug fixes, and small improvements",
                                        "Ideal if you want a “done-for-you” web partner",
                                    ].map((line) => (
                                        <div
                                            key={line}
                                            className="flex items-start gap-2 text-sm text-base-content/90"
                                        >
                                            <span className="mt-1 inline-block h-3 w-3 rounded-full bg-base-100" />
                                            <p>{line}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto pt-2">
                                    <a
                                        href="/pricing"
                                        className="btn btn-outline normal-case rounded-lg font-semibold border-base-200 bg-base-100/90"
                                    >
                                        See subscription breakdown
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Helper CTA under cards */}
                <div className="mt-8">
                    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-base-300 bg-base-100/80 p-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm md:text-base text-base-content/80">
                            Not sure which option fits your situation? I can walk you through
                            tradeoffs in a short call and give a specific quote.
                        </p>
                        <a
                            href="/contact"
                            className="btn btn-ghost text-primary normal-case font-semibold"
                        >
                            Talk about my project
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
