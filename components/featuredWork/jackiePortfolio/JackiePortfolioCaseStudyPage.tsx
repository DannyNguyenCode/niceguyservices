"use client";

import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import ServicesModernCTA from "@/components/services/ServicesModernCTA";
import caseStudyContent from "@/components/featuredWork/jackiePortfolio/jackiePortfolioCaseStudyContent.json";
import {
    pricingLayoutBodyFont as bodyFont,
    pricingLayoutHeadline as headline,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";

const cardBorder = "border border-(--pm-border-light)";
const cardShadow = "var(--pm-shadow-featured)";

function SectionHeading({ id, title, intro }: { id?: string; title: string; intro?: string }) {
    return (
        <header className="mb-8 max-w-3xl">
            {id ? (
                <h2
                    id={id}
                    className={`mb-3 text-3xl font-medium md:text-4xl ${headline}`}
                    style={{ color: "var(--pm-on-surface)" }}
                >
                    {title}
                </h2>
            ) : (
                <h2
                    className={`mb-3 text-3xl font-medium md:text-4xl ${headline}`}
                    style={{ color: "var(--pm-on-surface)" }}
                >
                    {title}
                </h2>
            )}
            {intro ? (
                <p className="text-lg" style={{ color: "var(--pm-on-surface-variant)" }}>
                    {intro}
                </p>
            ) : null}
        </header>
    );
}

function CaseStudyScreenshot({
    src,
    alt,
    width,
    height,
    priority = false,
    sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
    sizes?: string;
}) {
    return (
        <div
            className="flex justify-center border-b p-3 sm:p-4"
            style={{
                borderColor: "var(--pm-outline-variant)",
                backgroundColor: "var(--pm-surface-container)",
            }}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
                sizes={sizes}
                className="h-auto w-full max-w-full object-contain"
            />
        </div>
    );
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className="space-y-3">
            {items.map((item) => (
                <li key={item} className="flex gap-3">
                    <CheckCircleIcon
                        className="mt-0.5 h-5 w-5 shrink-0 text-secondary"
                        aria-hidden
                    />
                    <span style={{ color: "var(--pm-on-surface-variant)" }}>{item}</span>
                </li>
            ))}
        </ul>
    );
}

export default function JackiePortfolioCaseStudyPage() {
    const {
        meta,
        hero,
        snapshot,
        challenge,
        strategy,
        uxDecisions,
        technical,
        seo,
        challengesSolutions,
        outcome,
        lessons,
        visuals,
        cta,
    } = caseStudyContent;

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
                <nav className="pt-8" aria-label="Breadcrumb">
                    <Link
                        href={meta.featuredWorkHref}
                        className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-secondary ${headline}`}
                        style={{ color: "var(--pm-on-surface-variant)" }}
                    >
                        <ArrowLeftIcon className="h-4 w-4 shrink-0" aria-hidden />
                        Back to Work
                    </Link>
                </nav>

                {/* Hero */}
                <section className="py-8 md:mt-8 md:py-12">
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
                        className={`mb-3 text-4xl font-bold tracking-tight md:text-6xl ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        {hero.title}
                    </h1>
                    <p
                        className="mb-6 max-w-2xl text-lg md:text-xl"
                        style={{ color: "var(--pm-on-surface-variant)" }}
                    >
                        {hero.subtitle}
                    </p>
                    <div className="mb-8 flex flex-wrap gap-2">
                        {hero.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium"
                                style={{
                                    backgroundColor: "var(--pm-surface-highest)",
                                    color: "var(--pm-primary)",
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="mb-10 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href={meta.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center rounded-lg px-8 py-4 font-semibold transition-all hover:opacity-90 active:scale-95 ${headline}`}
                            style={{
                                backgroundColor: "var(--pm-secondary)",
                                color: "var(--pm-on-primary)",
                            }}
                        >
                            {hero.visitWebsiteCta}
                        </Link>
                        <Link
                            href={meta.projectDetailsHref}
                            className={`inline-flex items-center justify-center rounded-lg border px-8 py-4 font-semibold transition-all hover:bg-(--pm-secondary)/10 active:scale-95 ${headline}`}
                            style={{
                                borderColor: "var(--pm-secondary)",
                                color: "var(--pm-secondary)",
                            }}
                        >
                            {hero.projectDetailsCta}
                        </Link>
                    </div>
                    <div
                        className={`overflow-hidden rounded-xl ${cardBorder}`}
                        style={{
                            backgroundColor: "var(--pm-surface-high)",
                            boxShadow: cardShadow,
                        }}
                    >
                        <CaseStudyScreenshot
                            src={meta.heroImageSrc}
                            alt={meta.heroImageAlt}
                            width={meta.heroImageWidth}
                            height={meta.heroImageHeight}
                            priority
                            sizes="(max-width: 1200px) 100vw, 1200px"
                        />
                    </div>
                </section>

                {/* Snapshot */}
                <section id="project-snapshot" className="scroll-mt-24 pt-8">
                    <SectionHeading title={snapshot.title} />
                    <dl
                        className={`grid grid-cols-1 gap-4 rounded-xl p-6 md:grid-cols-2 md:p-8 ${cardBorder}`}
                        style={{
                            backgroundColor: "var(--pm-surface-high)",
                            boxShadow: cardShadow,
                        }}
                    >
                        {snapshot.items.map((item) => (
                            <div key={item.label} className="space-y-1">
                                <dt
                                    className={`text-xs font-bold tracking-widest uppercase ${headline}`}
                                    style={{ color: "var(--pm-secondary)" }}
                                >
                                    {item.label}
                                </dt>
                                <dd style={{ color: "var(--pm-on-surface-variant)" }}>{item.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Challenge */}
                <section className="mt-24">
                    <SectionHeading title={challenge.title} intro={challenge.intro} />
                    <BulletList items={challenge.points} />
                </section>

                {/* Strategy */}
                <section className="mt-24">
                    <SectionHeading title={strategy.title} intro={strategy.intro} />
                    <BulletList items={strategy.points} />
                </section>

                {/* UX decisions */}
                <section className="mt-24">
                    <SectionHeading title={uxDecisions.title} intro={uxDecisions.intro} />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {uxDecisions.items.map((item, index) => (
                            <article
                                key={item.title}
                                className={`rounded-xl p-6 ${cardBorder}`}
                                style={{
                                    backgroundColor:
                                        index % 2 === 0
                                            ? "var(--pm-surface-high)"
                                            : "var(--pm-surface-container)",
                                    boxShadow: cardShadow,
                                }}
                            >
                                <h3 className={`mb-2 text-xl font-bold ${headline}`}>{item.title}</h3>
                                <p style={{ color: "var(--pm-on-surface-variant)" }}>{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Technical */}
                <section className="mt-24">
                    <SectionHeading title={technical.title} intro={technical.intro} />
                    <BulletList items={technical.points} />
                </section>

                {/* SEO */}
                <section className="mt-24">
                    <SectionHeading title={seo.title} intro={seo.intro} />
                    <BulletList items={seo.points} />
                </section>

                {/* Challenges & solutions */}
                <section className="mt-24">
                    <SectionHeading title={challengesSolutions.title} />
                    <div className="space-y-6">
                        {challengesSolutions.pairs.map((pair) => (
                            <article
                                key={pair.challenge}
                                className={`grid grid-cols-1 gap-4 rounded-xl p-6 md:grid-cols-2 md:p-8 ${cardBorder}`}
                                style={{
                                    backgroundColor: "var(--pm-surface-high)",
                                    boxShadow: cardShadow,
                                }}
                            >
                                <div>
                                    <p
                                        className={`mb-2 text-xs font-bold tracking-widest uppercase ${headline}`}
                                        style={{ color: "var(--pm-secondary)" }}
                                    >
                                        Challenge
                                    </p>
                                    <p style={{ color: "var(--pm-on-surface-variant)" }}>{pair.challenge}</p>
                                </div>
                                <div>
                                    <p
                                        className={`mb-2 text-xs font-bold tracking-widest uppercase ${headline}`}
                                        style={{ color: "var(--pm-primary)" }}
                                    >
                                        Solution
                                    </p>
                                    <p style={{ color: "var(--pm-on-surface-variant)" }}>{pair.solution}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Outcome */}
                <section className="mt-24">
                    <SectionHeading title={outcome.title} intro={outcome.intro} />
                    <BulletList items={outcome.points} />
                </section>

                {/* Lessons */}
                <section className="mt-24">
                    <SectionHeading title={lessons.title} />
                    <BulletList items={lessons.points} />
                </section>

                {/* Visual walkthrough */}
                <section className="mt-24">
                    <SectionHeading title={visuals.title} intro={visuals.intro} />
                    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
                        {visuals.screenshots.map((screenshot) => (
                            <figure
                                key={screenshot.label}
                                className={`mb-6 break-inside-avoid overflow-hidden rounded-xl ${cardBorder}`}
                                style={{
                                    backgroundColor: "var(--pm-surface-high)",
                                    boxShadow: cardShadow,
                                }}
                            >
                                <CaseStudyScreenshot
                                    src={screenshot.imageSrc}
                                    alt={screenshot.imageAlt}
                                    width={screenshot.imageWidth}
                                    height={screenshot.imageHeight}
                                />
                                <figcaption className="p-4">
                                    <p className={`mb-1 font-bold ${headline}`}>{screenshot.label}</p>
                                    <p className="text-sm" style={{ color: "var(--pm-on-surface-variant)" }}>
                                        {screenshot.description}
                                    </p>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </section>

                <ServicesModernCTA
                    layout="contained"
                    mouseGlow
                    title={cta.title}
                    description={cta.description}
                    primaryHref={meta.contactHref}
                    primaryLabel={cta.primaryCta}
                    secondaryHref="/pricing"
                    secondaryLabel={cta.secondaryCta}
                />
            </div>
        </div>
    );
}
