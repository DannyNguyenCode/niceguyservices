import type { Metadata } from "next";
import Services from "@/components/Services";
import ServicesJsonLd from "@/components/seo/ServicesJsonLd";
import { createPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Small Business Web Design Services in Toronto",
  description:
    "Explore Nice Guy Web Design: custom website builds, UX/UI design, performance & technical SEO, and ongoing maintenance for small businesses in Toronto and the GTA.",
  path: "/services",
});

export default function Page() {
  return (
    <>
      <ServicesJsonLd />
      <Services />
    </>
  );
}
