"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import {
    pricingLayoutHeadline as headline,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";

type FeaturedWorkCtaSectionProps = {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    contactHref: string;
    pricingHref: string;
};

export default function FeaturedWorkCtaSection({
    title,
    description,
    primaryCta,
    secondaryCta,
    contactHref,
    pricingHref,
}: FeaturedWorkCtaSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const section = sectionRef.current;
        const glow = glowRef.current;
        if (!section || !glow) return;

        const rect = section.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        glow.style.transform = `translate(${x}px, ${y}px)`;
    }, []);

    return (
        <section className={`mt-24 mb-12 ${sitePageContentClass}`}>
            <div
                ref={sectionRef}
                onMouseMove={handleMouseMove}
                className="relative overflow-hidden rounded-2xl p-10 text-center md:p-20"
                style={{
                    background: `linear-gradient(to bottom right, var(--pm-primary), var(--pm-primary-dim))`,
                    boxShadow: "var(--pm-shadow-featured)",
                }}
            >
                <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                    aria-hidden
                />
                <div className="relative z-10">
                    <h2
                        className={`mb-6 text-3xl font-bold md:text-5xl ${headline}`}
                        style={{ color: "var(--pm-on-primary)" }}
                    >
                        {title}
                    </h2>
                    <p
                        className="mx-auto mb-10 max-w-2xl text-lg"
                        style={{ color: "color-mix(in srgb, var(--pm-on-primary) 80%, transparent)" }}
                    >
                        {description}
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href={contactHref}
                            className={`inline-flex items-center justify-center rounded-lg px-10 py-4 font-semibold transition-all hover:opacity-90 active:scale-95 ${headline}`}
                            style={{
                                backgroundColor: "var(--pm-white)",
                                color: "var(--pm-primary)",
                            }}
                        >
                            {primaryCta}
                        </Link>
                        <Link
                            href={pricingHref}
                            className={`inline-flex items-center justify-center rounded-lg border px-10 py-4 font-semibold transition-all hover:bg-white/10 active:scale-95 ${headline}`}
                            style={{
                                borderColor: "var(--pm-on-primary)",
                                color: "var(--pm-on-primary)",
                            }}
                        >
                            {secondaryCta}
                        </Link>
                    </div>
                </div>
                <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    aria-hidden
                >
                    <div
                        ref={glowRef}
                        className="absolute h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-[120px] transition-transform duration-500 ease-out"
                    />
                </div>
            </div>
        </section>
    );
}
