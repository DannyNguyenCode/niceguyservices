import type { Metadata } from "next";
import Services from "@/components/Services";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Website Design Services for Small Businesses in Toronto | Nice Guy Web Design",
  description:
    "Explore Nice Guy Web Design: custom website builds, UX/UI design, performance & technical SEO, and ongoing maintenance for small businesses in Toronto and the GTA.",
  alternates: {
    canonical: absoluteUrl("/services"),
  },
};

export default function Page() {
  return <Services />;
}
