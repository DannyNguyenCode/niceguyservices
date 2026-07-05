import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingLightingBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingLightingBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Landscape Lighting"),
};

export default function ValleyInterlockingLightingPage() {
  return <ValleyInterlockingLightingBody />;
}
