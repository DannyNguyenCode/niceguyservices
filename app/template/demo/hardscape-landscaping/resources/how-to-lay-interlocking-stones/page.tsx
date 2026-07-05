import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingHowToLayInterlockingBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingHowToLayInterlockingBody";
import { VI_HOW_TO_LAY_INTERLOCKING } from "@/components/templates/demos/valley-interlocking/valleyInterlockingHowToLayInterlockingContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: viDemoPageTitle(VI_HOW_TO_LAY_INTERLOCKING.title),
  description: VI_HOW_TO_LAY_INTERLOCKING.summary,
};

export default function ValleyInterlockingHowToLayInterlockingPage() {
  return (
    <ViDemoPage heroSrc={VI_HOW_TO_LAY_INTERLOCKING.heroImage}>
      <ValleyInterlockingHowToLayInterlockingBody />
    </ViDemoPage>
  );
}
