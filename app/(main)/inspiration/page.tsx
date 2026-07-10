import type { Metadata } from "next";
import TemplatesPage from "@/components/templates/TemplatesPage";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Inspiration | Nice Guy Web Design",
    description:
        "Browse branded layout demos by stack — e-commerce with cart and checkout, services sites, and portfolio showcases from Nice Guy Web Design.",
    alternates: {
        canonical: absoluteUrl("/inspiration"),
    },
};

export default function InspirationRoutePage() {
    return <TemplatesPage />;
}
