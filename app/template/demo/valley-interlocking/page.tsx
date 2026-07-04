import type { Metadata } from "next";
import { ValleyInterlockingHomeBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingHomeBody";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";
import { VI_PAGE_HERO } from "@/components/templates/demos/valley-interlocking/valleyInterlockingHeroPreload";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Valley Interlocking & Landscaping | Premium Outdoor Craftsmanship (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/valley-interlocking") },
};

export default function ValleyInterlockingHomePage() {
  return (
    <ViDemoPage heroSrc={VI_PAGE_HERO.home}>
      <ValleyInterlockingHomeBody />
    </ViDemoPage>
  );
}
