import type { Metadata } from "next";
import { TmntContactBody } from "@/components/experience-templates/tmnt-construction/TmntContactBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TMNT — Trades | Contact (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/contact") },
};

export default function TmntConstructionContactPage() {
  return <TmntContactBody />;
}
