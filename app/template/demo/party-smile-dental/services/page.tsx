import type { Metadata } from "next";
import { PartySmileDentalServicesBody } from "@/components/templates/demos/party-smile-dental/PartySmileDentalServicesBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Services - Smile Board Family Dental (demo)",
  alternates: { canonical: absoluteUrl("/template/demo/party-smile-dental/services") },
};

export default function PartySmileDentalServicesPage() {
  return <PartySmileDentalServicesBody />;
}
