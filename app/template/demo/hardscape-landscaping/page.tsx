import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingHomeBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingHomeBody";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";
import { VI_PAGE_HERO } from "@/components/templates/demos/valley-interlocking/valleyInterlockingHeroPreload";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  ...viRouteMetadata("/"),
  alternates: { canonical: absoluteUrl("/template/demo/hardscape-landscaping") },
};

export default function ValleyInterlockingHomePage() {
  return (
    <ViDemoPage heroSrc={VI_PAGE_HERO.home}>
      <ValleyInterlockingHomeBody />
    </ViDemoPage>
  );
}
