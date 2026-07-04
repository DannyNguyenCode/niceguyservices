import type { Metadata } from "next";
import { ValleyInterlockingLightingBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingLightingBody";

export const metadata: Metadata = {
  title: "Landscape Lighting | Valley Interlocking & Landscaping (demo)",
};

export default function ValleyInterlockingLightingPage() {
  return <ValleyInterlockingLightingBody />;
}
