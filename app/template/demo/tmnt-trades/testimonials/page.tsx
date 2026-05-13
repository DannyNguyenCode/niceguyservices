import type { Metadata } from "next";
import { TmntTestimonialsBody } from "@/components/experience-templates/tmnt-construction/TmntTestimonialsBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "TMNT — Trades | Reviews (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/testimonials") },
};

export default function TmntConstructionTestimonialsPage() {
  return <TmntTestimonialsBody />;
}
