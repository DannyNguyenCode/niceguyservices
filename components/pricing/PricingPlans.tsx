"use client";

import { Squares2X2Icon } from "@heroicons/react/24/outline";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import PixelKeyword from "@/components/ui/PixelKeyword";
import pricingContent from "./pricingContent.json";
import {
    pixelPageHeading,
    pricingLayoutHeadline as headline,
} from "./pricingLayoutConstants";
import { PackageIncludesList } from "./PackageIncludesList";

type Package = (typeof pricingContent.packages)[number];

function hasMonthlyPrice(pkg: Package) {
    return typeof pkg.monthly === "string" && pkg.monthly.trim().length > 0;
}

const packagesSectionTitle =
    "text-3xl font-extrabold tracking-tight md:text-4xl";

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
                        <h2
                            className={`${packagesSectionTitle} ${headline} ${pixelPageHeading}`}
                        >
                            <PixelKeyword>{packagesSection.sectionEyebrow}</PixelKeyword>{" "}
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
    const isGrowthCard = pkg.id === "growth-optimization";
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

            <PixelCtaLink
                href={pricingContent.meta.contactHref}
                color={isGrowthCard ? "var(--ng-btn-coral)" : "var(--ng-btn-sky)"}
                block
                xl
                className="mt-auto"
            >
                {pkg.buttonLabel}
            </PixelCtaLink>
        </div>
    );
}
