import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingLandscapePlanningBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingLandscapePlanningBody";
import { VI_LANDSCAPE_PLANNING } from "@/components/templates/demos/valley-interlocking/valleyInterlockingLandscapePlanningContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: viDemoPageTitle(VI_LANDSCAPE_PLANNING.title),
  description: VI_LANDSCAPE_PLANNING.summary,
};

export default function ValleyInterlockingLandscapePlanningPage() {
  return (
    <ViDemoPage heroSrc={VI_LANDSCAPE_PLANNING.heroImage}>
      <ValleyInterlockingLandscapePlanningBody />
    </ViDemoPage>
  );
}
