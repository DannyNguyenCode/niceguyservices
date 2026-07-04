import type { Metadata } from "next";
import { ValleyInterlockingLawnCareMaintenanceGuideBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingLawnCareMaintenanceGuideBody";
import { VI_LAWN_CARE_MAINTENANCE_GUIDE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingLawnCareMaintenanceGuideContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: `${VI_LAWN_CARE_MAINTENANCE_GUIDE.title} | Valley Interlocking & Landscaping (demo)`,
  description: VI_LAWN_CARE_MAINTENANCE_GUIDE.description,
};

export default function ValleyInterlockingLawnCareMaintenanceGuidePage() {
  return (
    <ViDemoPage heroSrc={VI_LAWN_CARE_MAINTENANCE_GUIDE.heroImage}>
      <ValleyInterlockingLawnCareMaintenanceGuideBody />
    </ViDemoPage>
  );
}
