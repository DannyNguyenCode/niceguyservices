"use client";

import { ArrowRightIcon, CheckCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import FeaturedWorkCtaSection from "@/components/featuredWork/FeaturedWorkCtaSection";
import featuredWorkContent from "@/components/featuredWork/featuredWorkContent.json";
import {
    pricingLayoutBodyFont as bodyFont,
    pricingLayoutHeadline as headline,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";

const cardShadow = "var(--pm-shadow-featured)";
const cardBorder = "border border-(--pm-border-light)";

export default function FeaturedWorkPage() {
    const { meta, hero, featuredProject, internalBuilds, process, cta } =
        featuredWorkContent;

    return (
        <div
            className={`relative overflow-x-hidden pb-16 ${bodyFont}`}
            style={{
                backgroundColor: "var(--pm-surface)",
                color: "var(--pm-on-surface)",
            }}
        >
            <div
                className="pointer-events-none absolute -top-24 left-1/2 z-0 h-[min(420px,50vh)] w-screen -translate-x-1/2 rounded-full blur-[120px]"
                style={{ backgroundColor: "var(--pm-hero-orb)" }}
                aria-hidden
            />

            <div className={`relative z-10 ${sitePageContentClass} pb-24`}>
                {/* Hero */}
                <section className="py-8 md:mt-12 md:py-12">
                    <div
                        className={`mb-4 inline-flex items-center rounded-full border px-3 py-1 ${cardBorder}`}
                        style={{ backgroundColor: "var(--pm-surface-high)" }}
                    >
                        <span
                            className={`text-xs font-bold tracking-widest uppercase ${headline}`}
                            style={{ color: "var(--pm-secondary)" }}
                        >
                            {hero.eyebrow}
                        </span>
                    </div>
                    <h1
                        className={`mb-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        {hero.headline}
                    </h1>
                    <p
                        className="mb-8 max-w-2xl text-lg md:text-xl"
                        style={{ color: "var(--pm-on-surface-variant)" }}
                    >
                        {hero.subtitle}
                    </p>
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href={meta.contactHref}
                            className={`inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold transition-all hover:opacity-90 active:scale-95 ${headline}`}
                            style={{
                                backgroundColor: "var(--pm-secondary)",
                                color: "var(--pm-on-primary)",
                            }}
                        >
                            {hero.primaryCta}
                        </Link>
                        <Link
                            href={meta.servicesHref}
                            className={`inline-flex items-center justify-center rounded-lg border px-8 py-4 font-semibold transition-all hover:bg-(--pm-secondary)/10 active:scale-95 ${headline}`}
                            style={{
                                borderColor: "var(--pm-secondary)",
                                color: "var(--pm-secondary)",
                            }}
                        >
                            {hero.secondaryCta}
                        </Link>
                    </div>
                    <p
                        className="border-l-2 py-1 pl-4 text-sm italic"
                        style={{
                            borderColor: "var(--pm-outline-variant)",
                            color: "var(--pm-on-surface-variant)",
                        }}
                    >
                        {hero.note}
                    </p>
                </section>

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
                                    className={`mb-2 text-3xl font-medium ${headline}`}
                                    style={{ color: "var(--pm-on-surface)" }}
                                >
                                    {featuredProject.title}
                                </h2>
                                <p
                                    className="mb-6"
                                    style={{ color: "var(--pm-on-surface-variant)" }}
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
                                    <Link
                                        href={featuredProject.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-all hover:opacity-90 active:scale-95 ${headline}`}
                                        style={{
                                            backgroundColor: "var(--pm-secondary)",
                                            color: "var(--pm-on-primary)",
                                        }}
                                    >
                                        {featuredProject.primaryCta}
                                    </Link>
                                    <Link
                                        href={featuredProject.caseStudyHref}
                                        className={`inline-flex items-center justify-center rounded-lg border px-6 py-3 font-semibold transition-all hover:bg-(--pm-secondary)/10 active:scale-95 ${headline}`}
                                        style={{
                                            borderColor: "var(--pm-secondary)",
                                            color: "var(--pm-secondary)",
                                        }}
                                    >
                                        {featuredProject.secondaryCta}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Internal builds */}
                <section className="mt-24">
                    <div className="mb-8 flex flex-col">
                        <h2
                            className={`mb-2 text-3xl font-medium ${headline}`}
                            style={{ color: "var(--pm-on-surface)" }}
                        >
                            {internalBuilds.title}
                        </h2>
                        <p style={{ color: "var(--pm-on-surface-variant)" }}>
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
                                    className={`mb-2 text-[10px] font-bold tracking-widest uppercase ${headline}`}
                                    style={{ color: "var(--pm-secondary)" }}
                                >
                                    {item.category}
                                </span>
                                <h3
                                    className={`mb-4 text-3xl font-medium ${headline}`}
                                    style={{ color: "var(--pm-on-surface)" }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    className="mb-8 grow"
                                    style={{ color: "var(--pm-on-surface-variant)" }}
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
                                <Link
                                    href={item.href}
                                    className={`inline-flex items-center gap-2 font-semibold transition-transform hover:translate-x-1 ${headline}`}
                                    style={{ color: "var(--pm-secondary)" }}
                                    {...(item.href.startsWith("http")
                                        ? { target: "_blank", rel: "noopener noreferrer" }
                                        : {})}
                                >
                                    {item.cta}
                                    <ArrowRightIcon className="h-4 w-4 shrink-0" aria-hidden />
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Process */}
                <section className="mt-24">
                    <h2
                        className={`mb-8 text-center text-3xl font-medium ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        {process.title}
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
                                <h4 className="mb-2 font-bold">{step.title}</h4>
                                <p
                                    className="text-sm"
                                    style={{ color: "var(--pm-on-surface-variant)" }}
                                >
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <FeaturedWorkCtaSection
                    title={cta.title}
                    description={cta.description}
                    primaryCta={cta.primaryCta}
                    secondaryCta={cta.secondaryCta}
                    contactHref={meta.contactHref}
                    pricingHref={meta.pricingHref}
                />
            </div>
        </div>
    );
}
