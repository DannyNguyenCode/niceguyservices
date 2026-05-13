import type { Metadata } from "next";
import { TmntProjectsBody } from "@/components/experience-templates/tmnt-construction/TmntProjectsBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TMNT — Trades | Mission logs (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/projects") },
};

export default function TmntConstructionProjectsPage() {
  return <TmntProjectsBody />;
}
