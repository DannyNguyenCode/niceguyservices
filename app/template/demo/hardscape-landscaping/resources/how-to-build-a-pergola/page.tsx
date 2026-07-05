import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingPergolaBuildGuideBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingPergolaBuildGuideBody";
import { VI_PERGOLA_BUILD_GUIDE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingPergolaBuildGuideContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: viDemoPageTitle(VI_PERGOLA_BUILD_GUIDE.title),
  description: VI_PERGOLA_BUILD_GUIDE.description,
};

export default function ValleyInterlockingPergolaBuildGuidePage() {
  return (
    <ViDemoPage heroSrc={VI_PERGOLA_BUILD_GUIDE.heroImage}>
      <ValleyInterlockingPergolaBuildGuideBody />
    </ViDemoPage>
  );
}
