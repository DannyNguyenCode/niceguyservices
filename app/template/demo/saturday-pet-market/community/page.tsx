import type { Metadata } from "next";
import { SaturdayPetMarketCommunityBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketCommunityBody";

export const metadata: Metadata = {
  title: "Community Hub | Saturday Morning Pet Market (demo)",
};

export default function SaturdayPetMarketCommunityPage() {
  return <SaturdayPetMarketCommunityBody />;
}
