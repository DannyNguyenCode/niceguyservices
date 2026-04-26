"use client";

import { sitePageContentClass } from "@/components/pricing/pricingLayoutConstants";
import type { EducationHighlight, TimelineEntry } from "./aboutBiographyTypes";

type BiographyExperienceSectionProps = {
    experienceTimeline: TimelineEntry[];
    educationHighlight: EducationHighlight;
};

export default function BiographyExperienceSection({
    experienceTimeline,
    educationHighlight,
}: BiographyExperienceSectionProps) {
    return (
        <section className="bg-neutral text-neutral-content py-24">
            <div className={sitePageContentClass}>
                <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
                    <div>
                        <h2 className="font-pm-headline mb-12 flex items-center gap-4 text-3xl font-bold md:text-4xl">
                            <span
                                className="bg-primary h-px w-12 shrink-0"
                                aria-hidden
                            />
                            Professional experience
                        </h2>
                        <div className="space-y-12">
                            {experienceTimeline.map((job) => (
                                <div
                                    key={job.period + job.title}
                                    className="relative border-l border-neutral-content/25 pl-8"
                                >
                                    <div
                                        className={`absolute top-0 -left-[5px] h-2 w-2 rounded-full ${
                                            job.active
                                                ? "bg-primary"
                                                : "bg-neutral-content/40"
                                        }`}
                                        aria-hidden
                                    />
                                    <div
                                        className={`font-pm-headline mb-2 text-xs font-bold tracking-widest uppercase ${
                                            job.active
                                                ? "text-primary"
                                                : "text-neutral-content/60"
                                        }`}
                                    >
                                        {job.period}
                                    </div>
                                    <h3 className="font-pm-headline mb-1 text-2xl font-bold">
                                        {job.title}
                                    </h3>
                                    <div className="mb-4 font-medium text-neutral-content/75">
                                        {job.org}
                                    </div>
                                    <p className="leading-relaxed text-neutral-content/70">
                                        {job.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="font-pm-headline mb-12 flex items-center gap-4 text-3xl font-bold md:text-4xl">
                            <span
                                className="bg-secondary h-px w-12 shrink-0"
                                aria-hidden
                            />
                            {educationHighlight.eyebrow}
                        </h2>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                            <div className="font-pm-headline mb-2 text-xs font-bold tracking-widest text-secondary uppercase">
                                {educationHighlight.cardEyebrow ?? "Credential"}
                            </div>
                            <h3 className="font-pm-headline mb-1 text-2xl font-bold">
                                {educationHighlight.title}
                            </h3>
                            <div className="font-medium text-neutral-content/75">
                                {educationHighlight.org}
                            </div>
                            <p className="mt-4 leading-relaxed text-neutral-content/70">
                                {educationHighlight.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
