import type { Metadata } from "next";
import { SkylineDesignsEducationBody } from "@/components/templates/demos/skyline-designs/SkylineDesignsEducationBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Education | Skyline Designs (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/skyline-designs/education") },
};

export default function SkylineDesignsEducationPage() {
  return <SkylineDesignsEducationBody />;
}
