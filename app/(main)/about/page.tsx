import type { Metadata } from "next";
import About from "@/components/About";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = createPageMetadata({
    title: "About Danny Nguyen | Toronto Web Designer",
    description:
        "Learn about Nice Guy Web Design — a Toronto-based web developer building fast, custom websites for small businesses with long-term support and clear communication.",
    path: "/about",
    absoluteTitle: true,
});

export default function AboutPage() {
    return <About />;
}
