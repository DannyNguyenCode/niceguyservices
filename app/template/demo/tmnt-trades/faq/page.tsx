import type { Metadata } from "next";
import { TmntFaqBody } from "@/components/templates/demos/tmnt-construction/TmntFaqBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "TMNT — Trades | FAQ (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/faq") },
};

export default function TmntConstructionFaqPage() {
  return <TmntFaqBody />;
}
