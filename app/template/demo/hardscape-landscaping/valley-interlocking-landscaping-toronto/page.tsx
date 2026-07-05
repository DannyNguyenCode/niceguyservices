import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingTorontoBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingTorontoBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("East Region Landscaping"),
};

export default function ValleyInterlockingTorontoPage() {
  return <ValleyInterlockingTorontoBody />;
}
