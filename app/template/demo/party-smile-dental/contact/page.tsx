import type { Metadata } from "next";
import { PartySmileDentalContactBody } from "@/components/templates/demos/party-smile-dental/PartySmileDentalContactBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Contact - Smile Board Family Dental (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/party-smile-dental/contact") },
};

export default function PartySmileDentalContactPage() {
  return <PartySmileDentalContactBody />;
}
