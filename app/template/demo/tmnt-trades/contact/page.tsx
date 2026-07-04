import type { Metadata } from "next";
import { TmntContactBody } from "@/components/templates/demos/tmnt-construction/TmntContactBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "TMNT — Trades | Contact (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/contact") },
};

export default function TmntConstructionContactPage() {
  return <TmntContactBody />;
}
