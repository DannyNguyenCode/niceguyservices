import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingDrivewayBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingDrivewayBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Driveway Paving"),
};

export default function ValleyInterlockingDrivewayPage() {
  return <ValleyInterlockingDrivewayBody />;
}
