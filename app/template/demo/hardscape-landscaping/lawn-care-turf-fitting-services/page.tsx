import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingLawnCareBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingLawnCareBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Lawn Care & Turf"),
};

export default function ValleyInterlockingLawnCarePage() {
  return <ValleyInterlockingLawnCareBody />;
}
