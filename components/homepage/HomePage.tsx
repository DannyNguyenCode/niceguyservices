"use client";

import HomeAbout from "./HomeAbout";
import HomeContact from "./HomeContact";
import HomeHero from "./HomeHero";
import HomePricing from "./HomePricing";
import HomeServices from "./HomeServices";

export default function Homepage() {
    return (
        <div className="selection:bg-(--pm-primary-container) selection:text-(--pm-on-primary)">
            <div className="bg-(--pm-surface) font-pm-body text-(--pm-on-surface)">
                <div className="space-y-24 pt-24 pb-24 md:space-y-32 md:pt-28 md:pb-32">
                    <HomeHero />
                    <HomeServices />
                    <HomeAbout />
                    <HomePricing />
                    <HomeContact />
                </div>
            </div>
        </div>
    );
}
