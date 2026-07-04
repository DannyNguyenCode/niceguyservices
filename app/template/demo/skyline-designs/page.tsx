import type { Metadata } from "next";
import { SkylineDesignsHomeBody } from "@/components/templates/demos/skyline-designs/SkylineDesignsHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Skyline Designs | Toronto Digital Craftsman (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/skyline-designs") },
};

export default function SkylineDesignsHomePage() {
  return <SkylineDesignsHomeBody />;
}
