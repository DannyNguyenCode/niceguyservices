import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingBackyardDesignGuideBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingBackyardDesignGuideBody";
import { VI_BACKYARD_DESIGN_GUIDE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingBackyardDesignGuideContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: viDemoPageTitle(VI_BACKYARD_DESIGN_GUIDE.title),
  description: VI_BACKYARD_DESIGN_GUIDE.description,
};

export default function ValleyInterlockingBackyardDesignGuidePage() {
  return (
    <ViDemoPage heroSrc={VI_BACKYARD_DESIGN_GUIDE.heroImage}>
      <ValleyInterlockingBackyardDesignGuideBody />
    </ViDemoPage>
  );
}
