import type { Metadata } from "next";
import { SaturdayPetMarketContactBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketContactBody";

export const metadata: Metadata = {
  title: "Contact & Support | Saturday Morning Pet Market (demo)",
};

export default function SaturdayPetMarketContactPage() {
  return <SaturdayPetMarketContactBody />;
}
