import type { Metadata } from "next";
import { KinshipCapitalPricingBody } from "@/components/templates/demos/kinship-capital/KinshipCapitalPricingBody";

export const metadata: Metadata = {
  title: "Pricing | Heritage Financial (demo)",
};

export default function KinshipCapitalPricingPage() {
  return <KinshipCapitalPricingBody />;
}
