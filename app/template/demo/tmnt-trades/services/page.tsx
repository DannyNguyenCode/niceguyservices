import type { Metadata } from "next";
import { TmntServicesBody } from "@/components/experience-templates/tmnt-construction/TmntServicesBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TMNT — Trades | Services (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/services") },
};

export default function TmntConstructionServicesPage() {
  return <TmntServicesBody />;
}
