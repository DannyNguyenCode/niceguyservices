import type { Metadata } from "next";
import FeaturedWork from "@/components/FeaturedWork";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = createPageMetadata({
    title: "Small Business Website Portfolio",
    description:
        "Selected website projects and internal builds from Nice Guy Web Design — portfolio sites, business websites, and custom web experiences for small businesses and creators.",
    path: "/featured-work",
});

export default function FeaturedWorkRoutePage() {
    return <FeaturedWork />;
}
