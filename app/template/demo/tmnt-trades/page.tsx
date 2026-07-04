import type { Metadata } from "next";
import { TmntHomeBody } from "@/components/templates/demos/tmnt-construction/TmntHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "TMNT — Trades | Home (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades") },
};

export default function TmntConstructionHomePage() {
  return <TmntHomeBody />;
}
