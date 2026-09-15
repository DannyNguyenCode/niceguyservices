import type { Metadata } from "next";
import Content from "@/components/Content";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Toronto Web Design for Small Businesses",
  description:
    "Custom websites and SEO-ready builds for Toronto and GTA small businesses. Fast, maintainable websites designed to improve visibility, generate leads, and support long-term growth.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <FaqJsonLd />
      <Content />
    </>
  );
}
