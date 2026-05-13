import type { Metadata } from "next";
import { NeopetsAdventureBody } from "@/components/experience-templates/neopets-nonprofit/NeopetsAdventureBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Lost & Found — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/adventure"),
  },
};

export default function NeopetsAdventurePage() {
  return <NeopetsAdventureBody />;
}
