import type { Metadata } from "next";
import { LooneyToonsCafeCheckoutBody } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeCheckoutBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | Checkout (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services/checkout") },
};

export default function LooneyToonsCafeCheckoutPage() {
  return <LooneyToonsCafeCheckoutBody />;
}
