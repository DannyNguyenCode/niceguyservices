import type { Metadata } from "next";
import { SkylineDesignsExperienceBody } from "@/components/templates/demos/skyline-designs/SkylineDesignsExperienceBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Work Experience | Skyline Designs (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/skyline-designs/experience") },
};

export default function SkylineDesignsExperiencePage() {
  return <SkylineDesignsExperienceBody />;
}
