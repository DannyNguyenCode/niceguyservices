"use client";

import { pricingLayoutPixelLabel as pixelLabel } from "@/components/pricing/pricingLayoutConstants";
import HomeAbout from "./HomeAbout";
import HomeContact from "./HomeContact";
import HomeFaq from "./HomeFaq";
import HomeHero from "./HomeHero";
import HomePricing from "./HomePricing";
import HomeServices from "./HomeServices";

export default function Homepage() {
    return (
        <div className="bg-(--pm-surface) font-pm-body text-(--pm-on-surface)">
            <HomeHero />
            <section
                className="mx-auto max-w-3xl px-4 pb-4 text-center md:px-8"
                aria-labelledby="areas-we-serve-heading"
            >
                <h2
                    id="areas-we-serve-heading"
                    className={`${pixelLabel} mb-3 text-sm font-bold capitalize tracking-[0.2em] text-(--pm-on-surface-variant)`}
                >
                    Areas We <span className="pixel-word ng-pixel-word-highlight">Serve</span>
                </h2>
                <p className="text-base leading-relaxed text-(--pm-on-surface-variant) md:text-lg">
                    Nice Guy Web Design works with contractors, creators, and small businesses
                    across Toronto and the GTA, with select remote projects throughout Canada.
                </p>
            </section>
            <div className="relative space-y-24 overflow-hidden pt-24 md:space-y-32 md:pt-28">
                <HomeServices />
                <HomeAbout />
                <HomePricing />
                <HomeFaq />
            </div>
            <HomeContact />
        </div>
    );
}
