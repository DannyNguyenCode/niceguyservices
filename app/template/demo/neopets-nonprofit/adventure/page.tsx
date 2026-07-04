import type { Metadata } from "next";
import { NeopetsAdventureBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsAdventureBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Lost & Found — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/adventure"),
  },
};

export default function NeopetsAdventurePage() {
  return <NeopetsAdventureBody />;
}
