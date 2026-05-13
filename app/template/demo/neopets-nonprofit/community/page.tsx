import type { Metadata } from "next";
import { NeopetsCommunityBody } from "@/components/experience-templates/neopets-nonprofit/NeopetsCommunityBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Community — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/community"),
  },
};

export default function NeopetsCommunityPage() {
  return <NeopetsCommunityBody />;
}
