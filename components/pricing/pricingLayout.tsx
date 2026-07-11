"use client";

import AddOnsSection from "./AddOnsSection";
import PricingHero from "./PricingHero";
import PricingPlans from "./PricingPlans";
import PricingTrustSection from "./PricingTrustSection";
import PricingStarterScope from "./PricingStarterScope";
import PricingHostingFaq from "./PricingHostingFaq";
import PricingComparison from "./PricingComparison";
import ServicesModernCTA from "@/components/services/ServicesModernCTA";
import {
    pricingLayoutBodyFont as bodyFont,
    sitePageContentClass,
} from "./pricingLayoutConstants";

export default function PricingLayout() {
    return (
        <div
            className={`relative overflow-x-hidden pb-16 ${bodyFont}`}
            style={{
                backgroundColor: "var(--pm-surface)",
                color: "var(--pm-on-surface)",
            }}
        >
            <div className="pointer-events-none absolute inset-0 ng-grid-bg opacity-25" aria-hidden />
            <div
                className="pointer-events-none absolute -top-24 left-1/2 z-0 h-[min(420px,50vh)] w-screen -translate-x-1/2 rounded-full blur-[120px]"
                style={{ backgroundColor: "var(--pm-hero-orb)" }}
                aria-hidden
            />

            <div className="relative z-10">
                <div className={sitePageContentClass}>
                    <PricingHero />
                    <PricingPlans />
                    <PricingStarterScope />
                    <PricingComparison />
                    <AddOnsSection />
                    <PricingHostingFaq />
                </div>
                <PricingTrustSection />
                <ServicesModernCTA secondaryHref="/services" secondaryLabel="View services" />
            </div>
        </div>
    );
}
