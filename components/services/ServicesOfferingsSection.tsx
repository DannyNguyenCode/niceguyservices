"use client";

import { useEffect, useRef, useState } from "react";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import offerings from "./servicesOfferingsContent.json";
import {
    pricingLayoutHeadline as headline,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";

function useInViewOnce(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            setVisible(true);
            return;
        }
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);

    return { ref, visible };
}

export default function ServicesOfferingsSection() {
    const { primaryServices, integrations, includedSection } = offerings;
    const grid = useInViewOnce();

    return (
        <>
            <section className={`py-12 md:py-16 ${sitePageContentClass}`}>
                <div className="mb-10 max-w-3xl">
                    <h2 className={`text-3xl font-extrabold md:text-4xl ${headline}`}>
                        Services built for business outcomes
                    </h2>
                    <p className="mt-4 text-(--pm-on-surface-variant)">
                        I lead with what your website needs to accomplish—not technical jargon.
                        Details like headless CMS or edge caching only appear where they help explain the result.
                    </p>
                </div>

                <div
                    ref={grid.ref}
                    className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${grid.visible ? "opacity-100" : "opacity-100 motion-safe:opacity-90"}`}
                >
                    {primaryServices.map((service, index) => (
                        <article
                            key={service.id}
                            className={`flex flex-col rounded-xl bg-(--pm-surface-low) p-8 shadow-sm transition-all motion-safe:duration-700 ${grid.visible ? "motion-safe:translate-y-0 motion-safe:opacity-100" : "motion-safe:translate-y-3 motion-safe:opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"}`}
                            style={{ transitionDelay: grid.visible ? `${index * 80}ms` : undefined }}
                        >
                            <h3 className={`text-2xl font-bold ${headline}`}>{service.title}</h3>
                            <p className="mt-2 text-sm font-medium text-primary">
                                For {service.audience}
                            </p>
                            <p className="mt-4 text-sm text-(--pm-on-surface-variant)">
                                <span className="font-semibold text-(--pm-on-surface)">Problem: </span>
                                {service.problem}
                            </p>
                            <p className="mt-2 text-sm text-(--pm-on-surface-variant)">
                                <span className="font-semibold text-(--pm-on-surface)">Outcome: </span>
                                {service.outcome}
                            </p>
                            <div className="mt-6">
                                <PixelCtaLink href={service.ctaHref} color="var(--ng-btn-sky)">
                                    {service.ctaLabel}
                                </PixelCtaLink>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className={`border-t border-base-300/40 py-12 md:py-16 ${sitePageContentClass}`}>
                <div className="mb-8 max-w-3xl">
                    <h2 className={`text-3xl font-extrabold md:text-4xl ${headline}`}>
                        Integrations and custom features
                    </h2>
                    <p className="mt-4 text-(--pm-on-surface-variant)">
                        When your business needs more than pages and a contact form, we scope add-ons clearly.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {integrations.map((item) => (
                        <div
                            key={item.title}
                            className="rounded-lg bg-(--pm-surface-container) p-5"
                        >
                            <h3 className="font-pm-headline text-base font-bold">{item.title}</h3>
                            <p className="mt-2 text-sm text-(--pm-on-surface-variant)">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={`pb-12 md:pb-16 ${sitePageContentClass}`}>
                <div className="rounded-xl bg-(--pm-surface-low) p-8 md:p-10">
                    <h2 className={`text-2xl font-extrabold md:text-3xl ${headline}`}>
                        {includedSection.title}
                    </h2>
                    <p className="mt-3 max-w-3xl text-(--pm-on-surface-variant)">
                        {includedSection.intro}
                    </p>
                    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                            <h3 className="font-pm-headline text-sm font-bold uppercase text-primary">
                                Typically included
                            </h3>
                            <ul className="mt-3 flex flex-col gap-2 text-sm text-(--pm-on-surface-variant)">
                                {includedSection.includes.map((line) => (
                                    <li key={line} className="flex gap-2">
                                        <span aria-hidden className="text-primary">✓</span>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-pm-headline text-sm font-bold uppercase text-(--pm-on-surface-variant)">
                                Scoped separately
                            </h3>
                            <ul className="mt-3 flex flex-col gap-2 text-sm text-(--pm-on-surface-variant)">
                                {includedSection.excludes.map((line) => (
                                    <li key={line} className="flex gap-2">
                                        <span aria-hidden>—</span>
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
