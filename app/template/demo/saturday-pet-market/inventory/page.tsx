import type { Metadata } from "next";
import { SaturdayPetMarketInventoryBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketInventoryBody";

export const metadata: Metadata = {
  title: "Inventory | Pet Market (demo)",
};

export default function SaturdayPetMarketInventoryPage() {
  return <SaturdayPetMarketInventoryBody />;
}
