"use client";

import React, { useEffect, useState, useCallback } from "react";
import ExperiencesSection from "./homepage/ExperiencesSection";
import BannerCTA from "./homepage/BannerCTA";
import AboutSection from "./homepage/AboutSection";
import TemplatesSection from "./homepage/TemplatesSection";
import PricingSection from "./homepage/PricingSection";
import SectionHeader from "./homepage/SectionHeader";

export default function Homepage() {
    const [contentHeight, setContentHeight] = useState<number>(0);

    const getElementHeight = (elementId: string): number => {
        if (typeof window === "undefined") return 0;
        const el = document.getElementById(elementId);
        return el?.offsetHeight ?? 0;
    };

    const computeContentHeight = useCallback(() => {
        const navHeight = getElementHeight("nav");
        const mainHeight = window.innerHeight;
        setContentHeight(mainHeight - navHeight);
    }, []);

    // On mount: compute initial height
    useEffect(() => {
        computeContentHeight();
    }, [computeContentHeight]);

    // Recompute on resize
    useEffect(() => {
        window.addEventListener("resize", computeContentHeight);
        return () => window.removeEventListener("resize", computeContentHeight);
    }, [computeContentHeight]);

    return (
        <main className="px-3 md:px-0 pt-4 md:pt-0">
            {/* Hero / section header gets dynamic height */}
            <SectionHeader contentHeight={contentHeight} />

            {/* Main homepage sections */}
            <div className="space-y-12 md:space-y-16">
                <ExperiencesSection />

                {/* Uncomment if/when you want this back */}
                {/* <BannerCTA /> */}

                <AboutSection contentHeight={contentHeight} />

                {/* <TemplatesSection /> */}

                <PricingSection />
            </div>
        </main>
    );
}
