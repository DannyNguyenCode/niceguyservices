import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingAboutBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingAboutBody";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";
import { VI_PAGE_HERO } from "@/components/templates/demos/valley-interlocking/valleyInterlockingHeroPreload";

export const metadata: Metadata = viRouteMetadata("/about-valley-interlock");

export default function ValleyInterlockingAboutPage() {
  return (
    <ViDemoPage heroSrc={VI_PAGE_HERO.about}>
      <ValleyInterlockingAboutBody />
    </ViDemoPage>
  );
}
