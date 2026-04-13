"use client";

import {
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    LightBulbIcon,
} from "@heroicons/react/24/outline";
import type { ComponentType, SVGProps } from "react";
import type { WorkingWithMeItem } from "./aboutBiographyTypes";

type HeroOutline = ComponentType<SVGProps<SVGSVGElement>>;

const methodologyIconWrapClass = [
    "bg-primary/15 text-primary",
    "bg-secondary/15 text-secondary",
    "bg-accent/15 text-accent",
    "bg-primary/15 text-primary",
] as const;

const methodologyIcons: HeroOutline[] = [
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    ChartBarIcon,
    LightBulbIcon,
];

type BiographyMethodologySectionProps = {
    sectionTitle: string;
    sectionIntro: string;
    items: WorkingWithMeItem[];
};

export default function BiographyMethodologySection({
    sectionTitle,
    sectionIntro,
    items,
}: BiographyMethodologySectionProps) {
    return (
        <section className="bg-(--pm-surface) py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mx-auto mb-20 max-w-3xl text-center">
                    <h2 className="font-pm-headline mb-4 text-4xl font-bold text-(--pm-on-surface)">
                        {sectionTitle}
                    </h2>
                    <p className="text-(--pm-on-surface-variant)">
                        {sectionIntro}
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {items.map((item, i) => {
                        const MethodIcon =
                            methodologyIcons[i % methodologyIcons.length];
                        return (
                            <div
                                key={item.heading}
                                className="rounded-2xl border border-(--pm-outline-variant)/15 bg-(--pm-white) p-8 shadow-sm transition-transform duration-300 hover:-translate-y-2 dark:bg-base-100"
                            >
                                <div
                                    className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl ${methodologyIconWrapClass[i % methodologyIconWrapClass.length]}`}
                                >
                                    <MethodIcon
                                        className="h-6 w-6"
                                        aria-hidden
                                    />
                                </div>
                                <h3 className="font-pm-headline mb-3 text-xl font-bold">
                                    {item.heading}
                                </h3>
                                <p className="text-sm leading-relaxed text-(--pm-on-surface-variant)">
                                    {item.bodySegments.map((seg, j) =>
                                        seg.bold ? (
                                            <strong
                                                key={j}
                                                className="font-semibold text-(--pm-on-surface)"
                                            >
                                                {seg.text}
                                            </strong>
                                        ) : (
                                            <span key={j}>{seg.text}</span>
                                        ),
                                    )}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
