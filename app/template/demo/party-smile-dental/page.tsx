import type { Metadata } from "next";
import { PartySmileDentalHomeBody } from "@/components/templates/demos/party-smile-dental/PartySmileDentalHomeBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Home - Smile Board Family Dental (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/party-smile-dental") },
};

export default function PartySmileDentalHomePage() {
  return <PartySmileDentalHomeBody />;
}
