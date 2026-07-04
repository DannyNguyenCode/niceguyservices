import type { Metadata } from "next";
import { LooneyToonsCafeOrderSuccessBody } from "@/components/templates/demos/looneytoons-cafe/LooneyToonsCafeOrderSuccessBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "LooneyTunes — Services | Order confirmed (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/looneytunes-services/checkout/success") },
};

export default function LooneyToonsCafeOrderSuccessPage() {
  return <LooneyToonsCafeOrderSuccessBody />;
}
