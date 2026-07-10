"use client";

import { ArrowRightIcon, CheckCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import WorkHero from "@/components/featuredWork/WorkHero";
import featuredWorkContent from "@/components/featuredWork/featuredWorkContent.json";
import ServicesModernCTA from "@/components/services/ServicesModernCTA";
import {
    pixelPageHeading,
    pricingLayoutBodyFont as bodyFont,
    pricingLayoutHeadline as headline,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";

const cardShadow = "var(--pm-shadow-featured)";
const cardBorder = "border border-(--pm-border-light)";

const sectionTitle = "text-3xl font-extrabold tracking-tight md:text-4xl";

export default function FeaturedWorkPage() {
    const { meta, featuredProject, internalBuilds, process, cta } =
        featuredWorkContent;

    return (
        <div
            className={`relative overflow-x-hidden pb-16 ${bodyFont}`}
            style={{
                backgroundColor: "var(--pm-surface)",
                color: "var(--pm-on-surface)",
            }}
        >
            <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-25" aria-hidden />
            <div
                className="pointer-events-none absolute -top-24 left-1/2 z-0 h-[min(420px,50vh)] w-screen -translate-x-1/2 rounded-full blur-[120px]"
                style={{ backgroundColor: "var(--pm-hero-orb)" }}
                aria-hidden
            />

            <div className="relative z-10">
                <div className={`${sitePageContentClass} pb-24`}>
                    <WorkHero />

                    {/* Featured client project */}
                    <section className="mt-24">
                        <div
                            className={`group overflow-hidden rounded-xl ${cardBorder}`}
                            style={{
                                backgroundColor: "var(--pm-surface-high)",
                                boxShadow: cardShadow,
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="relative h-64 overflow-hidden md:h-full md:min-h-[420px]">
                                    <Image
                                        src={featuredProject.imageSrc}
                                        alt={featuredProject.imageAlt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span
                                            className="rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase"
                                            style={{
                                                backgroundColor:
                                                    "color-mix(in srgb, var(--pm-secondary) 90%, transparent)",
                                                color: "var(--pm-on-primary)",
                                            }}
                                        >
                                            Live
                                        </span>
                                        <span
                                            className="rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase"
                                            style={{
                                                backgroundColor:
                                                    "color-mix(in srgb, var(--pm-surface) 90%, transparent)",
                                                color: "var(--pm-on-surface)",
                                            }}
                                        >
                                            Client Project
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center p-8 md:p-12">
                                    <h2
                                        className={`mb-2 ${sectionTitle} ${headline} ${pixelPageHeading}`}
                                    >
                                        {featuredProject.title}
                                    </h2>
                                    <p
                                        className="mb-6 text-[color:var(--ng-body)]"
                                    >
                                        {featuredProject.description}
                                    </p>
                                    <div className="mb-8 space-y-3">
                                        {featuredProject.highlights.map((item) => (
                                            <div key={item} className="flex items-center gap-3">
                                                <CheckCircleIcon
                                                    className="h-4 w-4 shrink-0 text-secondary"
                                                    aria-hidden
                                                />
                                                <span className="text-sm">{item}</span>
                                            </div>
                                        ))}
                                        <div className="flex items-center gap-3">
                                            <StarIcon
                                                className="h-4 w-4 shrink-0 text-secondary"
                                                aria-hidden
                                            />
                                            <span className="text-sm italic">
                                                {featuredProject.reviewNote}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <PixelCtaLink
                                            href={featuredProject.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="var(--ng-btn-coral)"
                                            className="group"
                                        >
                                            {featuredProject.primaryCta}
                                            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                                        </PixelCtaLink>
                                        <PixelCtaLink
                                            href={featuredProject.caseStudyHref}
                                            color="var(--ng-btn-sky)"
                                            className="group"
                                        >
                                            {featuredProject.secondaryCta}
                                            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                                        </PixelCtaLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Internal builds */}
                    <section className="mt-24">
                        <div className="mb-8 flex flex-col">
                            <h2
                                className={`mb-2 ${sectionTitle} ${headline} ${pixelPageHeading}`}
                            >
                                Selected Internal Builds
                            </h2>
                            <p className="text-[color:var(--ng-body)]">
                                {internalBuilds.subtitle}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            {internalBuilds.items.map((item) => (
                                <div
                                    key={item.title}
                                    className={`flex h-full flex-col rounded-xl p-8 transition-colors duration-300 hover:bg-(--pm-surface-highest) ${cardBorder}`}
                                    style={{
                                        backgroundColor: "var(--pm-surface-high)",
                                        boxShadow: cardShadow,
                                    }}
                                >
                                    <span
                                        className={`mb-2 text-[10px] font-bold tracking-widest uppercase ${headline} text-[color:var(--ng-accent)]`}
                                    >
                                        {item.category}
                                    </span>
                                    <h3
                                        className={`mb-4 text-3xl font-extrabold ${headline} ${pixelPageHeading}`}
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className="mb-8 grow text-[color:var(--ng-body)]"
                                    >
                                        {item.description}
                                    </p>
                                    <div className="mb-6 flex flex-wrap gap-2">
                                        {item.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded px-3 py-1.5 text-xs"
                                                style={{
                                                    backgroundColor: "var(--pm-surface)",
                                                    color: "var(--pm-primary)",
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <PixelCtaLink
                                        href={item.href}
                                        color="var(--ng-btn-sky)"
                                        className="group w-fit"
                                        {...(item.href.startsWith("http")
                                            ? { target: "_blank", rel: "noopener noreferrer" }
                                            : {})}
                                    >
                                        {item.cta}
                                        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                                    </PixelCtaLink>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Process */}
                    <section className="mt-24">
                        <h2
                            className={`mb-8 text-center ${sectionTitle} ${headline} ${pixelPageHeading}`}
                        >
                            How Each Project Comes Together
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            {process.steps.map((step, index) => (
                                <div
                                    key={step.title}
                                    className={`flex flex-col items-center rounded-xl border p-6 text-center ${cardBorder}`}
                                    style={{ backgroundColor: "var(--pm-surface-container)" }}
                                >
                                    <div
                                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full font-bold ${headline}`}
                                        style={{
                                            backgroundColor:
                                                "color-mix(in srgb, var(--pm-secondary) 10%, transparent)",
                                            color: "var(--pm-secondary)",
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    <h4 className={`mb-2 font-bold ${headline}`}>{step.title}</h4>
                                    <p
                                        className="text-sm text-[color:var(--ng-body)]"
                                    >
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <ServicesModernCTA
                    title={cta.title}
                    description={cta.description}
                    primaryLabel={cta.primaryCta}
                    secondaryHref={meta.pricingHref}
                    secondaryLabel={cta.secondaryCta}
                />
            </div>
        </div>
    );
}
