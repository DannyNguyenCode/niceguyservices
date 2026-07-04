import type { Metadata } from "next";
import { PartySmileDentalFormsBody } from "@/components/templates/demos/party-smile-dental/PartySmileDentalFormsBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Dental Forms - Smile Board Family Dental (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/party-smile-dental/forms") },
};

export default function PartySmileDentalFormsPage() {
  return <PartySmileDentalFormsBody />;
}
