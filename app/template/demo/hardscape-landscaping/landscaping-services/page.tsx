import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingLandscapingBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingLandscapingBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Landscaping"),
};

export default function ValleyInterlockingLandscapingPage() {
  return <ValleyInterlockingLandscapingBody />;
}
