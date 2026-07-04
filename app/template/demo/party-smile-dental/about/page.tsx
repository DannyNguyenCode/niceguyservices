import type { Metadata } from "next";
import { PartySmileDentalAboutBody } from "@/components/templates/demos/party-smile-dental/PartySmileDentalAboutBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "About - Smile Board Family Dental (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/party-smile-dental/about") },
};

export default function PartySmileDentalAboutPage() {
  return <PartySmileDentalAboutBody />;
}
