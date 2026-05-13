import type { Metadata } from "next";
import { NeopetsAboutBody } from "@/components/experience-templates/neopets-nonprofit/NeopetsAboutBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "About — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/about"),
  },
};

export default function NeopetsAboutPage() {
  return <NeopetsAboutBody />;
}
