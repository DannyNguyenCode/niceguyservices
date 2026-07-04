import type { Metadata } from "next";
import { SaturdayPetMarketDatabaseErrorBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketDatabaseErrorBody";

export const metadata: Metadata = {
  title: "Database Unavailable | Pet Market",
};

export default function SaturdayPetMarketDatabaseErrorPage() {
  return <SaturdayPetMarketDatabaseErrorBody />;
}
