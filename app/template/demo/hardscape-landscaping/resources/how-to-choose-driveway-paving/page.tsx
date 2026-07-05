import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingDrivewayPavingGuideBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingDrivewayPavingGuideBody";
import { VI_DRIVEWAY_PAVING_GUIDE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingDrivewayPavingGuideContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: viDemoPageTitle(VI_DRIVEWAY_PAVING_GUIDE.title),
  description: VI_DRIVEWAY_PAVING_GUIDE.description,
};

export default function ValleyInterlockingDrivewayPavingGuidePage() {
  return (
    <ViDemoPage heroSrc={VI_DRIVEWAY_PAVING_GUIDE.heroImage}>
      <ValleyInterlockingDrivewayPavingGuideBody />
    </ViDemoPage>
  );
}
