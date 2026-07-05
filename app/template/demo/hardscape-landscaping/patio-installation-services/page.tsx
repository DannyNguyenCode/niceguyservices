import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingPatioBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingPatioBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Patio"),
};

export default function ValleyInterlockingPatioPage() {
  return <ValleyInterlockingPatioBody />;
}
