import type { Metadata } from "next";
import { ValleyInterlockingResourcesBody } from "@/components/templates/demos/valley-interlocking/ValleyInterlockingResourcesBody";
import { ViDemoPage } from "@/components/templates/demos/valley-interlocking/ViDemoPage";
import { VI_IMG } from "@/components/templates/demos/valley-interlocking/valleyInterlockingImages";

export const metadata: Metadata = {
  title: "Resource Hub | Valley Interlocking & Landscaping (demo)",
  description:
    "Landscape knowledge and technical guides for interlocking installation, maintenance, and design — demo resource center.",
};

export default function ValleyInterlockingResourcesPage() {
  return (
    <ViDemoPage heroSrc={VI_IMG.resources.featured}>
      <ValleyInterlockingResourcesBody />
    </ViDemoPage>
  );
}
