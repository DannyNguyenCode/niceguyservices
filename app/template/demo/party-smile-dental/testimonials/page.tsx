import type { Metadata } from "next";
import { PartySmileDentalTestimonialsBody } from "@/components/templates/demos/party-smile-dental/PartySmileDentalTestimonialsBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Testimonials - Smile Board Family Dental (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/party-smile-dental/testimonials") },
};

export default function PartySmileDentalTestimonialsPage() {
  return <PartySmileDentalTestimonialsBody />;
}
