import type { Metadata } from "next";
import { TmntAboutBody } from "@/components/templates/demos/tmnt-construction/TmntAboutBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "TMNT — Trades | About (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/about") },
};

export default function TmntConstructionAboutPage() {
  return <TmntAboutBody />;
}
