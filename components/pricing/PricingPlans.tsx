"use client";

import {
    ArrowPathIcon,
    BanknotesIcon,
    BuildingOffice2Icon,
    CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import pricingContent from "./pricingContent.json";
import { goToContact, pricingLayoutHeadline as headline } from "./pricingLayoutConstants";

type OngoingPlan = (typeof pricingContent.ongoingPlans)[number];

function PlanCheckIcon({ featured }: { featured: boolean }) {
    if (featured) {
        return (
            <CheckCircleSolid
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: "var(--pm-primary)" }}
                aria-hidden
            />
        );
    }
    return (
        <CheckCircleIcon
            className="mt-0.5 h-5 w-5 shrink-0"
            style={{ color: "var(--pm-primary)" }}
            aria-hidden
        />
    );
}

export default function PricingPlans() {
    const { websiteBuild, ongoingSection, ongoingPlans } = pricingContent;
    const [introLine, ...gridFeatures] = websiteBuild.features;

    return (
        <div className="pb-4 md:pb-8">
            {/* Website Build — bento */}
            <section className="mb-20 md:mb-28">
                <div className="mb-8 flex items-center gap-3">
                    <span
                        className="rounded-lg p-2"
                        style={{
                            backgroundColor: "color-mix(in srgb, var(--pm-primary) 14%, transparent)",
                            color: "var(--pm-primary)",
                        }}
                    >
                        <BuildingOffice2Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <h2
                        className={`text-2xl font-black tracking-tight md:text-3xl ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        {websiteBuild.sectionTitle}
                    </h2>
                </div>

                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
                    <div
                        className="flex flex-col justify-between rounded-xl border p-8 shadow-sm lg:col-span-7"
                        style={{
                            backgroundColor: "var(--pm-bento-tile-light)",
                            borderColor: "var(--pm-outline-variant)",
                        }}
                    >
                        <div>
                            <h3
                                className={`mb-2 text-xl font-bold md:text-2xl ${headline}`}
                                style={{ color: "var(--pm-on-surface)" }}
                            >
                                {websiteBuild.cardTitle}
                            </h3>
                            <p
                                className="mb-8 text-base leading-relaxed"
                                style={{ color: "var(--pm-on-surface-variant)" }}
                            >
                                {introLine}
                            </p>
                            <ul className="mb-8 grid gap-x-8 gap-y-4 md:grid-cols-2">
                                {gridFeatures.map((line) => (
                                    <li key={line} className="flex items-center gap-3 text-base">
                                        <CheckCircleIcon
                                            className="h-5 w-5 shrink-0"
                                            style={{ color: "var(--pm-primary)" }}
                                            aria-hidden
                                        />
                                        <span style={{ color: "var(--pm-on-surface)" }}>{line}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div
                            className="rounded-lg border p-6 text-sm italic leading-relaxed"
                            style={{
                                borderColor: "color-mix(in srgb, var(--pm-outline-variant) 45%, transparent)",
                                backgroundColor: "var(--pm-surface-container)",
                                color: "var(--pm-on-surface-variant)",
                            }}
                        >
                            {websiteBuild.launchNote}
                        </div>
                    </div>

                    <div
                        className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl p-8 text-center shadow-lg lg:col-span-5"
                        style={{
                            background: `linear-gradient(145deg, var(--pm-primary), var(--pm-primary-dim))`,
                            color: "var(--pm-on-primary)",
                        }}
                    >
                        <BanknotesIcon
                            className="pointer-events-none absolute top-0 right-0 m-8 h-28 w-28 opacity-10 md:h-32 md:w-32"
                            aria-hidden
                        />
                        <div className="relative z-10 w-full max-w-sm">
                            <span
                                className={`mb-4 block text-xs font-bold tracking-widest uppercase ${headline}`}
                                style={{ color: "color-mix(in srgb, var(--pm-on-primary) 85%, transparent)" }}
                            >
                                {websiteBuild.priceEyebrow}
                            </span>
                            <div className="mb-2 flex items-baseline justify-center gap-0.5">
                                <span className={`text-5xl font-black tracking-tight md:text-6xl ${headline}`}>
                                    {websiteBuild.price}
                                </span>
                            </div>
                            <p
                                className="mb-8 text-sm font-medium md:text-base"
                                style={{ color: "color-mix(in srgb, var(--pm-on-primary) 78%, transparent)" }}
                            >
                                {websiteBuild.priceSubtext}
                            </p>
                            <button
                                type="button"
                                onClick={goToContact}
                                className={`w-full rounded-lg py-4 text-lg font-bold shadow-md transition-all active:scale-[0.98] ${headline}`}
                                style={{
                                    backgroundColor: "var(--pm-white)",
                                    color: "var(--pm-primary)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        "var(--pm-surface-container)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--pm-white)";
                                }}
                            >
                                {websiteBuild.buttonLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ongoing Plans */}
            <section>
                <div className="mb-10 flex items-center gap-3 md:mb-12">
                    <span
                        className="rounded-lg p-2"
                        style={{
                            backgroundColor: "color-mix(in srgb, var(--pm-secondary) 14%, transparent)",
                            color: "var(--pm-secondary)",
                        }}
                    >
                        <ArrowPathIcon className="h-6 w-6" aria-hidden />
                    </span>
                    <h2
                        className={`text-2xl font-black tracking-tight md:text-3xl ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        {ongoingSection.title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-stretch">
                    {ongoingPlans.map((plan) => (
                        <OngoingPlanCard key={plan.id} plan={plan} />
                    ))}
                </div>
            </section>
        </div>
    );
}

function OngoingPlanCard({ plan }: { plan: OngoingPlan }) {
    const featured = Boolean(plan.popularBadge);

    return (
        <div
            className={`relative flex flex-col rounded-xl border p-8 transition-all duration-300 ${featured
                    ? "z-10 border-2 shadow-xl md:scale-105"
                    : "shadow-sm hover:border-(--pm-primary)/30"
                }`}
            style={{
                backgroundColor: "var(--pm-bento-tile-light)",
                borderColor: featured ? "var(--pm-primary)" : "var(--pm-outline-variant)",
            }}
        >
            {plan.popularBadge ? (
                <div
                    className={`absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest ${headline}`}
                    style={{
                        backgroundColor: "var(--pm-primary)",
                        color: "var(--pm-on-primary)",
                    }}
                >
                    {plan.popularBadge}
                </div>
            ) : null}

            <h3
                className={`mb-2 text-xl font-bold md:text-2xl ${headline}`}
                style={{ color: "var(--pm-on-surface)" }}
            >
                {plan.name}
            </h3>
            <p
                className="mb-6 min-h-12 text-base leading-snug"
                style={{ color: "var(--pm-on-surface-variant)" }}
            >
                {plan.tagline}
            </p>
            <div className="mb-8 flex flex-wrap items-baseline gap-1">
                <span
                    className={`text-4xl font-black tracking-tight md:text-5xl ${headline}`}
                    style={{ color: featured ? "var(--pm-primary)" : "var(--pm-on-surface)" }}
                >
                    {plan.price}
                </span>
                <span className="text-base" style={{ color: "var(--pm-on-surface-variant)" }}>
                    {plan.priceUnit}
                </span>
            </div>

            <ul className="mb-10 flex grow flex-col gap-4">
                {plan.features.map((line) => {
                    const boldLead = line.startsWith("Everything in Growth");
                    return (
                        <li key={line} className="flex items-start gap-3 text-base">
                            <PlanCheckIcon featured={featured} />
                            <span
                                className={boldLead ? "font-bold" : undefined}
                                style={{ color: "var(--pm-on-surface)" }}
                            >
                                {line}
                            </span>
                        </li>
                    );
                })}
            </ul>

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
                {plan.buttonLabel}
            </button>
        </div>
    );
}
