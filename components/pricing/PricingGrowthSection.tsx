"use client";

import Image from "next/image";
import { BoltIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import pricingContent from "./pricingContent.json";
import { pricingLayoutHeadline as headline } from "./pricingLayoutConstants";

const highlightIcons = {
    bolt: BoltIcon,
    shield: ShieldCheckIcon,
} as const;

export default function PricingGrowthSection() {
    const { growthStory } = pricingContent;
    const { title, body, image, highlights } = growthStory;

    return (
        <section className="mt-20 border-t border-(--pm-outline-variant)/40 pt-20 pb-24 md:mt-28 md:pt-28 md:pb-32 lg:pb-40">
            <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
                <div className="order-2 md:order-1">
                    <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl ring-1 ring-(--pm-outline-variant)/30">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="(min-width: 768px) 50vw, 100vw"
                        />
                        <div
                            className="pointer-events-none absolute inset-0 mix-blend-multiply"
                            style={{ backgroundColor: "color-mix(in srgb, var(--pm-primary) 12%, transparent)" }}
                            aria-hidden
                        />
                    </div>
                </div>
                <div className="order-1 md:order-2">
                    <h2
                        className={`mb-6 text-3xl font-black tracking-tight md:text-4xl ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        {title}
                    </h2>
                    <p
                        className="mb-8 text-base leading-relaxed md:text-lg"
                        style={{ color: "var(--pm-on-surface-variant)" }}
                    >
                        {body}
                    </p>
                    <div className="flex flex-col gap-4">
                        {highlights.map((item, index) => {
                            const Icon = highlightIcons[item.icon as keyof typeof highlightIcons];
                            if (!Icon) return null;
                            const iconColor =
                                index === 0 ? "var(--pm-secondary)" : "var(--pm-primary)";
                            return (
                                <div
                                    key={item.title}
                                    className="flex items-center gap-4 rounded-xl border p-4 shadow-sm"
                                    style={{
                                        borderColor: "var(--pm-border-light)",
                                        backgroundColor: "var(--pm-bento-tile-light)",
                                    }}
                                >
                                    <Icon
                                        className="h-7 w-7 shrink-0"
                                        style={{ color: iconColor }}
                                        aria-hidden
                                    />
                                    <span
                                        className={`text-base font-bold ${headline}`}
                                        style={{ color: "var(--pm-on-surface)" }}
                                    >
                                        {item.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
