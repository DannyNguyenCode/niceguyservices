"use client";

import {
    goToContact,
    pricingLayoutHeadline as headline,
} from "@/components/pricing/pricingLayoutConstants";

export default function ServicesModernCTA() {
    return (
        <section className="mx-auto max-w-5xl px-6 py-20">
            <div
                className="relative overflow-hidden rounded-3xl p-12 text-center md:p-20"
                style={{
                    background: `linear-gradient(to bottom right, var(--pm-primary), var(--pm-primary-dim))`,
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
                        className={`mb-8 text-3xl leading-tight font-bold md:text-5xl ${headline}`}
                        style={{ color: "var(--pm-on-primary)" }}
                    >
                        Ready to architect your <br className="hidden md:block" />
                        next digital project?
                    </h2>
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={goToContact}
                            className={`inline-flex items-center justify-center rounded-xl px-10 py-5 font-bold shadow-lg transition-transform hover:scale-[1.02] ${headline}`}
                            style={{
                                backgroundColor: "var(--pm-white)",
                                color: "var(--pm-primary)",
                            }}
                        >
                            Start your project
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
