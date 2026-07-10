import type { Metadata } from "next";
import TemplatesPage from "@/components/templates/TemplatesPage";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Website Inspirations | Nice Guy Web Design",
    description:
        "Browse branded layout demos by stack — e-commerce with cart and checkout, services sites, and portfolio showcases from Nice Guy Web Design.",
    alternates: {
        canonical: absoluteUrl("/website-inspirations"),
    },
};

export default function WebsiteInspirationsRoutePage() {
    return <TemplatesPage />;
}
