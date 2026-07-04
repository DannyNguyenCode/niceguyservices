import type { Metadata } from "next";
import { TmntTestimonialsBody } from "@/components/templates/demos/tmnt-construction/TmntTestimonialsBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "TMNT — Trades | Reviews (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/tmnt-trades/testimonials") },
};

export default function TmntConstructionTestimonialsPage() {
  return <TmntTestimonialsBody />;
}
