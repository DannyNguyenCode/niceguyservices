import type { Metadata } from "next";
import Pricing from "@/components/Pricing";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Website Pricing for Small Businesses | Nice Guy Web Design",
    description:
        "Starter Website $500 one-time (responsive, SEO-ready, contact form, performance, deployment, you own the site). Hosting & Reports $20/mo. Growth & Optimization $200/mo with SEO, CTA work, copy, landing pages, and monthly recommendations — designed to improve lead generation, not guaranteed. Custom quotes for booking, e-commerce, and integrations.",
    alternates: {
        canonical: absoluteUrl("/pricing"),
    },
};

export default function PricingPage() {
    return <Pricing />;
}
