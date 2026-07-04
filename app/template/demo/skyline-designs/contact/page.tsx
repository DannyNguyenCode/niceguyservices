import type { Metadata } from "next";
import { SkylineDesignsContactBody } from "@/components/templates/demos/skyline-designs/SkylineDesignsContactBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Contact | Skyline Designs (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/skyline-designs/contact") },
};

export default function SkylineDesignsContactPage() {
  return <SkylineDesignsContactBody />;
}
