import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
    title: "About Nice Guy Services | Small Business Web Developer in Toronto",
    description:
        "Learn about Nice Guy Services — a Toronto-based web developer building fast, custom websites for small businesses with long-term support and clear communication.",
};

export default function AboutPage() {
    return <About />;
}
