import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingGalleryBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingGalleryBody";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";
import { VI_PAGE_HERO } from "@/components/templates/demos/valley-interlocking/valleyInterlockingHeroPreload";

export const metadata: Metadata = viRouteMetadata("/our-work-valley-interlock");

export default function ValleyInterlockingGalleryPage() {
  return (
    <ViDemoPage heroSrc={VI_PAGE_HERO.gallery}>
      <ValleyInterlockingGalleryBody />
    </ViDemoPage>
  );
}
