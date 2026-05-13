"use client";

import { Squares2X2Icon } from "@heroicons/react/24/outline";
import Link from "next/link";
import pricingContent from "./pricingContent.json";
import { pricingLayoutHeadline as headline } from "./pricingLayoutConstants";
import { PackageIncludesList } from "./PackageIncludesList";

type Package = (typeof pricingContent.packages)[number];

function hasMonthlyPrice(pkg: Package) {
    return typeof pkg.monthly === "string" && pkg.monthly.trim().length > 0;
}

export default function PricingPlans() {
    const { packagesSection, packages } = pricingContent;

    return (
        <div className="pb-4 md:pb-6">
            <section className="mb-10 md:mb-14">
                <div className="mb-10 flex items-center gap-3 md:mb-12">
                    <span
                        className="rounded-lg p-2"
                        style={{
                            backgroundColor: "color-mix(in srgb, var(--pm-primary) 14%, transparent)",
                            color: "var(--pm-primary)",
                        }}
                    >
                        <Squares2X2Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                        <p
                            className={`mb-1 text-xs font-bold tracking-widest uppercase ${headline}`}
                            style={{ color: "var(--pm-on-surface-variant)" }}
                        >
                            {packagesSection.sectionEyebrow}
                        </p>
                        <h2
                            className={`text-2xl font-black tracking-tight md:text-3xl ${headline}`}
                            style={{ color: "var(--pm-on-surface)" }}
                        >
                            {packagesSection.title}
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:items-stretch">
                    {packages.map((pkg) => (
                        <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                </div>
            </section>
        </div>
    );
}

function PackageCard({ pkg }: { pkg: Package }) {
    const featured = Boolean(pkg.popularBadge);
    const upfrontWord = pkg.upfrontEyebrow.toLowerCase();
    const showMonthlyRow = hasMonthlyPrice(pkg);

    return (
        <div
            className={`relative flex flex-col overflow-hidden rounded-xl border p-6 pt-9 transition-all duration-300 sm:p-8 sm:pt-10 ${featured
                ? "z-10 border-2 shadow-xl hover:-translate-y-0.5 lg:scale-[1.02]"
                : "shadow-sm hover:shadow-lg"
                }`}
            style={{
                backgroundColor: "var(--pm-bento-tile-light)",
                borderColor: featured ? "var(--pm-primary)" : "var(--pm-outline-variant)",
            }}
        >
            {pkg.popularBadge ? (
                <div
                    className={`absolute top-0 right-0 rounded-bl-xl px-4 py-1.5 text-[10px] font-black tracking-widest uppercase sm:px-5 ${headline}`}
                    style={{
                        backgroundColor: "var(--pm-primary)",
                        color: "var(--pm-on-primary)",
                    }}
                >
                    {pkg.popularBadge}
                </div>
            ) : null}

            <div className="mb-6 sm:mb-8">
                <h3
                    className={`mb-2 text-xl font-bold tracking-tight sm:text-2xl md:text-3xl ${headline}`}
                    style={{ color: "var(--pm-on-surface)" }}
                >
                    {pkg.name}
                </h3>
                <p
                    className="text-sm leading-relaxed sm:text-base"
                    style={{ color: "var(--pm-on-surface-variant)" }}
                >
                    {pkg.tagline}
                </p>
            </div>

            <div className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-baseline gap-1">
                    <span
                        className={`text-3xl font-black tracking-tight sm:text-4xl md:text-5xl ${headline}`}
                        style={{
                            color:
                                featured && !showMonthlyRow ? "var(--pm-primary)" : "var(--pm-on-surface)",
                        }}
                    >
                        {pkg.upfront}
                    </span>
                    <span className="text-sm font-medium sm:text-base" style={{ color: "var(--pm-on-surface-variant)" }}>
                        {upfrontWord}
                    </span>
                </div>
                {showMonthlyRow ? (
                    <p
                        className={`mt-1 font-black ${headline} ${featured ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl md:text-2xl"}`}
                        style={{ color: "var(--pm-primary)" }}
                    >
                        {featured ? (
                            <>
                                {pkg.monthly}
                                {pkg.monthlyUnit}
                            </>
                        ) : (
                            <>
                                + {pkg.monthly}
                                {pkg.monthlyUnit}
                            </>
                        )}
                    </p>
                ) : null}
            </div>

            <PackageIncludesList
                items={pkg.includes}
                tone="pricingCard"
                title={pkg.includesTitle}
                layout="sequential"
            />

            <Link
                href={pricingContent.meta.contactHref}
                className={`mt-auto flex min-h-12 w-full items-center justify-center rounded-lg py-3 text-center text-base font-bold transition-all active:scale-[0.98] sm:min-h-14 sm:py-4 ${headline}`}
                style={
                    featured
                        ? {
                            background: `linear-gradient(to bottom right, var(--pm-primary), var(--pm-primary-container))`,
                            color: "var(--pm-on-primary)",
                            boxShadow: "var(--pm-shadow-cta-button)",
                        }
                        : {
                            borderWidth: 2,
                            borderStyle: "solid",
                            borderColor: "var(--pm-outline-variant)",
                            color: "var(--pm-on-surface)",
                            backgroundColor: "transparent",
                        }
                }
            >
                {pkg.buttonLabel}
            </Link>
        </div>
    );
}
