"use client";

import type { VitalStat } from "./aboutBiographyTypes";

type BiographyWhoSectionProps = {
    heading: string;
    summaryParagraphs: string[];
    teamIntro: string;
    vitalStats: VitalStat[];
};

export default function BiographyWhoSection({
    heading,
    summaryParagraphs,
    teamIntro,
    vitalStats,
}: BiographyWhoSectionProps) {
    return (
        <section className="bg-(--pm-surface-low) py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                    <div className="space-y-8 md:col-span-2">
                        <h2 className="font-pm-headline text-4xl font-bold tracking-tight text-(--pm-on-surface)">
                            {heading}
                        </h2>
                        <div className="prose prose-lg max-w-none text-(--pm-on-surface-variant)">
                            {summaryParagraphs.map((para, i) => (
                                <p
                                    key={i}
                                    className="mb-4 leading-relaxed last:mb-0"
                                >
                                    {para}
                                </p>
                            ))}
                        </div>
                        <p className="text-sm leading-relaxed text-(--pm-on-surface-variant)">
                            {teamIntro}
                        </p>
                    </div>
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-(--pm-outline-variant)/15 bg-(--pm-white) p-8 shadow-sm dark:bg-base-100">
                            <h3 className="font-pm-headline mb-6 text-sm font-black tracking-widest text-primary uppercase">
                                Vital statistics
                            </h3>
                            <ul className="space-y-4">
                                {vitalStats.map((row) => (
                                    <li
                                        key={row.label}
                                        className="flex justify-between border-b border-(--pm-outline-variant)/15 pb-2"
                                    >
                                        <span className="text-(--pm-on-surface-variant)">
                                            {row.label}
                                        </span>
                                        <span
                                            className={
                                                row.tone === "secondary"
                                                    ? "font-bold text-secondary"
                                                    : "font-bold text-(--pm-on-surface)"
                                            }
                                        >
                                            {row.value}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
