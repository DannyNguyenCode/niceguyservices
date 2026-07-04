import type { Metadata } from "next";
import { LiquidOccasionsJourneyBody } from "@/components/templates/demos/liquid-occasions/LiquidOccasionsJourneyBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Start Your Journey | Liquid Occasions (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/liquid-occasions/journey") },
};

export default function LiquidOccasionsJourneyPage() {
  return <LiquidOccasionsJourneyBody />;
}
