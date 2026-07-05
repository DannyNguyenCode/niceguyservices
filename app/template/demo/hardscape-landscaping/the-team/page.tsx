import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingTeamBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingTeamBody";

export const metadata: Metadata = viRouteMetadata("/the-team");

export default function ValleyInterlockingTheTeamPage() {
  return <ValleyInterlockingTeamBody />;
}
