import type { Metadata } from "next";
import { viDemoPageTitle, viRouteMetadata } from '@/components/templates/demos/valley-interlocking/valleyInterlockingConfig';
import { ValleyInterlockingLandscapeLightingInstallBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingLandscapeLightingInstallBody";
import { VI_LANDSCAPE_LIGHTING_INSTALL } from "@/components/templates/demos/valley-interlocking/valleyInterlockingLandscapeLightingInstallContent";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";

export const metadata: Metadata = {
  title: viDemoPageTitle(VI_LANDSCAPE_LIGHTING_INSTALL.title),
  description: VI_LANDSCAPE_LIGHTING_INSTALL.summary,
};

export default function ValleyInterlockingLandscapeLightingInstallPage() {
  return (
    <ViDemoPage heroSrc={VI_LANDSCAPE_LIGHTING_INSTALL.heroImage}>
      <ValleyInterlockingLandscapeLightingInstallBody />
    </ViDemoPage>
  );
}
