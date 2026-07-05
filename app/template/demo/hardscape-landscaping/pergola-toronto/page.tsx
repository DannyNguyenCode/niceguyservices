import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingPergolasBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingPergolasBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Pergolas"),
};

export default function ValleyInterlockingPergolasPage() {
  return <ValleyInterlockingPergolasBody />;
}
