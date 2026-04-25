import type { Metadata } from "next";
import Pricing from "@/components/Pricing";

export const metadata: Metadata = {
    title: "Website Pricing for Small Businesses | Nice Guy Services",
    description:
        "Website build from $1,600 one-time, plus ongoing plans from $20/mo (Starter) to $200/mo (Pro) — maintenance, SEO, analytics, and conversion support.",
};

export default function PricingPage() {
    return <Pricing />;
}
