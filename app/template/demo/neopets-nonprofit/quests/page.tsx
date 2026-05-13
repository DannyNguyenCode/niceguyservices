import type { Metadata } from "next";
import { NeopetsQuestsBody } from "@/components/experience-templates/neopets-nonprofit/NeopetsQuestsBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Community Missions — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/quests"),
  },
};

export default function NeopetsQuestsPage() {
  return <NeopetsQuestsBody />;
}
