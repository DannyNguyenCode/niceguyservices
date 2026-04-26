import type { Metadata } from "next";
import HomepageClient from "@/components/homepage/HomePage";

export const metadata: Metadata = {
    title: "Custom Websites for Small Businesses in Toronto | Nice Guy Web Design",
    description:
        "Nice Guy Web Design builds fast, custom websites for small businesses in Toronto and the GTA — SEO-ready, mobile-friendly, and fully supported.",
};

export default function Content() {
    return <HomepageClient />;
}
