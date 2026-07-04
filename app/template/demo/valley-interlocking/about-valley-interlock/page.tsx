import type { Metadata } from "next";
import { ValleyInterlockingAboutBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingAboutBody";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";
import { VI_PAGE_HERO } from "@/components/templates/demos/valley-interlocking/valleyInterlockingHeroPreload";

export const metadata: Metadata = {
  title: "About Valley Interlocking & Landscaping | Valley Interlocking & Landscaping (demo)",
};

export default function ValleyInterlockingAboutPage() {
  return (
    <ViDemoPage heroSrc={VI_PAGE_HERO.about}>
      <ValleyInterlockingAboutBody />
    </ViDemoPage>
  );
}
