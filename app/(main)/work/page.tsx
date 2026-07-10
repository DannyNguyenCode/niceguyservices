import type { Metadata } from "next";
import FeaturedWork from "@/components/FeaturedWork";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Work | Nice Guy Web Design",
    description:
        "Selected website projects and internal builds from Nice Guy Web Design — portfolio sites, business websites, and custom web experiences for small businesses and creators.",
    alternates: {
        canonical: absoluteUrl("/work"),
    },
};

export default function WorkRoutePage() {
    return <FeaturedWork />;
}
