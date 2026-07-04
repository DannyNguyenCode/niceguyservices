import type { Metadata } from "next";
import { ValleyInterlockingServicesBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingServicesBody";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";
import { VI_PAGE_HERO } from "@/components/templates/demos/valley-interlocking/valleyInterlockingHeroPreload";

export const metadata: Metadata = {
  title: "Our Services | Valley Interlocking & Landscaping (demo)",
};

export default function ValleyInterlockingServicesPage() {
  return (
    <ViDemoPage heroSrc={VI_PAGE_HERO.services}>
      <ValleyInterlockingServicesBody />
    </ViDemoPage>
  );
}
