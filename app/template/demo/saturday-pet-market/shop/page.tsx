import type { Metadata } from "next";
import { Suspense } from "react";
import { SaturdayPetMarketShopBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketShopBody";

export const metadata: Metadata = {
  title: "Shop | Saturday Morning Pet Market (demo)",
};

export default function SaturdayPetMarketShopPage() {
  return (
    <Suspense fallback={null}>
      <SaturdayPetMarketShopBody />
    </Suspense>
  );
}
