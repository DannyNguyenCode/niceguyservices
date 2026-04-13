import type { Metadata } from "next";
import ServicesModernPage from "@/components/services/ServicesModernPage";

export const metadata: Metadata = {
    title: "Website Design Services for Small Businesses in Toronto | Nice Guy Services",
    description:
        "Explore Nice Guy Services: custom website builds, UX/UI design, performance & technical SEO, and ongoing maintenance for small businesses in Toronto and the GTA.",
};

export default function ServicesPage() {
    return (
        <div
            data-services-page="modern"
            className="-mb-12 bg-(--pm-surface) pb-10"
        >
            <ServicesModernPage />
        </div>
    );
}
