import type { Metadata } from "next";
import { Suspense } from "react";
import { CompanionPetCheckoutBody } from "@/components/templates/demos/companion-pet/CompanionPetCheckoutBody";

export const metadata: Metadata = {
  title: "Checkout - Companion Pet Supply (demo)",
};

export default function CompanionPetCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CompanionPetCheckoutBody />
    </Suspense>
  );
}
