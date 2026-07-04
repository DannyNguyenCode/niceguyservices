import type { Metadata } from "next";
import { SaturdayPetMarketRewardsBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketRewardsBody";

export const metadata: Metadata = {
  title: "Rewards Club | Saturday Morning Pet Market (demo)",
};

export default function SaturdayPetMarketRewardsPage() {
  return <SaturdayPetMarketRewardsBody />;
}
