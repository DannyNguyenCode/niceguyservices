"use client";

import ConsultCTA from "./ConsultCTA";
import PricingGrowthSection from "./PricingGrowthSection";
import PricingHero from "./PricingHero";
import PricingPlans from "./PricingPlans";
import PricingTrustSection from "./PricingTrustSection";
import { pricingLayoutBodyFont as bodyFont } from "./pricingLayoutConstants";

export default function PricingLayout() {
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
                <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
                    <PricingHero />
                    <PricingPlans />
                    <PricingGrowthSection />
                </div>
                <PricingTrustSection />
                <div className="mx-auto w-full max-w-[1200px] px-6 md:px-8">
                    <ConsultCTA />
                </div>
            </div>
        </div>
    );
}
