"use client";

import {
    ArrowRightIcon,
    BoltIcon,
    CommandLineIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { serviceCards } from "@/components/services/data";
import homepageContent from "./homepageContent.json";

const serviceIcons = [CommandLineIcon, SparklesIcon, BoltIcon] as const;

export default function HomeServices() {
    const { servicesTeaser, serviceTags } = homepageContent;
    const teasers = serviceCards.filter((s) => s.featured).slice(0, 3);

    return (
        <section className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <h2 className="font-pm-headline mb-4 text-4xl font-bold tracking-tight text-(--pm-on-surface)">
                        {servicesTeaser.title}
                    </h2>
                    <p className="max-w-md text-(--pm-on-surface-variant)">
                        {servicesTeaser.subtitle}
                    </p>
                </div>
                <Link
                    href={servicesTeaser.viewAllHref}
                    className="group hidden items-center gap-2 font-pm-headline text-sm font-bold tracking-widest text-primary uppercase transition-colors hover:text-(--pm-primary-dim) md:flex"
                >
                    {servicesTeaser.viewAllLabel}
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
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
                <Link
                    href={servicesTeaser.viewAllHref}
                    className="block w-full rounded-lg bg-(--pm-surface-highest) py-4 text-center font-pm-headline text-sm font-bold tracking-widest text-primary uppercase"
                >
                    {servicesTeaser.viewAllLabel}
                </Link>
            </div>
        </section>
    );
}
