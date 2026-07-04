import type { Metadata } from "next";
import { Suspense } from "react";
import { PawsomeCheckoutBody } from "@/components/templates/demos/pawsome/PawsomeCheckoutBody";

export const metadata: Metadata = {
  title: "Secure Checkout - Pawsome (demo)",
};

export default function PawsomeCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <PawsomeCheckoutBody />
    </Suspense>
  );
}
