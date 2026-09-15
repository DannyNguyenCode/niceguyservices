import type { Metadata } from "next";
import Pricing from "@/components/Pricing";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = createPageMetadata({
    title: "Website Design Pricing",
    description:
        "Starter Website $250 one-time (responsive, SEO-ready, contact form, performance, deployment, you own the site). Hosting & Reports $10/mo. Growth & Optimization $200/mo with SEO, CTA work, copy, landing pages, and monthly recommendations — designed to improve lead generation, not guaranteed. Custom quotes for booking, e-commerce, and integrations.",
    path: "/pricing",
});

export default function PricingPage() {
    return <Pricing />;
}
