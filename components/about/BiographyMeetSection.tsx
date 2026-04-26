"use client";

import { BuildingOffice2Icon, ClockIcon } from "@heroicons/react/24/outline";
import { sitePageContentClass } from "@/components/pricing/pricingLayoutConstants";
import PrivacyFriendlyMap from "./PrivacyFriendlyMap";
import type { MeetCard } from "./aboutBiographyTypes";

type BiographyMeetSectionProps = {
    eyebrow: string;
    meetCard: MeetCard;
};

export default function BiographyMeetSection({
    eyebrow,
    meetCard,
}: BiographyMeetSectionProps) {
    return (
        <section className="bg-(--pm-surface-low) py-24">
            <div className={sitePageContentClass}>
                <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-(--pm-outline-variant)/15 bg-(--pm-white) shadow-xl dark:bg-base-100 md:flex-row">
                    <div className="flex flex-col justify-center p-10 md:w-1/3 md:p-12">
                        <div className="font-pm-headline mb-4 text-xs font-black tracking-[0.2em] text-primary uppercase">
                            {eyebrow}
                        </div>
                        <h2 className="font-pm-headline mb-6 text-4xl font-bold">
                            {meetCard.title}
                        </h2>
                        {meetCard.paragraphs.map((para, i) => (
                            <p
                                key={i}
                                className="mb-8 leading-relaxed text-(--pm-on-surface-variant) last:mb-8"
                            >
                                {para}
                            </p>
                        ))}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-(--pm-on-surface)">
                                <BuildingOffice2Icon
                                    className="h-5 w-5 shrink-0 text-primary"
                                    aria-hidden
                                />
                                <span className="font-medium">
                                    Downtown core, Toronto
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-(--pm-on-surface)">
                                <ClockIcon
                                    className="h-5 w-5 shrink-0 text-primary"
                                    aria-hidden
                                />
                                <span className="font-medium">
                                    Mon–Fri · 9am–6pm EST
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex min-h-[280px] flex-col md:h-[450px] md:w-2/3">
                        <div
                            className="pointer-events-none absolute inset-0 z-10 bg-primary/5"
                            aria-hidden
                        />
                        <PrivacyFriendlyMap
                            variant="embedded"
                            className="min-h-[280px] flex-1 md:min-h-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
