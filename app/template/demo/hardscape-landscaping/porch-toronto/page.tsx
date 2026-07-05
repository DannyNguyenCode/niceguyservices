import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingPorchBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingPorchBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("Porch"),
};

export default function ValleyInterlockingPorchPage() {
  return <ValleyInterlockingPorchBody />;
}
