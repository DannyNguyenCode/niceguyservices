import type { Metadata } from "next";
import Pricing from "@/components/Pricing";

export const metadata: Metadata = {
    title: "Website Pricing for Small Businesses | Nice Guy Services",
    description:
        "Transparent website pricing for small businesses. Choose between one-time custom website builds or a monthly website subscription with hosting, updates, and support included.",
};

export default function PricingPage() {
    return <Pricing />;
}
