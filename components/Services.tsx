import type { Metadata } from "next";
import ServicesClient from "@/components/services/ServicesPage";

export const metadata: Metadata = {
    title: "Website Design Services for Small Businesses in Toronto | Nice Guy Services",
    description:
        "Explore Nice Guy Services: custom website builds, UX/UI design, performance & technical SEO, and ongoing maintenance for small businesses in Toronto and the GTA.",
};

export default function ServicesPage() {
    return <ServicesClient />;
}
