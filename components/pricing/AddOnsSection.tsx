"use client";

import { type CSSProperties } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import pricingContent from "./pricingContent.json";
import {
    goToContact,
    pricingLayoutHeadline as headline,
} from "./pricingLayoutConstants";
import { addOnIcons, type AddOnIconKey } from "./pricingIconMaps";

type IconBgKind =
    | "primary"
    | "secondary"
    | "primaryContainer"
    | "surfaceHighest";

function iconBoxStyle(kind: IconBgKind): CSSProperties {
    if (kind === "primary") {
        return {
            backgroundColor: `color-mix(in srgb, var(--pm-primary) 12%, transparent)`,
        };
    }
    if (kind === "secondary") {
        return {
            backgroundColor: `color-mix(in srgb, var(--pm-secondary) 12%, transparent)`,
        };
    }
    if (kind === "primaryContainer") {
        return {
            backgroundColor: `color-mix(in srgb, var(--pm-primary-container) 22%, transparent)`,
        };
    }
    return { backgroundColor: "var(--pm-surface-highest)" };
}

function isIconBg(v: string): v is IconBgKind {
    return (
        v === "primary" ||
        v === "secondary" ||
        v === "primaryContainer" ||
        v === "surfaceHighest"
    );
}

export default function AddOnsSection() {
    const { title, subtitle, ctaLabel, cards } = pricingContent.addOns;

    return (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-xl">
                    <h2
                        className={`mb-4 text-4xl font-black tracking-tight ${headline}`}
                        style={{ color: "var(--pm-on-surface)" }}
                    >
                        {title}
                    </h2>
                    <p className="font-medium" style={{ color: "var(--pm-on-surface-variant)" }}>
                        {subtitle}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={goToContact}
                    className={`flex items-center gap-2 text-sm font-bold transition-all hover:gap-3 ${headline}`}
                    style={{ color: "var(--pm-primary)" }}
                >
                    {ctaLabel} <ArrowRightIcon className="h-4 w-4" aria-hidden />
                </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {cards.map((card) => {
                    const Icon = addOnIcons[card.icon as AddOnIconKey];
                    const bg = isIconBg(card.iconBg) ? card.iconBg : "surfaceHighest";
                    return (
                        <div
                            key={card.title}
                            className="group rounded-2xl p-6 transition-all hover:bg-[color:var(--pm-surface-high)] hover:shadow-xl"
                            style={{
                                backgroundColor: "var(--pm-surface-low)",
                                boxShadow: "0 0 0 1px rgb(44 47 48 / 0.04)",
                            }}
                        >
                            <div
                                className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
                                style={iconBoxStyle(bg)}
                            >
                                <Icon
                                    className="h-6 w-6"
                                    style={{ color: "var(--pm-on-surface)" }}
                                    aria-hidden
                                />
                            </div>
                            <h4
                                className={`mb-2 font-bold ${headline}`}
                                style={{ color: "var(--pm-on-surface)" }}
                            >
                                {card.title}
                            </h4>
                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: "var(--pm-on-surface-variant)" }}
                            >
                                {card.desc}
                            </p>
                            <p
                                className={`mt-4 text-sm font-black ${headline}`}
                                style={{ color: "var(--pm-primary)" }}
                            >
                                {card.price}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
