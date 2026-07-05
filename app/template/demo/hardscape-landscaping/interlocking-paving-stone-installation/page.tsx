import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingInterlockingBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingInterlockingBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Interlocking & Paving"),
};

export default function ValleyInterlockingInterlockingPage() {
  return <ValleyInterlockingInterlockingBody />;
}
