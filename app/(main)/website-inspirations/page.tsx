import type { Metadata } from "next";
import TemplatesPage from "@/components/templates/TemplatesPage";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = createPageMetadata({
    title: "Website Inspiration Demos",
    description:
        "Browse branded layout demos by stack — e-commerce with cart and checkout, services sites, and portfolio showcases from Nice Guy Web Design.",
    path: "/website-inspirations",
});

export default function WebsiteInspirationsRoutePage() {
    return <TemplatesPage />;
}
