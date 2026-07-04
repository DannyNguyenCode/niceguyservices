import type { Metadata } from "next";
import { SaturdayPetMarketCartBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketCartBody";

export const metadata: Metadata = {
  title: "Your Cart | Saturday Morning Pet Market (demo)",
};

export default function SaturdayPetMarketCartPage() {
  return <SaturdayPetMarketCartBody />;
}
