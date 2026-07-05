import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingResourcesBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingResourcesBody";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";
import { VI_IMG } from "@/components/templates/demos/valley-interlocking/valleyInterlockingImages";

export const metadata: Metadata = viRouteMetadata("/resources");

export default function ValleyInterlockingResourcesPage() {
  return (
    <ViDemoPage heroSrc={VI_IMG.resources.featured}>
      <ValleyInterlockingResourcesBody />
    </ViDemoPage>
  );
}
