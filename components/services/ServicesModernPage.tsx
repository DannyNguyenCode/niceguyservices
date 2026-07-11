"use client";

import { pricingLayoutBodyFont as bodyFont } from "@/components/pricing/pricingLayoutConstants";
import ScrollToTop from "@/components/services/ScrollToTop";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesOfferingsSection from "@/components/services/ServicesOfferingsSection";
import ServicesModernCTA from "@/components/services/ServicesModernCTA";

export default function ServicesModernPage() {
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
                <ServicesHero />
                <ServicesOfferingsSection />
                <ServicesModernCTA />
            </div>

            <ScrollToTop />
        </div>
    );
}
