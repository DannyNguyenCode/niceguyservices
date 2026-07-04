import type { Metadata } from "next";
import { TmntProjectsBody } from "@/components/templates/demos/tmnt-construction/TmntProjectsBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "TMNT — Trades | Mission logs (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/projects") },
};

export default function TmntConstructionProjectsPage() {
  return <TmntProjectsBody />;
}
