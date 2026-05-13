import type { Metadata } from "next";
import { NeopetsProfileBody } from "@/components/experience-templates/neopets-nonprofit/NeopetsProfileBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Profile — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/profile"),
  },
};

export default function NeopetsProfilePage() {
  return <NeopetsProfileBody />;
}
