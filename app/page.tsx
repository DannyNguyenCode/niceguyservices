import type { Metadata } from "next";
import Content from "@/components/Content";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Web Design for Small Businesses in Toronto | Nice Guy Web Design",
  description:
    "Nice Guy Web Design builds fast, custom websites for small businesses in Toronto and the GTA — SEO-ready, mobile-friendly, and fully supported.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Home() {
  return <Content />;
}
