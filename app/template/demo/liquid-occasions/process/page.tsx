import type { Metadata } from "next";
import { LiquidOccasionsProcessBody } from "@/components/templates/demos/liquid-occasions/LiquidOccasionsProcessBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Our Process | Liquid Occasions (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/liquid-occasions/process") },
};

export default function LiquidOccasionsProcessPage() {
  return <LiquidOccasionsProcessBody />;
}
