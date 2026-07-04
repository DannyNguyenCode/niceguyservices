import type { Metadata } from "next";
import { SaturdayPetMarketNotFoundBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketNotFoundBody";

export const metadata: Metadata = {
  title: "404 - The Trail Went Cold | Pet Market",
};

export default function SaturdayPetMarketNotFound() {
  return <SaturdayPetMarketNotFoundBody />;
}
