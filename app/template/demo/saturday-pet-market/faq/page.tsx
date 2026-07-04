import type { Metadata } from "next";
import { SaturdayPetMarketFaqBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketFaqBody";

export const metadata: Metadata = {
  title: "FAQ & Information Desk | Saturday Morning Pet Market (demo)",
};

export default function SaturdayPetMarketFaqPage() {
  return <SaturdayPetMarketFaqBody />;
}
