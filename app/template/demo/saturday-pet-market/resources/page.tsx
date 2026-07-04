import type { Metadata } from "next";
import { SaturdayPetMarketResourcesBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketResourcesBody";

export const metadata: Metadata = {
  title: "Resource Center | Saturday Morning Pet Market (demo)",
};

export default function SaturdayPetMarketResourcesPage() {
  return <SaturdayPetMarketResourcesBody />;
}
