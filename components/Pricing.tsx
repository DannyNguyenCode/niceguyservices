"use client";

import React, { useState } from "react";
import PricingHeader from "./pricing/PricingHeader";
import PricingPlans from "./pricing/PricingPlans";
import WordpressComparison from "./pricing/WordPressComparison";
import WhySubscription from "./pricing/WhySubscription";
import AddOnsSection from "./pricing/AddOnsSection";
import ConsultCTA from "./pricing/ConsultCTA";
import CostBreakdownModal from "./pricing/CostBreakdownModal";

const Pricing: React.FC = () => {
    const [breakdownOpen, setBreakdownOpen] = useState(false);

    return (
        <section className="bg-base-200 py-12 px-4">
            <div className="max-w-6xl mx-auto space-y-12">
                <PricingHeader />
                <PricingPlans />
                <WordpressComparison onOpenBreakdown={() => setBreakdownOpen(true)} />
                <WhySubscription />
                <AddOnsSection />
                <ConsultCTA />
            </div>

            <CostBreakdownModal
                open={breakdownOpen}
                onClose={() => setBreakdownOpen(false)}
            />
        </section>
    );
};

export default Pricing;
