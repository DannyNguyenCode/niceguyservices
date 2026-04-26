"use client";

import pricingContent from "./pricingContent.json";
import {
    goToContact,
    pricingLayoutBodyFont as bodyFont,
    pricingLayoutHeadline as headline,
} from "./pricingLayoutConstants";

export default function ConsultCTA() {
    const { title, body, buttonLabel } = pricingContent.consultCta;

    return (
        <section className="pb-8">
            <div
                className="relative w-full overflow-hidden rounded-[48px] px-8 py-16 md:px-16 md:py-20"
                style={{ backgroundColor: "var(--pm-cta-band)" }}
            >
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div
                        className="absolute top-[-10%] right-[-5%] h-[120%] w-[40%] rounded-full blur-[100px]"
                        style={{ backgroundColor: "var(--pm-primary-alpha-40)" }}
                        aria-hidden
                    />
                    <div
                        className="absolute bottom-[-20%] left-[-10%] h-full w-[30%] rounded-full blur-[80px]"
                        style={{
                            backgroundColor: `color-mix(in srgb, var(--pm-secondary) 18%, transparent)`,
                        }}
                        aria-hidden
                    />
                </div>
                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    <h2
                        className={`mb-6 text-4xl font-black tracking-tighter text-white md:text-6xl ${headline}`}
                    >
                        {title}
                    </h2>
                    <p
                        className="mx-auto mb-10 max-w-xl text-lg font-medium leading-relaxed"
                        style={{ color: "var(--pm-cta-band-muted)" }}
                    >
                        {body}
                    </p>
                    <button
                        type="button"
                        onClick={goToContact}
                        className={`rounded-xl px-8 py-4 text-sm font-bold shadow-xl transition-colors duration-200 active:scale-95 ${bodyFont} bg-(--pm-white) text-[#2c2f30] hover:bg-(--pm-secondary-container) hover:text-white`}
                        style={{
                            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.2)",
                        }}
                    >
                        {buttonLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}
