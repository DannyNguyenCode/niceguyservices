import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingPatioDesignGuideBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingPatioDesignGuideBody";
import { VI_PATIO_DESIGN_GUIDE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingPatioDesignGuideContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: viDemoPageTitle(VI_PATIO_DESIGN_GUIDE.title),
  description: VI_PATIO_DESIGN_GUIDE.description,
};

export default function ValleyInterlockingPatioDesignGuidePage() {
  return (
    <ViDemoPage heroSrc={VI_PATIO_DESIGN_GUIDE.heroImage}>
      <ValleyInterlockingPatioDesignGuideBody />
    </ViDemoPage>
  );
}
