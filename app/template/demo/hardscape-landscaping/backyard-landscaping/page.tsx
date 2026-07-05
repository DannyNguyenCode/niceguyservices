import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingBackyardBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingBackyardBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Backyard Landscaping"),
};

export default function ValleyInterlockingBackyardPage() {
  return <ValleyInterlockingBackyardBody />;
}
