import type { Metadata } from "next";
import { ComfortflowHvacHomeBody } from "@/components/templates/demos/comfortflow-hvac/ComfortflowHvacHomeBody";
import { cfhDemoMetadataTitle, CFH_SITE_NAME } from "@/components/templates/demos/comfortflow-hvac/comfortflowHvacConfig";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: cfhDemoMetadataTitle(`${CFH_SITE_NAME} | Precision Engineered Comfort`),
  alternates: { canonical: absoluteUrl("/template/demo/comfortflow-hvac") },
};

export default function ComfortflowHvacHomePage() {
  return <ComfortflowHvacHomeBody />;
}
