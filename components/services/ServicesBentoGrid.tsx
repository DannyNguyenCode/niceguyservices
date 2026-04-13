"use client";

import type { KeyboardEvent } from "react";
import {
    BoltIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    LifebuoyIcon,
    PaintBrushIcon,
    SwatchIcon,
} from "@heroicons/react/24/solid";
import {
    goToContact,
    pricingLayoutHeadline as headline,
} from "@/components/pricing/pricingLayoutConstants";

const focusRing =
    "cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--pm-primary)]";

interface ServicesBentoGridProps {
    onOpenService: (serviceId: string) => void;
}

function activateOnKey(
    e: KeyboardEvent<HTMLElement>,
    onOpenService: (id: string) => void,
    serviceId: string,
) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpenService(serviceId);
    }
}

export default function ServicesBentoGrid({ onOpenService }: ServicesBentoGridProps) {
    return (
        <section className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Open details: custom website builds"
                    className={`flex flex-col justify-between rounded-xl border p-8 shadow-sm transition-opacity hover:opacity-[0.97] md:col-span-3 ${focusRing}`}
                    style={{
                        backgroundColor: "var(--pm-bento-tile-light)",
                        borderColor: `color-mix(in srgb, var(--pm-outline-variant) 15%, transparent)`,
                    }}
                    onClick={() => onOpenService("builds")}
                    onKeyDown={(e) => activateOnKey(e, onOpenService, "builds")}
                >
                    <div>
                        <div
                            className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg"
                            style={{
                                backgroundColor: `color-mix(in srgb, var(--pm-primary) 5%, transparent)`,
                            }}
                        >
                            <GlobeAltIcon
                                className="h-6 w-6"
                                style={{ color: "var(--pm-primary)" }}
                                aria-hidden
                            />
                        </div>
                        <h3 className={`mb-3 text-2xl font-bold ${headline}`}>Custom website builds</h3>
                        <p className="mb-6 text-sm" style={{ color: "var(--pm-on-surface-variant)" }}>
                            Bespoke digital architecture tailored to unique brand requirements and
                            technical needs.
                        </p>
                        <ul className="space-y-2">
                            {["Next.js & React frameworks", "API-first architecture"].map((line) => (
                                <li
                                    key={line}
                                    className="flex items-center gap-2 text-xs font-medium"
                                    style={{ color: "var(--pm-on-surface)" }}
                                >
                                    <span
                                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: "var(--pm-secondary)" }}
                                    />
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Open details: UX and UI design"
                    className={`relative flex flex-col justify-between overflow-hidden rounded-xl p-8 shadow-sm transition-opacity hover:opacity-[0.97] md:col-span-3 ${focusRing}`}
                    style={{ backgroundColor: "var(--pm-bento-tile-accent)" }}
                    onClick={() => onOpenService("design")}
                    onKeyDown={(e) => activateOnKey(e, onOpenService, "design")}
                >
                    <div
                        className="pointer-events-none absolute -right-10 top-0 opacity-10"
                        aria-hidden
                    >
                        <PaintBrushIcon
                            className="h-36 w-36 md:h-44 md:w-44"
                            style={{ color: "var(--pm-secondary)" }}
                            aria-hidden
                        />
                    </div>
                    <div className="relative z-10">
                        <div
                            className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg"
                            style={{
                                backgroundColor: `color-mix(in srgb, var(--pm-secondary) 5%, transparent)`,
                            }}
                        >
                            <SwatchIcon
                                className="h-6 w-6"
                                style={{ color: "var(--pm-secondary)" }}
                                aria-hidden
                            />
                        </div>
                        <h3 className={`mb-3 text-2xl font-bold ${headline}`}>UX/UI &amp; design</h3>
                        <p className="mb-6 text-sm" style={{ color: "var(--pm-on-surface-variant)" }}>
                            Human-centric interfaces built with technical precision and editorial
                            clarity.
                        </p>
                        <ul className="space-y-2">
                            {["Wireframing & prototyping", "Design systems development"].map((line) => (
                                <li
                                    key={line}
                                    className="flex items-center gap-2 text-xs font-medium"
                                    style={{ color: "var(--pm-on-surface)" }}
                                >
                                    <span
                                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                                        style={{ backgroundColor: "var(--pm-primary)" }}
                                    />
                                    {line}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {(
                    [
                        {
                            Icon: BoltIcon,
                            title: "Performance & SEO",
                            body: "Core Web Vitals optimization and deep technical indexing.",
                            tag: "High speed / high rank",
                            serviceId: "technical" as const,
                        },
                        {
                            Icon: LifebuoyIcon,
                            title: "Maintenance",
                            body: "Continuous monitoring, security updates, and uptime management.",
                            serviceId: "maintenance" as const,
                        },
                        {
                            Icon: EnvelopeIcon,
                            title: "Marketing growth",
                            body: "Email automation pipelines and lead-gen integration.",
                            serviceId: "growth" as const,
                        },
                    ] as const
                ).map((card, i) => {
                    const CardIcon = card.Icon;
                    const isLight = i === 0 || i === 2;
                    return (
                        <div
                            key={card.title}
                            role="button"
                            tabIndex={0}
                            aria-label={`Open details: ${card.title}`}
                            className={`rounded-xl p-8 transition-opacity hover:opacity-[0.97] md:col-span-2 ${isLight ? "border shadow-sm" : ""} ${focusRing}`}
                            style={{
                                backgroundColor: isLight
                                    ? "var(--pm-bento-tile-light)"
                                    : "var(--pm-bento-tile-accent)",
                                borderColor: isLight
                                    ? `color-mix(in srgb, var(--pm-outline-variant) 15%, transparent)`
                                    : undefined,
                            }}
                            onClick={() => onOpenService(card.serviceId)}
                            onKeyDown={(e) => activateOnKey(e, onOpenService, card.serviceId)}
                        >
                            <CardIcon
                                className="mb-4 block h-8 w-8"
                                style={{ color: "var(--pm-primary)" }}
                                aria-hidden
                            />
                            <h3 className={`mb-2 text-xl font-bold ${headline}`}>{card.title}</h3>
                            <p className="mb-4 text-sm" style={{ color: "var(--pm-on-surface-variant)" }}>
                                {card.body}
                            </p>
                            {"tag" in card && card.tag ? (
                                <div
                                    className={`mb-2 text-[10px] font-bold tracking-widest uppercase ${headline}`}
                                    style={{ color: "var(--pm-secondary)" }}
                                >
                                    {card.tag}
                                </div>
                            ) : null}
                        </div>
                    );
                })}

                <div
                    role="button"
                    tabIndex={0}
                    aria-label="Open details: custom and premium solutions"
                    className={`mt-4 flex cursor-pointer flex-col items-center justify-between gap-8 rounded-xl p-10 transition-opacity hover:opacity-[0.98] md:col-span-6 md:flex-row ${focusRing}`}
                    style={{ backgroundColor: "var(--pm-cta-band)" }}
                    onClick={() => onOpenService("custom")}
                    onKeyDown={(e) => activateOnKey(e, onOpenService, "custom")}
                >
                    <div className="flex-1">
                        <div
                            className={`mb-4 inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${headline}`}
                            style={{
                                backgroundColor: "var(--pm-primary)",
                                color: "var(--pm-on-primary)",
                            }}
                        >
                            Premium tier
                        </div>
                        <h3
                            className={`mb-4 text-3xl font-bold ${headline}`}
                            style={{ color: "var(--pm-white)" }}
                        >
                            Custom &amp; premium solutions
                        </h3>
                        <p className="max-w-xl" style={{ color: "var(--pm-cta-band-muted)" }}>
                            Scalable systems including custom apps, dashboards, and deep backend
                            integration.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            goToContact();
                        }}
                        className={`z-10 w-full cursor-pointer rounded-lg px-8 py-4 font-bold transition-colors md:w-auto ${headline} bg-(--pm-white) text-[#2c2f30] hover:opacity-95`}
                    >
                        Enquire for quote
                    </button>
                </div>
            </div>
        </section>
    );
}
