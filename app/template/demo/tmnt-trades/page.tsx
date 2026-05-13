import type { Metadata } from "next";
import { TmntHomeBody } from "@/components/experience-templates/tmnt-construction/TmntHomeBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TMNT — Trades | Home (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades") },
};

export default function TmntConstructionHomePage() {
  return <TmntHomeBody />;
}
