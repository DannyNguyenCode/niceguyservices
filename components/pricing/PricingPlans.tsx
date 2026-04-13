"use client";

import { type CSSProperties } from "react";
import pricingContent from "./pricingContent.json";
import {
    goToContact,
    pricingLayoutGlassCard as glassCard,
    pricingLayoutHeadline as headline,
} from "./pricingLayoutConstants";
import { BoltIcon, CheckCircleIcon } from "./pricingIconMaps";

type Props = {
    focusOneTime: boolean;
};

export default function PricingPlans({ focusOneTime }: Props) {
    const { spark, monthlyCare, nova } = pricingContent.plans;

    return (
        <section className="px-4 py-10 sm:px-8">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3 md:items-stretch">
                <div
                    className={`${glassCard} flex flex-col border hover:-translate-y-2`}
                    style={
                        {
                            background: "var(--pm-glass)",
                            borderColor: "var(--pm-white)",
                            boxShadow: "0 1px 2px rgb(44 47 48 / 0.04)",
                        } as CSSProperties
                    }
                >
                    <div className="mb-10">
                        <span
                            className={`mb-4 block text-xs font-black tracking-widest uppercase ${headline}`}
                            style={{ color: "var(--pm-on-surface-variant)", opacity: 0.75 }}
                        >
                            {spark.tierLabel}
                        </span>
                        <h3 className={`mb-2 text-4xl font-black tracking-tight ${headline}`}>
                            {spark.name}
                        </h3>
                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--pm-on-surface-variant)" }}
                        >
                            {spark.tagline}
                        </p>
                    </div>
                    <div className="mb-8 flex items-baseline gap-1">
                        <span className={`text-4xl font-black ${headline}`}>{spark.price}</span>
                        <span
                            className="font-medium"
                            style={{ color: "var(--pm-on-surface-variant)" }}
                        >
                            {spark.priceUnit}
                        </span>
                    </div>
                    <p
                        className="mb-6 text-xs font-medium"
                        style={{ color: "var(--pm-on-surface-variant)" }}
                    >
                        {spark.footnote}
                    </p>
                    <ul className="mb-12 flex grow flex-col space-y-4">
                        {spark.features.map((line) => (
                            <li
                                key={line}
                                className="flex items-center gap-3 text-sm"
                                style={{ color: "var(--pm-on-surface)", opacity: 0.85 }}
                            >
                                <CheckCircleIcon
                                    className="h-5 w-5 shrink-0"
                                    style={{ color: "var(--pm-secondary)" }}
                                    aria-hidden
                                />
                                {line}
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={goToContact}
                        className={`w-full rounded-xl border py-4 text-sm font-bold transition-all active:scale-95 ${headline}`}
                        style={{
                            borderColor: "var(--pm-border-light)",
                            color: "var(--pm-on-surface)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--pm-surface-container)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        {spark.buttonLabel}
                    </button>
                </div>

                <div
                    className={`${glassCard} relative z-10 flex flex-col border-2 transition-transform ${
                        !focusOneTime ? "md:scale-105" : "md:scale-100"
                    }`}
                    style={{
                        background: "var(--pm-glass)",
                        borderColor: "var(--pm-primary-alpha-50)",
                        boxShadow: !focusOneTime ? "var(--pm-shadow-featured)" : undefined,
                    }}
                >
                    {!focusOneTime && (
                        <div
                            className={`absolute -top-4 left-1/2 z-20 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest ${headline}`}
                            style={{
                                backgroundColor: "var(--pm-primary)",
                                color: "var(--pm-on-primary)",
                            }}
                        >
                            {monthlyCare.popularBadge}
                        </div>
                    )}
                    <div className="mb-10">
                        <span
                            className={`mb-4 block text-xs font-black tracking-widest uppercase ${headline}`}
                            style={{ color: "var(--pm-primary)" }}
                        >
                            {monthlyCare.tierLabel}
                        </span>
                        <div className="mb-2 flex items-baseline gap-1">
                            <h3 className={`text-5xl font-black tracking-tight ${headline}`}>
                                {monthlyCare.price}
                            </h3>
                            <span
                                className="font-medium"
                                style={{ color: "var(--pm-on-surface-variant)" }}
                            >
                                {monthlyCare.priceUnit}
                            </span>
                        </div>
                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--pm-on-surface-variant)" }}
                        >
                            {monthlyCare.tagline}
                        </p>
                    </div>
                    <ul className="mb-12 flex grow flex-col space-y-4 text-sm font-semibold">
                        {monthlyCare.features.map((line) => (
                            <li key={line} className="flex items-center gap-3">
                                <BoltIcon
                                    className="h-5 w-5 shrink-0"
                                    style={{ color: "var(--pm-primary)" }}
                                    aria-hidden
                                />
                                {line}
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={goToContact}
                        className={`w-full rounded-xl py-4 text-sm font-bold shadow-xl transition-all active:scale-95 ${headline}`}
                        style={{
                            background: `linear-gradient(to bottom right, var(--pm-primary), var(--pm-primary-container))`,
                            color: "var(--pm-on-primary)",
                            boxShadow: "var(--pm-shadow-cta-button)",
                        }}
                    >
                        {monthlyCare.buttonLabel}
                    </button>
                </div>

                <div
                    className={`${glassCard} flex flex-col border transition-transform hover:-translate-y-2 ${
                        focusOneTime ? "md:scale-105" : ""
                    }`}
                    style={
                        {
                            background: "var(--pm-glass)",
                            borderColor: "var(--pm-white)",
                            boxShadow: focusOneTime
                                ? "var(--pm-shadow-nova-focus)"
                                : "0 1px 2px rgb(44 47 48 / 0.04)",
                        } as CSSProperties
                    }
                >
                    {focusOneTime && (
                        <div
                            className={`mb-4 inline-block self-start rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${headline}`}
                            style={{
                                borderColor: "var(--pm-secondary-alpha-40)",
                                color: "var(--pm-secondary)",
                            }}
                        >
                            {nova.focusBadge}
                        </div>
                    )}
                    <div className="mb-10">
                        <span
                            className={`mb-4 block text-xs font-black tracking-widest uppercase ${headline}`}
                            style={{ color: "var(--pm-on-surface-variant)", opacity: 0.75 }}
                        >
                            {nova.tierLabel}
                        </span>
                        <h3 className={`mb-2 text-4xl font-black tracking-tight ${headline}`}>
                            {nova.name}
                        </h3>
                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--pm-on-surface-variant)" }}
                        >
                            {nova.tagline}
                        </p>
                    </div>
                    <div className="mb-8 flex items-baseline gap-1">
                        <span className={`text-4xl font-black ${headline}`}>{nova.price}</span>
                        <span
                            className="font-medium"
                            style={{ color: "var(--pm-on-surface-variant)" }}
                        >
                            {nova.priceUnit}
                        </span>
                    </div>
                    <ul className="mb-12 flex grow flex-col space-y-4">
                        {nova.features.map((line) => (
                            <li
                                key={line}
                                className="flex items-center gap-3 text-sm"
                                style={{ color: "var(--pm-on-surface)", opacity: 0.85 }}
                            >
                                <CheckCircleIcon
                                    className="h-5 w-5 shrink-0"
                                    style={{ color: "var(--pm-secondary)" }}
                                    aria-hidden
                                />
                                {line}
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={goToContact}
                        className={`w-full rounded-xl border py-4 text-sm font-bold transition-all active:scale-95 ${headline}`}
                        style={{
                            borderColor: "var(--pm-border-light)",
                            color: "var(--pm-on-surface)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "var(--pm-surface-container)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        {nova.buttonLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}
