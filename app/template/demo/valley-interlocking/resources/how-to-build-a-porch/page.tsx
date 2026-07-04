import type { Metadata } from "next";
import { ValleyInterlockingPorchBuildGuideBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingPorchBuildGuideBody";
import { VI_PORCH_BUILD_GUIDE } from "@/components/templates/demos/valley-interlocking/valleyInterlockingPorchBuildGuideContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: `${VI_PORCH_BUILD_GUIDE.title} | Valley Interlocking & Landscaping (demo)`,
  description: VI_PORCH_BUILD_GUIDE.description,
};

export default function ValleyInterlockingPorchBuildGuidePage() {
  return (
    <ViDemoPage heroSrc={VI_PORCH_BUILD_GUIDE.heroImage}>
      <ValleyInterlockingPorchBuildGuideBody />
    </ViDemoPage>
  );
}
