"use client";

import HomeAbout from "./HomeAbout";
import HomeContact from "./HomeContact";
import HomeHero from "./HomeHero";
import HomePricing from "./HomePricing";
import HomeServices from "./HomeServices";

export default function Homepage() {
    return (
        <div className="bg-(--pm-surface) font-pm-body text-(--pm-on-surface)">
            <HomeHero />
            <div className="space-y-24 pt-24 pb-24 md:space-y-32 md:pt-28 md:pb-32">
                <HomeServices />
                <HomeAbout />
                <HomePricing />
                <HomeContact />
            </div>
        </div>
    );
}
