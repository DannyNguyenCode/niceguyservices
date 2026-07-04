import type { Metadata } from "next";
import { LiquidOccasionsExperiencesBody } from "@/components/templates/demos/liquid-occasions/LiquidOccasionsExperiencesBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Event Experiences | Liquid Occasions (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/liquid-occasions/experiences") },
};

export default function LiquidOccasionsExperiencesPage() {
  return <LiquidOccasionsExperiencesBody />;
}
