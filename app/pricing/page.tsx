import type { Metadata } from "next";
import Pricing from "@/components/Pricing";

export const metadata: Metadata = {
    title: "Website Pricing for Small Businesses | Nice Guy Web Design",
    description:
        "Two website packages: $1,600 upfront plus $20/mo (SEO-ready, domain, hosting, maintenance), or $0 upfront and $150/mo with ongoing SEO, CRO, reporting, unlimited edits, and 24/7 support. Add-ons for extra pages and hourly work.",
};

export default function PricingPage() {
    return <Pricing />;
}
