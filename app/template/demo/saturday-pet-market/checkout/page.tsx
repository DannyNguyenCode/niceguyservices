import type { Metadata } from "next";
import { Suspense } from "react";
import { SaturdayPetMarketCheckoutBody } from "@/components/templates/demos/saturday-pet-market/SaturdayPetMarketCheckoutBody";

export const metadata: Metadata = {
  title: "Checkout | Pet Market (demo)",
};

export default function SaturdayPetMarketCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <SaturdayPetMarketCheckoutBody />
    </Suspense>
  );
}
