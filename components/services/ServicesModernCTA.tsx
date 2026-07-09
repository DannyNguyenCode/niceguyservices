"use client";

import { type ReactNode, useCallback, useRef } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import PixelCtaLink from "@/components/ui/PixelCtaLink";
import {
    pricingLayoutHeadline as headline,
    sitePageContentClass,
} from "@/components/pricing/pricingLayoutConstants";
import pricingContent from "@/components/pricing/pricingContent.json";

type ServicesModernCTAProps = {
    layout?: "fullWidth" | "contained";
    mouseGlow?: boolean;
    title?: ReactNode;
    description?: string;
    primaryHref?: string;
    primaryLabel?: string;
    secondaryHref?: string;
    secondaryLabel?: string;
    className?: string;
};

export default function ServicesModernCTA({
    layout = "fullWidth",
    mouseGlow = false,
    title,
    description,
    primaryHref = pricingContent.meta.contactHref,
    primaryLabel = "Start your project",
    secondaryHref = "/pricing",
    secondaryLabel = "View pricing",
    className = "",
}: ServicesModernCTAProps = {}) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!mouseGlow) return;
        const section = sectionRef.current;
        const glow = glowRef.current;
        if (!section || !glow) return;

        const rect = section.getBoundingClientRect();
        glow.style.transform = `translate(${event.clientX - rect.left}px, ${event.clientY - rect.top}px)`;
    }, [mouseGlow]);

    const bandStyle = {
        background: `linear-gradient(to bottom right, var(--pm-primary), var(--pm-primary-dim))`,
        ...(layout === "contained" ? { boxShadow: "var(--pm-shadow-featured)" } : {}),
    };

    const dotPatternStyle = {
        backgroundImage: "radial-gradient(var(--pm-white) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
    };

    const inner = (
        <>
            <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-15" aria-hidden />
            <div
                className="pointer-events-none absolute inset-0 opacity-10"
                style={dotPatternStyle}
                aria-hidden
            />
            <div className={`relative z-10 text-center ${layout === "fullWidth" ? sitePageContentClass : ""}`}>
                <h2
                    className={`mb-8 capitalize text-3xl leading-tight font-extrabold md:text-5xl ${headline} ${layout === "contained" ? "mb-6" : ""}`}
                    style={{ color: "var(--pm-on-primary)" }}
                >
                    {title ?? (
                        <>
                            Ready for your next site <br className="hidden md:block" />
                            with Nice Guy Web Design?
                        </>
                    )}
                </h2>
                {description ? (
                    <p
                        className={`mx-auto max-w-2xl text-lg leading-relaxed ${layout === "contained" ? "mb-10" : "mb-8 md:mb-10"}`}
                        style={{ color: "color-mix(in srgb, var(--pm-on-primary) 80%, transparent)" }}
                    >
                        {description}
                    </p>
                ) : null}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <PixelCtaLink
                        href={primaryHref}
                        color="var(--ng-btn-sky)"
                        fill="var(--ng-btn-fill)"
                        textColor="var(--ng-btn-text)"
                        filled
                        pill={layout === "fullWidth"}
                        lg
                    >
                        {primaryLabel}
                    </PixelCtaLink>
                    <PixelCtaLink
                        href={secondaryHref}
                        color={layout === "fullWidth" ? "var(--pm-white)" : "var(--ng-btn-sky)"}
                        textColor={layout === "fullWidth" ? "var(--ng-btn-text)" : undefined}
                        pill={layout === "fullWidth"}
                        lg
                        className={layout === "fullWidth" ? "group" : undefined}
                    >
                        {secondaryLabel}
                        {layout === "fullWidth" ? (
                            <ArrowRightIcon
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                aria-hidden
                            />
                        ) : null}
                    </PixelCtaLink>
                </div>
            </div>
            {mouseGlow ? (
                <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
                    <div
                        ref={glowRef}
                        className="absolute h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30 blur-[120px] transition-transform duration-500 ease-out"
                    />
                </div>
            ) : null}
        </>
    );

    if (layout === "contained") {
        return (
            <section className={`mt-24 mb-12 ${sitePageContentClass} ${className}`}>
                <div
                    ref={sectionRef}
                    onMouseMove={handleMouseMove}
                    className="relative overflow-hidden rounded-2xl p-10 text-center md:p-20"
                    style={bandStyle}
                >
                    {inner}
                </div>
            </section>
        );
    }

    return (
        <section
            className={`relative w-full overflow-hidden py-12 md:py-20 ${className}`}
            style={bandStyle}
        >
            {inner}
        </section>
    );
}
