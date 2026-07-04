import type { Metadata } from "next";
import { ValleyInterlockingPatioDesignGuideBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingPatioDesignGuideBody";
import { VI_PATIO_DESIGN_GUIDE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingPatioDesignGuideContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: `${VI_PATIO_DESIGN_GUIDE.title} | Valley Interlocking & Landscaping (demo)`,
  description: VI_PATIO_DESIGN_GUIDE.description,
};

export default function ValleyInterlockingPatioDesignGuidePage() {
  return (
    <ViDemoPage heroSrc={VI_PATIO_DESIGN_GUIDE.heroImage}>
      <ValleyInterlockingPatioDesignGuideBody />
    </ViDemoPage>
  );
}
