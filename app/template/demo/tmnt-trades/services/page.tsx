import type { Metadata } from "next";
import { TmntServicesBody } from "@/components/templates/demos/tmnt-construction/TmntServicesBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "TMNT — Trades | Services (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/services") },
};

export default function TmntConstructionServicesPage() {
  return <TmntServicesBody />;
}
