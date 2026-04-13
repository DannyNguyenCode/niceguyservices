"use client";

import PricingLayout from "./pricing/pricingLayout";

export default function Pricing() {
    return (
        <div
            data-pricing-page="modern"
            className="-mb-12 bg-[color:var(--pm-surface)] pb-10"
        >
            <PricingLayout />
        </div>
    );
}
