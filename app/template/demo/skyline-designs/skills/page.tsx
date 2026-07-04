import type { Metadata } from "next";
import { SkylineDesignsSkillsBody } from "@/components/templates/demos/skyline-designs/SkylineDesignsSkillsBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Skills | Skyline Designs (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/skyline-designs/skills") },
};

export default function SkylineDesignsSkillsPage() {
  return <SkylineDesignsSkillsBody />;
}
