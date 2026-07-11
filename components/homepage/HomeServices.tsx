"use client";

import {
    ArrowRightIcon,
    BoltIcon,
    CommandLineIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";
import { serviceCards } from "@/components/services/data";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import homepageContent from "./homepageContent.json";
import { homeSectionTitleSizeClass } from "./homepageLayoutConstants";

const sectionTitle = `font-pm-headline ${homeSectionTitleSizeClass} text-(--pm-on-surface)`;

const serviceIcons = [CommandLineIcon, SparklesIcon, BoltIcon] as const;

export default function HomeServices() {
    const { servicesTeaser, serviceTags } = homepageContent;
    const teasers = serviceCards.filter((s) => s.featured).slice(0, 3);

    return (
        <section className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 md:px-8">
            <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <h2 className={`${sectionTitle} mb-4`}>
                        {servicesTeaser.title}
                    </h2>
                    <p className="max-w-md text-(--pm-on-surface-variant)">
                        {servicesTeaser.subtitle}
                    </p>
                </div>
                <PixelCtaLink
                    href={servicesTeaser.viewAllHref}
                    color="var(--ng-btn-sky)"
                    className="group hidden md:inline-flex"
                >
                    {servicesTeaser.viewAllLabel}
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </PixelCtaLink>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {teasers.map((svc, i) => {
                    const Icon = serviceIcons[i] ?? CommandLineIcon;
                    const tags =
                        (serviceTags as Record<string, string[]>)[svc.id] ?? [];
                    const iconWrap =
                        i === 0
                            ? "bg-primary/15 text-primary"
                            : i === 1
                              ? "bg-secondary/15 text-secondary"
                              : "bg-accent/15 text-accent";
                    return (
                        <div
                            key={svc.id}
                            className="group rounded-xl border border-transparent bg-(--pm-surface-low) p-8 transition-all duration-500 hover:border-primary/20 hover:bg-(--pm-white) dark:hover:bg-base-100"
                        >
                            <div
                                className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110 ${iconWrap}`}
                            >
                                <Icon className="h-7 w-7" aria-hidden />
                            </div>
                            <h3 className="font-pm-headline mb-4 text-2xl font-bold text-(--pm-on-surface)">
                                {svc.title}
                            </h3>
                            <p className="mb-8 leading-relaxed text-(--pm-on-surface-variant)">
                                {svc.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded bg-(--pm-surface-highest) px-3 py-1 font-pm-headline text-xs uppercase text-(--pm-on-surface-variant)"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-12 md:hidden">
                <PixelCtaLink
                    href={servicesTeaser.viewAllHref}
                    color="var(--ng-btn-sky)"
                    filled
                    block
                    className="md:hidden"
                    fill="color-mix(in srgb, var(--ng-btn-sky) 10%, var(--pm-surface-highest))"
                >
                    {servicesTeaser.viewAllLabel}
                </PixelCtaLink>
            </div>
        </section>
    );
}
