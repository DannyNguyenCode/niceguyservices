import type { Metadata } from "next";
import { ValleyInterlockingHowToLayInterlockingBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingHowToLayInterlockingBody";
import { VI_HOW_TO_LAY_INTERLOCKING } from "@/components/templates/demos/valley-interlocking/valleyInterlockingHowToLayInterlockingContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: `${VI_HOW_TO_LAY_INTERLOCKING.title} | Valley Interlocking & Landscaping (demo)`,
  description: VI_HOW_TO_LAY_INTERLOCKING.summary,
};

export default function ValleyInterlockingHowToLayInterlockingPage() {
  return (
    <ViDemoPage heroSrc={VI_HOW_TO_LAY_INTERLOCKING.heroImage}>
      <ValleyInterlockingHowToLayInterlockingBody />
    </ViDemoPage>
  );
}
