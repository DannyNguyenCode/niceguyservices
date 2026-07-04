import type { Metadata } from "next";
import { LiquidOccasionsPortfolioBody } from "@/components/templates/demos/liquid-occasions/LiquidOccasionsPortfolioBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Portfolio | Liquid Occasions (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/liquid-occasions/portfolio") },
};

export default function LiquidOccasionsPortfolioPage() {
  return <LiquidOccasionsPortfolioBody />;
}
