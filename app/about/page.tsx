import type { Metadata } from "next";
import About from "@/components/About";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "About Nice Guy Web Design | Small Business Web Developer in Toronto",
    description:
        "Learn about Nice Guy Web Design — a Toronto-based web developer building fast, custom websites for small businesses with long-term support and clear communication.",
    alternates: {
        canonical: absoluteUrl("/about"),
    },
};

export default function AboutPage() {
    return <About />;
}
