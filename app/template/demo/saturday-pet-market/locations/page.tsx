import type { Metadata } from "next";
import { SaturdayPetMarketLocationsBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketLocationsBody";

export const metadata: Metadata = {
  title: "Our Locations | Saturday Morning Pet Market (demo)",
};

export default function SaturdayPetMarketLocationsPage() {
  return <SaturdayPetMarketLocationsBody />;
}
