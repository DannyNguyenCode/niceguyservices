"use client";

import pricingContent from "./pricingContent.json";
import { pricingLayoutHeadline as headline } from "./pricingLayoutConstants";

type Props = {
    focusOneTime: boolean;
    onFocusMonthly: () => void;
    onFocusOneTime: () => void;
};

export default function PricingHero({
    focusOneTime,
    onFocusMonthly,
    onFocusOneTime,
}: Props) {
    const { hero } = pricingContent;

    return (
        <section className="relative w-full px-4 pb-8 pt-24 text-center sm:px-6 lg:px-10">
            <div className="w-full max-w-none">
                <div
                    className="mb-8 inline-block rounded-full border px-4 py-1.5"
                    style={{
                        backgroundColor: "var(--pm-badge-bg)",
                        borderColor: "var(--pm-badge-border)",
                    }}
                >
                    <span
                        className={`text-[10px] font-bold uppercase tracking-[0.2em] ${headline}`}
                        style={{ color: "var(--pm-secondary)" }}
                    >
                        {hero.badge}
                    </span>
                </div>
                <h1
                    className={`mb-6 text-5xl leading-none font-black tracking-tighter text-balance md:text-7xl lg:text-8xl ${headline}`}
                    style={{ color: "var(--pm-on-surface)" }}
                >
                    {hero.headlineBefore}
                    <br />
                    <span
                        className="bg-clip-text text-transparent"
                        style={{
                            backgroundImage: `linear-gradient(to right, var(--pm-primary), var(--pm-primary-container), var(--pm-secondary))`,
                        }}
                    >
                        {hero.headlineGradient}
                    </span>
                </h1>
                <p
                    className="mx-auto mb-12 max-w-2xl text-lg font-medium leading-relaxed"
                    style={{ color: "var(--pm-on-surface-variant)" }}
                >
                    {hero.subtitle}
                </p>
                <div
                    className="mx-auto flex w-fit items-center gap-1 rounded-xl p-2"
                    style={{ backgroundColor: "var(--pm-surface-low)" }}
                >
                    <button
                        type="button"
                        onClick={onFocusMonthly}
                        className={`rounded-lg px-6 py-2 text-sm font-bold transition-colors ${headline}`}
                        style={
                            !focusOneTime
                                ? {
                                      backgroundColor: "var(--pm-surface-high)",
                                      color: "var(--pm-primary)",
                                  }
                                : { color: "var(--pm-on-surface-variant)" }
                        }
                    >
                        {hero.toggleMonthly}
                    </button>
                    <button
                        type="button"
                        onClick={onFocusOneTime}
                        className={`rounded-lg px-6 py-2 text-sm font-bold transition-colors ${headline}`}
                        style={
                            focusOneTime
                                ? {
                                      backgroundColor: "var(--pm-surface-high)",
                                      color: "var(--pm-primary)",
                                  }
                                : { color: "var(--pm-on-surface-variant)" }
                        }
                    >
                        {hero.toggleOneTime}
                        <span
                            className="ml-1 text-xs font-semibold"
                            style={{ color: "var(--pm-secondary)" }}
                        >
                            {hero.toggleOneTimeNote}
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}
