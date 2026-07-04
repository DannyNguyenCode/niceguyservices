import type { Metadata } from "next";
import { ValleyInterlockingLandscapePlanningBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingLandscapePlanningBody";
import { VI_LANDSCAPE_PLANNING } from "@/components/templates/demos/valley-interlocking/valleyInterlockingLandscapePlanningContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: `${VI_LANDSCAPE_PLANNING.title} | Valley Interlocking & Landscaping (demo)`,
  description: VI_LANDSCAPE_PLANNING.summary,
};

export default function ValleyInterlockingLandscapePlanningPage() {
  return (
    <ViDemoPage heroSrc={VI_LANDSCAPE_PLANNING.heroImage}>
      <ValleyInterlockingLandscapePlanningBody />
    </ViDemoPage>
  );
}
