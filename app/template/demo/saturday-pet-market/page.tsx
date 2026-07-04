import type { Metadata } from "next";
import { SaturdayPetMarketHomeBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Saturday Morning Pet Market | Your Neighborhood Pet Store (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/saturday-pet-market") },
};

export default function SaturdayPetMarketHomePage() {
  return <SaturdayPetMarketHomeBody />;
}
