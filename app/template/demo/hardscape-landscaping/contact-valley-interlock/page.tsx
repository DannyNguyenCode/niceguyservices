import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingContactBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingContactBody";

export const metadata: Metadata = viRouteMetadata("/contact-valley-interlock");

export default function ValleyInterlockingContactPage() {
  return <ValleyInterlockingContactBody />;
}
