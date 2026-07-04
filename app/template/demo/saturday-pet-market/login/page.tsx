import type { Metadata } from "next";
import { SaturdayPetMarketLoginBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketLoginBody";

export const metadata: Metadata = {
  title: "Join the Pack | Saturday Morning Pet Market (demo)",
};

export default function SaturdayPetMarketLoginPage() {
  return <SaturdayPetMarketLoginBody />;
}
