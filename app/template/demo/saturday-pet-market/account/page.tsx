import type { Metadata } from "next";
import { SaturdayPetMarketAccountBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketAccountBody";

export const metadata: Metadata = {
  title: "Account Dashboard | Pet Market (demo)",
};

export default function SaturdayPetMarketAccountPage() {
  return <SaturdayPetMarketAccountBody />;
}
