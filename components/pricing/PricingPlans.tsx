"use client";

import { Squares2X2Icon } from "@heroicons/react/24/outline";
import pricingContent from "./pricingContent.json";
import { goToContact, pricingLayoutHeadline as headline } from "./pricingLayoutConstants";
import { PackageIncludesList } from "./PackageIncludesList";

type Package = (typeof pricingContent.packages)[number];

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

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-stretch">
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

    return (
        <div
            className={`relative flex flex-col overflow-hidden rounded-xl border p-8 pt-10 transition-all duration-300 ${featured
                ? "z-10 border-2 shadow-xl hover:-translate-y-0.5 md:scale-[1.02]"
                : "shadow-sm hover:shadow-lg"
                }`}
            style={{
                backgroundColor: "var(--pm-bento-tile-light)",
                borderColor: featured ? "var(--pm-primary)" : "var(--pm-outline-variant)",
            }}
        >
            {pkg.popularBadge ? (
                <div
                    className={`absolute top-0 right-0 rounded-bl-xl px-5 py-1.5 text-[10px] font-black tracking-widest uppercase ${headline}`}
                    style={{
                        backgroundColor: "var(--pm-primary)",
                        color: "var(--pm-on-primary)",
                    }}
                >
                    {pkg.popularBadge}
                </div>
            ) : null}

            <div className="mb-8">
                <h3
                    className={`mb-2 text-2xl font-bold tracking-tight md:text-3xl ${headline}`}
                    style={{ color: "var(--pm-on-surface)" }}
                >
                    {pkg.name}
                </h3>
                <p className="text-sm leading-relaxed md:text-base" style={{ color: "var(--pm-on-surface-variant)" }}>
                    {pkg.tagline}
                </p>
            </div>

            <div className="mb-8">
                <div className="flex flex-wrap items-baseline gap-1">
                    <span
                        className={`text-4xl font-black tracking-tight md:text-5xl ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        {pkg.upfront}
                    </span>
                    <span className="text-base font-medium" style={{ color: "var(--pm-on-surface-variant)" }}>
                        {upfrontWord}
                    </span>
                </div>
                <p
                    className={`mt-1 font-black ${headline} ${featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}
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
            </div>

            <PackageIncludesList
                items={pkg.includes}
                tone="pricingCard"
                title={pkg.includesTitle}
                layout="sequential"
            />

            <button
                type="button"
                onClick={goToContact}
                className={`mt-auto w-full rounded-lg py-3 text-base font-bold transition-all active:scale-[0.98] md:py-4 ${headline}`}
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
                onMouseEnter={
                    featured
                        ? undefined
                        : (e) => {
                            e.currentTarget.style.backgroundColor = "var(--pm-surface-container)";
                        }
                }
                onMouseLeave={
                    featured
                        ? undefined
                        : (e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }
                }
            >
                {pkg.buttonLabel}
            </button>
        </div>
    );
}
