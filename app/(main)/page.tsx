import type { Metadata } from "next";
import Content from "@/components/Content";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: {
    absolute: "Nice Guy Web Design | Toronto Small Business Websites",
  },
  description:
    "Custom websites and SEO-ready builds for Toronto and GTA small businesses. Fast, maintainable websites designed to improve visibility, generate leads, and support long-term growth.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Home() {
  return (
    <>
      <FaqJsonLd />
      <Content />
    </>
  );
}
