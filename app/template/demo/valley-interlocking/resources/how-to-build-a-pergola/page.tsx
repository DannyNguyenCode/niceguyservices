import type { Metadata } from "next";
import { ValleyInterlockingPergolaBuildGuideBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingPergolaBuildGuideBody";
import { VI_PERGOLA_BUILD_GUIDE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingPergolaBuildGuideContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: `${VI_PERGOLA_BUILD_GUIDE.title} | Valley Interlocking & Landscaping (demo)`,
  description: VI_PERGOLA_BUILD_GUIDE.description,
};

export default function ValleyInterlockingPergolaBuildGuidePage() {
  return (
    <ViDemoPage heroSrc={VI_PERGOLA_BUILD_GUIDE.heroImage}>
      <ValleyInterlockingPergolaBuildGuideBody />
    </ViDemoPage>
  );
}
