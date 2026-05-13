import type { Metadata } from "next";
import { TmntFaqBody } from "@/components/experience-templates/tmnt-construction/TmntFaqBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TMNT — Trades | FAQ (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/faq") },
};

export default function TmntConstructionFaqPage() {
  return <TmntFaqBody />;
}
