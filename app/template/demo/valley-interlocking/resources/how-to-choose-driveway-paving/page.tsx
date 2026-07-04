import type { Metadata } from "next";
import { ValleyInterlockingDrivewayPavingGuideBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingDrivewayPavingGuideBody";
import { VI_DRIVEWAY_PAVING_GUIDE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingDrivewayPavingGuideContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: `${VI_DRIVEWAY_PAVING_GUIDE.title} | Valley Interlocking & Landscaping (demo)`,
  description: VI_DRIVEWAY_PAVING_GUIDE.description,
};

export default function ValleyInterlockingDrivewayPavingGuidePage() {
  return (
    <ViDemoPage heroSrc={VI_DRIVEWAY_PAVING_GUIDE.heroImage}>
      <ValleyInterlockingDrivewayPavingGuideBody />
    </ViDemoPage>
  );
}
