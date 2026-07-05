import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingNotFoundBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingNotFoundBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Page Not Found"),
};

export default function ValleyInterlockingNotFound() {
  return <ValleyInterlockingNotFoundBody />;
}
