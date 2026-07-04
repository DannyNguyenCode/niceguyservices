import type { Metadata } from "next";
import { LiquidOccasionsHomeBody } from "@/components/templates/demos/liquid-occasions/LiquidOccasionsHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Liquid Occasions | Your Event Starts With A Dream (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/liquid-occasions") },
};

export default function LiquidOccasionsHomePage() {
  return <LiquidOccasionsHomeBody />;
}
