import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingEdmontonBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingEdmontonBody";

export const metadata: Metadata = {
  title: viDemoPageTitle("West Region Landscaping"),
  description:
    "Premium interlocking and landscaping services in Edmonton. Expert craftsmanship and climate-resilient designs.",
};

export default function ValleyInterlockingEdmontonPage() {
  return <ValleyInterlockingEdmontonBody />;
}
