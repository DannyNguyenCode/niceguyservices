"use client";

import { useState } from "react";
import AddOnsSection from "./AddOnsSection";
import ConsultCTA from "./ConsultCTA";
import PricingHero from "./PricingHero";
import PricingPlans from "./PricingPlans";
import PricingTrustSection from "./PricingTrustSection";
import { pricingLayoutBodyFont as bodyFont } from "./pricingLayoutConstants";

export default function PricingLayout() {
    const [focusOneTime, setFocusOneTime] = useState(false);

    return (
        <div
            className={`relative overflow-x-hidden pb-16 ${bodyFont}`}
            style={{
                backgroundColor: "var(--pm-surface)",
                color: "var(--pm-on-surface)",
            }}
        >
            <div
                className="pointer-events-none absolute -top-24 left-1/2 z-0 h-[min(420px,50vh)] w-screen -translate-x-1/2 rounded-full blur-[120px]"
                style={{ backgroundColor: "var(--pm-hero-orb)" }}
                aria-hidden
            />

            <div className="relative z-10">
                <PricingHero
                    focusOneTime={focusOneTime}
                    onFocusMonthly={() => setFocusOneTime(false)}
                    onFocusOneTime={() => setFocusOneTime(true)}
                />
                <PricingPlans focusOneTime={focusOneTime} />
                <PricingTrustSection />
                <AddOnsSection />
                <ConsultCTA />
            </div>
        </div>
    );
}
